import { Keypair, Transaction } from '@stellar/stellar-sdk'

export class StellarWallet {
  #sourceKeypair: Keypair

  constructor(secretKey: string) {
    this.#sourceKeypair = Keypair.fromSecret(secretKey)
  }

  get keypair() {
    return this.#sourceKeypair
  }

  get userInfo() {
    return {
      publicKey: this.#sourceKeypair.publicKey(),
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async signTransaction(tx: string, opts: any) {
    const txFromXDR = new Transaction(tx, opts.networkPassphrase)
    txFromXDR.sign(this.#sourceKeypair)
    return txFromXDR.toXDR()
  }
}
