import "dotenv/config";

import {
  getYieldToWithdraw,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
} from "@huma-finance/soroban-sdk";

const main = async () => {
  const borrower = new StellarWallet(process.env.TEST_PRIVATE_KEY as string);
  const poolName = POOL_NAME.Arf;
  const network = StellarNetwork.testnet;

  const availableYield = await getYieldToWithdraw(poolName, network, borrower);
  console.log("Available yield for tranche:", availableYield);
};

main();
