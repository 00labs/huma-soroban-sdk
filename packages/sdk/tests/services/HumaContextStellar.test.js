"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const HumaContextStellar_1 = require("../../src/services/HumaContextStellar");
const StellarWallet_1 = require("../../src/services/StellarWallet");
const utils_1 = require("../../src/utils");
describe('HumaContextStellar', () => {
    const mockNetwork = utils_1.StellarNetwork.testnet;
    const mockWallet = new StellarWallet_1.StellarWallet('SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO');
    const mockPoolName = utils_1.POOL_NAME.Arf;
    const mockPoolType = utils_1.POOL_TYPE.Creditline;
    it('should throw an error if any parameter is missing', () => {
        expect(() => new HumaContextStellar_1.HumaContextStellar({
            wallet: null,
            network: mockNetwork,
            poolName: mockPoolName,
            poolType: mockPoolType,
        })).toThrow('All parameters are required');
        expect(() => new HumaContextStellar_1.HumaContextStellar({
            wallet: mockWallet,
            network: null,
            poolName: mockPoolName,
            poolType: mockPoolType,
        })).toThrow('All parameters are required');
    });
    it('should correctly initialize with all parameters', () => {
        const context = new HumaContextStellar_1.HumaContextStellar({
            wallet: mockWallet,
            network: mockNetwork,
            poolName: mockPoolName,
            poolType: mockPoolType,
        });
        expect(context.wallet).toBe(mockWallet);
        expect(context.network).toBe(mockNetwork);
        expect(context.poolName).toBe(mockPoolName);
        expect(context.poolType).toBe(mockPoolType);
    });
});
