import 'dotenv/config'

import {
  drawdown,
  makePayment,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
} from '../src'

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
  console.log(
    `Drawdown success. Tx hash: ${drawdownResult.sendTransactionResponse?.hash}`,
  )

  const paymentAmount = 100_0000000n
  const makePaymentResult = await makePayment(
    POOL_NAME.Arf,
    StellarNetwork.localnet,
    wallet,
    paymentAmount,
    true,
  )
  console.log(
    `Payment success. Tx hash: ${makePaymentResult.sendTransactionResponse?.hash}`,
  )
}

main()
