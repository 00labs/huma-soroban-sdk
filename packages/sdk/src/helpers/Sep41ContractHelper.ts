import { SentTransaction } from '@huma-finance/soroban-pool-credit'

import { StellarWallet } from '../services'
import {
  getLatestLedger,
  getUnderlyingTokenClient,
  StellarNetwork,
} from '../utils'

/**
 * Approves an Sep41 allowance for a spender address, if the current allowance is insufficient.
 * Allowance is required to do certain actions on the Huma protocol (e.g. makePayment for Autopay)
 *
 * @async
 * @function
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The wallet used to send the transaction.
 * @param {string} tokenAddress - The address of the Sep41 token to approve.
 * @param {string} spenderAddress - The address of the spender to approve an allowance for.
 * @param {bigint} allowanceAmount - The amount of tokens to approve, if applicable. Denominated in the Sep41 tokens.
 * @returns {Promise<SentTransaction<null> | null>} - A Promise of the transaction response, or null if the allowance was already sufficient.
 */
export async function approveSep41AllowanceIfInsufficient(
  network: StellarNetwork,
  wallet: StellarWallet,
  tokenAddress: string,
  spenderAddress: string,
  allowanceAmount: bigint,
): Promise<SentTransaction<null> | null> {
  const tokenClient = getUnderlyingTokenClient(tokenAddress, network, wallet)

  const [{ result: allowance }, { result: decimals }] = await Promise.all([
    tokenClient.allowance({
      from: wallet.userInfo.publicKey,
      spender: spenderAddress,
    }),
    tokenClient.decimals(),
  ])

  if (allowance < allowanceAmount) {
    const latestLedger = await getLatestLedger(network)
    // @TODO find a better to advance the ledger number
    const advanceLedgerNum = 3_000_000
    const tx = await tokenClient.approve(
      {
        from: wallet.userInfo.publicKey,
        spender: spenderAddress,
        amount: BigInt(1000_000_000 * Math.pow(10, Number(decimals))),
        expiration_ledger: latestLedger.sequence + advanceLedgerNum,
      },
      {
        timeoutInSeconds: 30,
      },
    )
    const result = await tx.signAndSend()
    return result
  }

  return null
}
