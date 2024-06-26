import {
  Client as PoolCreditClient,
  CreditRecord,
  SentTransaction,
} from '@huma-finance/soroban-pool-credit'

import { StellarWallet } from '../services/StellarWallet'
import {
  getCreditStorageClient,
  getPoolCreditClient,
  getPoolStorageClient,
} from '../utils/client'
import { POOL_NAME, StellarNetwork } from '../utils/network'
import { approveSep41AllowanceIfInsufficient } from './Sep41ContractHelper'

/**
 * Returns an soroban contract client instance for the credit line contract
 * associated with the given pool name on the current chain.
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @returns {PoolCreditClient | undefined} A contract client instance for the CreditLine contract or undefined if it could not be found.
 */
export function getCreditLineClient(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
): PoolCreditClient | undefined {
  return getPoolCreditClient(poolName, network, wallet)
}

/**
 * Returns the current pool balance available for borrowing
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 */
export async function getAvailableBalanceForPool(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
): Promise<bigint> {
  const poolStorageClient = getPoolStorageClient(poolName, network, wallet)
  if (!poolStorageClient) {
    throw new Error('Could not find credit contract for pool')
  }

  const { result } = await poolStorageClient.get_available_balance()
  return result
}

/**
 * Returns the credit record of the borrower
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {string} borrower - The address of the borrower to check the credit record for.
 */
export async function getCreditRecordForPool(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  borrower: string,
): Promise<CreditRecord> {
  const creditStorageClient = getCreditStorageClient(poolName, network, wallet)
  if (!creditStorageClient) {
    throw new Error('Could not find credit storage contract for pool')
  }

  const { result: creditHash } = await creditStorageClient.get_credit_hash({
    borrower,
  })
  if (!creditHash) {
    throw new Error('Could not find credit hash')
  }

  const { result: creditRecord } = await creditStorageClient.get_credit_record({
    credit_hash: creditHash,
  })
  if (!creditRecord) {
    throw new Error('Could not find credit record')
  }

  return creditRecord
}

/**
 * Returns the borrower's remaining credit they can use for borrowing. Note that this might not be
 * currently available for borrowing as the credit limit might exceed the available pool balance. Use
 * getPoolBalance() to get the current available pool balance.
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {string} borrower - The address of the borrower to check the available credit for.
 */
export async function getAvailableCreditForPool(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  borrower: string,
): Promise<bigint> {
  const creditStorageClient = getCreditStorageClient(poolName, network, wallet)
  if (!creditStorageClient) {
    throw new Error('Could not find credit storage contract for pool')
  }

  const { result: creditHash } = await creditStorageClient.get_credit_hash({
    borrower,
  })
  if (!creditHash) {
    throw new Error('Could not find credit hash')
  }

  const [{ result: creditConfig }, { result: creditRecord }] =
    await Promise.all([
      creditStorageClient.get_credit_config({
        credit_hash: creditHash,
      }),
      creditStorageClient.get_credit_record({
        credit_hash: creditHash,
      }),
    ])

  if (!creditConfig || !creditRecord) {
    throw new Error('Could not find credit config or credit record')
  }

  return creditConfig.credit_limit - creditRecord.unbilled_principal
}

/**
 * Returns borrower's total due amount in bigint format
 * associated with the given pool name on the current chain.
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {string} borrower - The address of the borrower to check the available credit for.
 * @returns {bigint | null} The account's total due amount in bigint format
 */
export async function getTotalDue(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  borrower: string,
): Promise<bigint | null> {
  const creditRecord = await getCreditRecordForPool(
    poolName,
    network,
    wallet,
    borrower,
  )

  if (!creditRecord) {
    return null
  }

  return creditRecord.next_due + creditRecord.total_past_due
}

/**
 * Approve allowance for sentinel if not enough allowance is approved.
 *
 * @async
 * @function
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @returns {Promise<SentTransaction>} - A Promise of the SentTransaction.
 */
export async function approveAllowanceForSentinel(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
): Promise<SentTransaction<null> | null> {
  const totalDue = await getTotalDue(
    poolName,
    network,
    wallet,
    wallet.userInfo.publicKey,
  )
  if (totalDue === null) {
    throw new Error('Could not find total due')
  }
  const poolStorageClient = getPoolStorageClient(poolName, network, wallet)
  if (!poolStorageClient) {
    throw new Error('Could not find pool storage contract for pool')
  }

  const [{ result: underlyingToken }, { result: sentinel }] = await Promise.all(
    [
      poolStorageClient.get_underlying_token(),
      poolStorageClient.get_sentinel(),
    ],
  )

  const tx = await approveSep41AllowanceIfInsufficient(
    network,
    wallet,
    underlyingToken,
    sentinel,
    totalDue,
  )

  return tx
}

/**
 * Draws down from a pool.
 *
 * @async
 * @function
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {BigNumberish} drawdownAmount - The amount to drawdown.
 * @returns {Promise<SentTransaction>} - A Promise of the SentTransaction.
 */
export async function drawdown(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  drawdownAmount: bigint,
): Promise<SentTransaction<null>> {
  const poolCreditClient = getPoolCreditClient(poolName, network, wallet)
  if (!poolCreditClient) {
    throw new Error('Could not find credit contract for pool')
  }

  // await approveAllowanceForSentinel(poolName, network, wallet)
  const tx = await poolCreditClient.drawdown(
    {
      borrower: wallet.userInfo.publicKey,
      amount: drawdownAmount,
    },
    {
      timeoutInSeconds: 30,
    },
  )
  const result = await tx.signAndSend()
  return result
}

/**
 * Makes a payment.
 *
 * @async
 * @function
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {bigint} paymentAmount - The amount to payback.
 * @param {boolean} principalOnly - Whether this payment should ONLY apply to the principal
 * @returns {Promise<AssembledTransaction>} - A Promise of the AssembledTransaction.
 */
export async function makePayment(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  paymentAmount: bigint,
  principalOnly: boolean,
): Promise<SentTransaction<readonly [bigint, boolean]>> {
  const poolCreditClient = getPoolCreditClient(poolName, network, wallet)
  if (!poolCreditClient) {
    throw new Error('Could not find credit contract for pool')
  }
  const poolStorageClient = getPoolStorageClient(poolName, network, wallet)
  if (!poolStorageClient) {
    throw new Error('Could not find pool storage contract for pool')
  }

  // await approveAllowanceForSentinel(poolName, network, wallet)
  // const [{ result: underlyingToken }, { result: sentinel }] = await Promise.all(
  //   [
  //     poolStorageClient.get_underlying_token(),
  //     poolStorageClient.get_sentinel(),
  //   ],
  // )

  let tx
  // tx = await approveSep41AllowanceIfInsufficient(
  //   network,
  //   wallet,
  //   underlyingToken,
  //   sentinel,
  //   paymentAmount,
  // )

  if (principalOnly) {
    tx = await poolCreditClient.make_principal_payment(
      {
        borrower: wallet.userInfo.publicKey,
        amount: paymentAmount,
      },
      {
        timeoutInSeconds: 30,
      },
    )
  } else {
    tx = await poolCreditClient.make_payment(
      {
        caller: wallet.userInfo.publicKey,
        borrower: wallet.userInfo.publicKey,
        amount: paymentAmount,
      },
      {
        timeoutInSeconds: 30,
      },
    )
  }

  const result = await tx.signAndSend()
  return result
}
