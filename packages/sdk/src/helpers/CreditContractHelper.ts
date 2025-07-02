import { CreditConfig } from '@huma-finance/soroban-credit-storage'
import { CreditRecord } from '@huma-finance/soroban-pool-credit'

import { StellarWallet } from '../services'
import {
  POOL_NAME,
  ScValType,
  sendTransaction,
  StellarNetwork,
  TransactionContext,
} from '../utils'
import { approveSep41Allowance } from './Sep41ContractHelper'

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
  const poolStorageContext = new TransactionContext(
    poolName,
    network,
    wallet,
    'poolStorage',
  )

  const { result }: { result: bigint } = await sendTransaction({
    context: poolStorageContext,
    method: 'get_available_balance',
  })

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
  const creditStorageContext = new TransactionContext(
    poolName,
    network,
    wallet,
    'creditStorage',
  )

  const { result: creditHash }: { result: Buffer } = await sendTransaction({
    context: creditStorageContext,
    method: 'get_credit_hash',
    params: [
      {
        name: 'borrower',
        type: ScValType.address,
        value: borrower,
      },
    ],
  })
  if (!creditHash) {
    throw new Error('Could not find credit hash')
  }

  const { result: creditRecord }: { result: CreditRecord } =
    await sendTransaction({
      context: creditStorageContext,
      method: 'get_credit_record',
      params: [
        {
          name: 'credit_hash',
          type: ScValType.buffer,
          value: creditHash,
        },
      ],
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
  const creditStorageContext = new TransactionContext(
    poolName,
    network,
    wallet,
    'creditStorage',
  )

  const { result: creditHash }: { result: Buffer } = await sendTransaction({
    context: creditStorageContext,
    method: 'get_credit_hash',
    params: [
      {
        name: 'borrower',
        type: ScValType.address,
        value: borrower,
      },
    ],
  })
  if (!creditHash) {
    throw new Error('Could not find credit hash')
  }

  const creditHashParam = {
    name: 'credit_hash',
    type: ScValType.buffer,
    value: creditHash,
  }
  const { result: creditConfig }: { result: CreditConfig } =
    await sendTransaction({
      context: creditStorageContext,
      method: 'get_credit_config',
      params: [creditHashParam],
    })
  const { result: creditRecord }: { result: CreditRecord } =
    await sendTransaction({
      context: creditStorageContext,
      method: 'get_credit_record',
      params: [creditHashParam],
    })

  if (!creditConfig || !creditRecord) {
    throw new Error('Could not find credit config or credit record')
  }

  return (
    BigInt(creditConfig.credit_limit) - BigInt(creditRecord.unbilled_principal)
  )
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
 */
export async function approveAllowanceForSentinel(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
) {
  const poolStorageContext = new TransactionContext(
    poolName,
    network,
    wallet,
    'poolStorage',
  )
  const { result: sentinel }: { result: string } = await sendTransaction({
    context: poolStorageContext,
    method: 'get_sentinel',
  })

  const tx = await approveSep41Allowance(poolName, network, wallet, sentinel)

  return tx
}

/**
 * Draws down from a pool.
 * Note: To ensure that allowance is always available for autopay, please call approveAllowanceForSentinel() before calling this function.
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
) {
  const poolCreditContext = new TransactionContext(
    poolName,
    network,
    wallet,
    'poolCredit',
  )
  const result = await sendTransaction({
    context: poolCreditContext,
    method: 'drawdown',
    params: [
      {
        name: 'borrower',
        type: ScValType.address,
        value: wallet.userInfo.publicKey,
      },
      {
        name: 'amount',
        type: ScValType.u128,
        value: drawdownAmount,
      },
    ],
    shouldSignTransaction: false,
  })
  return result
}

/**
 * Makes a payment.
 * Note: To ensure that allowance is always available for autopay, please call approveAllowanceForSentinel() before calling this function.
 *
 * @async
 * @function
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {bigint} paymentAmount - The amount to payback.
 * @param {boolean} principalOnly - Whether this payment should ONLY apply to the principal
 * @returns {Promise<SentTransaction>} - A Promise of the SentTransaction.
 */
export async function makePayment(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  paymentAmount: bigint,
  principalOnly: boolean,
) {
  const poolCreditContext = new TransactionContext(
    poolName,
    network,
    wallet,
    'poolCredit',
  )
  const params = [
    {
      name: 'borrower',
      type: ScValType.address,
      value: wallet.userInfo.publicKey,
    },
    {
      name: 'amount',
      type: ScValType.u128,
      value: paymentAmount,
    },
  ]
  if (!principalOnly) {
    params.unshift({
      name: 'caller',
      type: ScValType.address,
      value: wallet.userInfo.publicKey,
    })
  }
  const result = await sendTransaction({
    context: poolCreditContext,
    method: principalOnly ? 'make_principal_payment' : 'make_payment',
    params: params,
    shouldSignTransaction: false,
  })
  return result
}
