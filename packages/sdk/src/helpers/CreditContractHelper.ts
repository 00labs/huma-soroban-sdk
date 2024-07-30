import { CreditConfig } from '@huma-finance/soroban-credit-storage'
import { CreditRecord } from '@huma-finance/soroban-pool-credit'
import { SentTransaction } from '@stellar/stellar-sdk/lib/contract'

import { StellarWallet } from '../services/StellarWallet'
import { TransactionContext } from '../utils/client'
import { ScValType } from '../utils/common'
import { POOL_NAME, StellarNetwork } from '../utils/network'
import { sendTransaction } from '../utils/transaction'
import { approveSep41AllowanceIfInsufficient } from './Sep41ContractHelper'

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

  const { result } = await sendTransaction<bigint>({
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

  const { result: creditHash } = await sendTransaction<Buffer>({
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

  const { result: creditRecord } = await sendTransaction<CreditRecord>({
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

  const { result: creditHash } = await sendTransaction<Buffer>({
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
  const { result: creditConfig } = await sendTransaction<CreditConfig>({
    context: creditStorageContext,
    method: 'get_credit_config',
    params: [creditHashParam],
  })
  const { result: creditRecord } = await sendTransaction<CreditRecord>({
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

  const poolStorageContext = new TransactionContext(
    poolName,
    network,
    wallet,
    'poolStorage',
  )
  const { result: underlyingToken } = await sendTransaction<string>({
    context: poolStorageContext,
    method: 'get_underlying_token',
  })
  const { result: sentinel } = await sendTransaction<string>({
    context: poolStorageContext,
    method: 'get_sentinel',
  })

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
  await approveAllowanceForSentinel(poolName, network, wallet)

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
    shouldSignTransaction: true,
  })
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
 * @returns {Promise<SentTransaction>} - A Promise of the SentTransaction.
 */
export async function makePayment(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  paymentAmount: bigint,
  principalOnly: boolean,
): Promise<SentTransaction<readonly [bigint, boolean]>> {
  await approveAllowanceForSentinel(poolName, network, wallet)

  const poolStorageContext = new TransactionContext(
    poolName,
    network,
    wallet,
    'poolStorage',
  )
  const { result: underlyingToken } = await sendTransaction<string>({
    context: poolStorageContext,
    method: 'get_underlying_token',
  })
  const { result: sentinel } = await sendTransaction<string>({
    context: poolStorageContext,
    method: 'get_sentinel',
  })

  await approveSep41AllowanceIfInsufficient(
    network,
    wallet,
    underlyingToken,
    sentinel,
    paymentAmount,
  )

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
  const result = await sendTransaction<readonly [bigint, boolean]>({
    context: poolCreditContext,
    method: principalOnly ? 'make_principal_payment' : 'make_payment',
    params: params,
    shouldSignTransaction: true,
  })
  return result
}
