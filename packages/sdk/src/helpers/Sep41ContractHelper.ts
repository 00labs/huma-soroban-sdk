import { SentTransaction } from '@stellar/stellar-sdk/lib/contract'

import { StellarWallet } from '../services'
import {
  getLatestLedger,
  POOL_NAME,
  ScValType,
  sendTransaction,
  StellarNetwork,
  TransactionContext,
} from '../utils'

/**
 * Approves an Sep41 allowance for a spender address, if the current allowance is insufficient.
 * Allowance is required to do certain actions on the Huma protocol (e.g. makePayment for Autopay)
 *
 * @async
 * @function
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The wallet used to send the transaction.
 * @param {string} spenderAddress - The address of the spender to approve an allowance for.
 * @param {bigint} allowanceAmount - The amount of tokens to approve, if applicable. Denominated in the Sep41 tokens.
 * @returns {Promise<SentTransaction<null> | null>} - A Promise of the transaction response, or null if the allowance was already sufficient.
 */
export async function approveSep41AllowanceIfInsufficient(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  spenderAddress: string,
  allowanceAmount: bigint,
): Promise<SentTransaction<null> | null> {
  const underlyingTokenContext = new TransactionContext(
    poolName,
    network,
    wallet,
    'underlyingToken',
  )

  const { result: allowance } = await sendTransaction<number>({
    context: underlyingTokenContext,
    method: 'allowance',
    params: [
      {
        name: 'from',
        type: ScValType.address,
        value: wallet.userInfo.publicKey,
      },
      {
        name: 'spender',
        type: ScValType.address,
        value: spenderAddress,
      },
    ],
  })
  const { result: decimals } = await sendTransaction<number>({
    context: underlyingTokenContext,
    method: 'decimals',
  })

  if (allowance < allowanceAmount) {
    const latestLedger = await getLatestLedger(network)
    // @TODO find a better to advance the ledger number
    const advanceLedgerNum = 3_000_000

    const result = await sendTransaction({
      context: underlyingTokenContext,
      method: 'approve',
      params: [
        {
          name: 'from',
          type: ScValType.address,
          value: wallet.userInfo.publicKey,
        },
        {
          name: 'spender',
          type: ScValType.address,
          value: spenderAddress,
        },
        {
          name: 'amount',
          type: ScValType.i128,
          value: 1000_000_000 * Math.pow(10, Number(decimals)),
        },
        {
          name: 'expiration_ledger',
          type: ScValType.u32,
          value: latestLedger.sequence + advanceLedgerNum,
        },
      ],
      shouldSignTransaction: true,
    })

    return result
  }

  return null
}
