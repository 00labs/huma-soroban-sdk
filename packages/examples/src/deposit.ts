import "dotenv/config";

import {
  deposit,
  depositToTranche,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
} from "@huma-finance/soroban-sdk";

const main = async () => {
  const lender = new StellarWallet(process.env.TEST_PRIVATE_KEY as string);
  const poolName = POOL_NAME.Arf;
  const network = StellarNetwork.testnet;
  const assets = BigInt(100_000_000);

  // Deposit into a tranche using the high-level helper (defaults to junior tranche)
  const depositResult = await deposit(
    poolName,
    network,
    lender,
    assets,
    "juniorTranche"
  );
  console.log(
    `Deposit success. Tx hash: ${depositResult.sendTransactionResponse?.hash}`
  );

  // Deposit into a specific tranche
  const juniorDepositResult = await depositToTranche(
    poolName,
    network,
    lender,
    "juniorTranche",
    assets
  );
  console.log(
    `Deposit success. Junior tx hash: ${juniorDepositResult.sendTransactionResponse?.hash}`
  );
};

main();
