import "dotenv/config";

import {
  getHumaConfigClient,
  POOL_NAME,
  StellarNetwork,
  StellarWallet,
} from "@huma-finance/soroban-sdk";

const main = async () => {
  const senderPublicKey = "senderPublicKey";
  const signer = new StellarWallet(process.env.TEST_SECRET_KEY!);

  const humaConfigClient = getHumaConfigClient(
    POOL_NAME.Arf,
    StellarNetwork.mainnet,
    signer,
    senderPublicKey
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
