import "dotenv/config";

import {
  drawdown,
  getHumaConfigClient,
  makePayment,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
} from "@huma-finance/soroban-sdk";

const main = async () => {
  const wallet = new StellarWallet("Replace to secret key");

  const humaConfigClient = getHumaConfigClient(
    POOL_NAME.Arf,
    StellarNetwork.mainnet,
    wallet
  );

  const tx = await humaConfigClient.set_liquidity_asset(
    {
      addr: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
      valid: true,
    },
    { timeoutInSeconds: 30 }
  );

  await tx.signAndSend();
};

main();
