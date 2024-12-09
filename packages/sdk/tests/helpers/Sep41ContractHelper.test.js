"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sep41ContractHelper_1 = require("../../src/helpers/Sep41ContractHelper");
const services_1 = require("../../src/services");
const utils_1 = require("../../src/utils");
jest.mock('../../src/utils/client', () => ({
    ...jest.requireActual('../../src/utils/client'),
    getUnderlyingTokenClient: jest.fn(),
}));
jest.mock('../../src/utils/transaction', () => ({
    ...jest.requireActual('../../src/utils/transaction'),
    sendTransaction: jest.fn(),
}));
jest.mock('../../src/utils/common', () => ({
    ...jest.requireActual('../../src/utils/common'),
    getLatestLedger: jest.fn(),
}));
describe('approveSep41Allowance', () => {
    const mockPoolName = utils_1.POOL_NAME.Arf;
    const mockNetwork = utils_1.StellarNetwork.mainnet;
    const mockWallet = new services_1.StellarWallet('SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO');
    const mockSpenderAddress = 'spender123';
    it('should return a transaction result', async () => {
        ;
        utils_1.sendTransaction
            .mockResolvedValueOnce({
            result: 500n,
        })
            .mockResolvedValueOnce({
            result: 'transactionResult',
        });
        const mockLatestLedger = { sequence: 123456 };
        utils_1.getLatestLedger.mockResolvedValue(mockLatestLedger);
        const result = await (0, Sep41ContractHelper_1.approveSep41Allowance)(mockPoolName, mockNetwork, mockWallet, mockSpenderAddress);
        expect(result).toEqual({ result: 'transactionResult' });
    });
});
