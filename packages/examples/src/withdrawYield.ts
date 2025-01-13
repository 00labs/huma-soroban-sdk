import "dotenv/config";

import {
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
  withdrawYieldFromTranche,
  withdrawYields,
} from "@huma-finance/soroban-sdk";

const main = async () => {
  const lender = new StellarWallet(process.env.TEST_PRIVATE_KEY as string);
  const poolName = POOL_NAME.Arf;
  const network = StellarNetwork.testnet;

  // Withdraw from all tranches
  const withdrawResult = await withdrawYields(poolName, network, lender);
  console.log(
    `Withdraw success. Junior tx hash: ${withdrawResult[0].sendTransactionResponse?.hash}`
  );
  console.log(
    `Withdraw success. Senior tx hash: ${withdrawResult[1].sendTransactionResponse?.hash}`
  );

  // Withdraw from a specific tranche
  const juniorWithdrawResult = await withdrawYieldFromTranche(
    poolName,
    network,
    lender,
    "juniorTranche"
  );
  console.log(
    `Withdraw success. Junior tx hash: ${juniorWithdrawResult.sendTransactionResponse?.hash}`
  );
};

main();
