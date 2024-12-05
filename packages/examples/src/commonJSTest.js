require("dotenv").config();
const wallet = require("../../sdk/dist/cjs/services/StellarWallet.js");
const helper = require("../../sdk/dist/cjs/helpers/CreditContractHelper.js");

const borrower = new wallet.StellarWallet(process.env.TEST_PRIVATE_KEY);

console.log(helper);
async function getBalance() {
  const res = await helper.getAvailableBalanceForPool(
    "Roam",
    "testnet",
    borrower
  );
  console.log(res);
}

getBalance();
