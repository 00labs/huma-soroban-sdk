import "dotenv/config";

import {
  approveAllowanceForSentinel,
  drawdown,
  getAvailableBalanceForPool,
  getAvailableCreditForPool,
  getCreditRecordForPool,
  getTotalDue,
  makePayment,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
} from "@huma-finance/soroban-sdk";

const main = async () => {
  const borrower = new StellarWallet(process.env.TEST_PRIVATE_KEY as string);
  const poolName = POOL_NAME.Roam;
  const network = StellarNetwork.testnet;

  const availableBalanceForPool = await getAvailableBalanceForPool(
    poolName,
    network,
    borrower
  );
  console.log("Available balance for pool:", availableBalanceForPool);

  const creditRecord = await getCreditRecordForPool(
    poolName,
    network,
    borrower,
    borrower.userInfo.publicKey
  );
  console.log("Credit record:", creditRecord);

  const availableCreditForPool = await getAvailableCreditForPool(
    poolName,
    network,
    borrower,
    borrower.userInfo.publicKey
  );
  console.log("Available credit for pool:", availableCreditForPool);

  const totalDue = await getTotalDue(
    poolName,
    network,
    borrower,
    borrower.userInfo.publicKey
  );
  console.log("Total due:", totalDue);

  const approveAllowance = await approveAllowanceForSentinel(
    poolName,
    network,
    borrower
  );
  console.log(
    "approveAllowance:",
    approveAllowance.sendTransactionResponse?.hash
  );

  const drawdownResult = await drawdown(
    poolName,
    network,
    borrower,
    100_0000000 as any
  );
  console.log(
    `Drawdown success. Tx hash: ${drawdownResult.sendTransactionResponse?.hash}`
  );

  const paymentResult = await makePayment(
    poolName,
    network,
    borrower,
    100_0000000 as any,
    false
  );
  console.log(
    `Payment success. Tx hash: ${paymentResult.sendTransactionResponse?.hash}`
  );
};

main();
