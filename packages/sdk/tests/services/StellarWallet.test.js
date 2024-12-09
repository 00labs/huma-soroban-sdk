"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const StellarWallet_1 = require("../../src/services/StellarWallet");
jest.mock('@stellar/stellar-sdk', () => {
    const originalModule = jest.requireActual('@stellar/stellar-sdk');
    return {
        __esModule: true,
        ...originalModule,
        Keypair: {
            fromSecret: jest.fn().mockImplementation((secret) => ({
                publicKey: () => 'GABC123DEF456',
                sign: jest.fn(),
            })),
        },
        Transaction: jest.fn().mockImplementation((tx, opts) => ({
            sign: jest.fn(),
            toXDR: () => 'xdr_representation',
        })),
    };
});
describe('StellarWallet', () => {
    const secretKey = 'SABC123DEF456';
    let wallet;
    beforeEach(() => {
        wallet = new StellarWallet_1.StellarWallet(secretKey);
    });
    it('should create an instance with a public key', () => {
        expect(wallet.userInfo.publicKey).toEqual('GABC123DEF456');
    });
    it('should sign a transaction and return XDR', async () => {
        const tx = 'some_transaction';
        const opts = { networkPassphrase: 'Test SDF Network ; September 2015' };
        const signedXDR = await wallet.signTransaction(tx, opts);
        expect(signedXDR).toEqual('xdr_representation');
        expect(stellar_sdk_1.Transaction).toHaveBeenCalledWith(tx, opts.networkPassphrase);
    });
});
