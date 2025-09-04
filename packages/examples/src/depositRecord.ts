import "dotenv/config";

import {
  fetchStellarDepositRecord,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
  TransactionContext,
} from "@huma-finance/soroban-sdk";

const main = async () => {
  const wallet = new StellarWallet(process.env.TEST_PRIVATE_KEY as string);
  const poolName = POOL_NAME.Arf;
  const network = StellarNetwork.mainnet;

  const trancheContext = new TransactionContext(
    poolName,
    network,
    wallet,
    "seniorTranche"
  );

  const depositRecord = await fetchStellarDepositRecord(
    trancheContext,
    "GAPEI72LLOS43GQKPNJPS7BQL44UTZPAS472MTGAYQ4O3H5CUNNT7MOJ"
  );
  console.log("Deposit record:", depositRecord);
};

main();
