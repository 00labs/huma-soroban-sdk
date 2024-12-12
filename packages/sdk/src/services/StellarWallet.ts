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

  public async signTransaction(
    tx: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opts: any,
  ): Promise<{
    signedTxXdr: string
    signerAddress?: string
  }> {
    const txFromXDR = new Transaction(tx, opts.networkPassphrase)
    txFromXDR.sign(this.#sourceKeypair)
    return {
      signedTxXdr: txFromXDR.toXDR(),
      signerAddress: this.#sourceKeypair.publicKey(), // optional
    }
  }
}
