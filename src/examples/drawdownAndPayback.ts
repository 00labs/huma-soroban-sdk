import 'dotenv/config'

import { drawdown, POOL_NAME, StellarNetwork, StellarWallet } from '..'

const main = async () => {
  const wallet = new StellarWallet(process.env.TEST_PRIVATE_KEY!)
  //100 USDC. Stellar USDC's decimal is 7
  const borrowAmount = 100_0000000n

  const drawdownResult = await drawdown(
    POOL_NAME.Arf,
    StellarNetwork.localnet,
    wallet,
    borrowAmount,
  )
  drawdownResult.sendTransactionResponse?.hash
  console.log(
    `Drawdown success. Tx hash: ${drawdownResult.sendTransactionResponse?.hash}`,
  )
}

main()
