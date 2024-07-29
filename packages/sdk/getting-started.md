# Getting Started

In this guide we'll take a look at using Huma's Soroban SDK to call functions on our pool, and more.

## Installation

Huma's Soroban SDK can be installed using npm or yarn.

```
npm install @huma-shan/soroban-sdk
yarn add @huma-shan/soroban-sdk
```

## Approve lender

```javascript
import {
  getTrancheVaultClient,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
} from '@huma-shan/soroban-sdk'

const poolName = POOL_NAME.Arf
const network = StellarNetwork.testnet
const poolOperator = new StellarWallet(process.env.POOL_OPERATOR_SECRET_KEY)
const lender = new StellarWallet(process.env.LENDER_SECRET_KEY)

const trancheVaultClient = getTrancheVaultClient(
  poolName,
  network,
  poolOperator,
  'junior',
)

if (trancheVaultClient) {
  const tx = await trancheVaultClient.add_approved_lender(
    {
      caller: poolOperator.userInfo.publicKey,
      lender: lender.userInfo.publicKey,
    },
    {
      timeoutInSeconds: 30,
    },
  )
  await tx.signAndSend()
}
```

## Deposit

```javascript
import {
  getTrancheVaultClient,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
} from '@huma-shan/soroban-sdk'

const poolName = POOL_NAME.Arf
const network = StellarNetwork.testnet
const lender = new StellarWallet(process.env.LENDER_SECRET_KEY)

const trancheVaultClient = getTrancheVaultClient(
  poolName,
  network,
  lender,
  'junior',
)

if (trancheVaultClient) {
  const depositAmount = 100000000n
  const tx = await trancheVaultClient.deposit(
    {
      lender: lender.userInfo.publicKey,
      assets: depositAmount,
    },
    {
      timeoutInSeconds: 30,
    },
  )
  await tx.signAndSend()
}
```

## Approve borrower

```javascript
import {
  getCreditManagerClient,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
} from '@huma-shan/soroban-sdk'

const poolName = POOL_NAME.Arf
const network = StellarNetwork.testnet
const ea = new StellarWallet(process.env.EA_SECRET_KEY)
const borrower = new StellarWallet(process.env.BORROWER_SECRET_KEY)

const creditManagerClient = getCreditManagerClient(poolName, network, ea)

if (creditManagerClient) {
  const tx = await creditManagerClient.approve_borrower(
    {
      borrower: borrower.userInfo.publicKey,
      credit_limit: 1000_0000000n,
      num_periods: 5,
      yield_bps: 1200,
      committed_amount: 0n,
      designated_start_date: 0n,
      revolving: true,
    },
    {
      timeoutInSeconds: 30,
    },
  )
  await tx.signAndSend()
}
```

## Borrower drawdown and makePayment

```javascript
import {
  drawdown,
  makePayment,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
} from '@huma-shan/soroban-sdk'

const poolName = POOL_NAME.Arf
const network = StellarNetwork.testnet
const borrower = new StellarWallet(process.env.BORROWER_SECRET_KEY)

const borrowAmount = 100_0000000n
const drawdownResult = await drawdown(poolName, network, borrower, borrowAmount)
console.log(
  `Drawdown success. Tx hash: ${drawdownResult.sendTransactionResponse?.hash}`,
)

const paymentAmount = 100_0000000n
const makePaymentResult = await makePayment(
  poolName,
  network,
  borrower,
  paymentAmount,
  true,
)
console.log(
  `Payment success. Tx hash: ${makePaymentResult.sendTransactionResponse?.hash}`,
)
```

## Next steps

If you want to learn more about the different functions and helpers available in the Huma SDK, please check out our [API documentation](API.md).
