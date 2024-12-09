"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const CreditContractHelper_1 = require("../../src/helpers/CreditContractHelper");
const Sep41ContractHelper_1 = require("../../src/helpers/Sep41ContractHelper");
const services_1 = require("../../src/services");
const utils_1 = require("../../src/utils");
const transaction_1 = require("../../src/utils/transaction");
jest.mock('../../src/utils/client', () => ({
    ...jest.requireActual('../../src/utils/client'),
    getPoolStorageClient: jest.fn(),
    getCreditStorageClient: jest.fn(),
    getPoolCreditClient: jest.fn(),
}));
jest.mock('../../src/utils/transaction', () => ({
    ...jest.requireActual('../../src/utils/transaction'),
    sendTransaction: jest.fn(),
}));
jest.mock('../../src/helpers/Sep41ContractHelper', () => ({
    ...jest.requireActual('../../src/helpers/Sep41ContractHelper'),
    approveSep41Allowance: jest.fn(),
}));
describe('getAvailableBalanceForPool', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should return available balance', async () => {
        ;
        transaction_1.sendTransaction.mockReturnValue({
            result: 100n,
        });
        const wallet = new services_1.StellarWallet('SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO');
        const result = await (0, CreditContractHelper_1.getAvailableBalanceForPool)(utils_1.POOL_NAME.Arf, utils_1.StellarNetwork.mainnet, wallet);
        expect(result).toBe(100n);
    });
});
describe('getCreditRecordForPool', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const mockPoolName = utils_1.POOL_NAME.Arf;
    const mockNetwork = utils_1.StellarNetwork.mainnet;
    const mockWallet = new services_1.StellarWallet('SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO');
    const mockBorrower = 'GTESTBORROWER';
    it('should throw an error if credit hash is not found', async () => {
        ;
        transaction_1.sendTransaction.mockResolvedValue({
            result: undefined,
        });
        await expect((0, CreditContractHelper_1.getCreditRecordForPool)(mockPoolName, mockNetwork, mockWallet, mockBorrower)).rejects.toThrow('Could not find credit hash');
    });
    it('should throw an error if credit record is not found', async () => {
        ;
        transaction_1.sendTransaction
            .mockResolvedValueOnce({
            result: 'hash123',
        })
            .mockResolvedValueOnce({
            result: null,
        });
        await expect((0, CreditContractHelper_1.getCreditRecordForPool)(mockPoolName, mockNetwork, mockWallet, mockBorrower)).rejects.toThrow('Could not find credit record');
    });
    it('should return the credit record if found', async () => {
        const expectedCreditRecord = { id: 'record123', amount: 1000n };
        transaction_1.sendTransaction
            .mockResolvedValueOnce({
            result: 'hash123',
        })
            .mockResolvedValueOnce({
            result: expectedCreditRecord,
        });
        const creditRecord = await (0, CreditContractHelper_1.getCreditRecordForPool)(mockPoolName, mockNetwork, mockWallet, mockBorrower);
        expect(creditRecord).toEqual(expectedCreditRecord);
    });
});
describe('getAvailableCreditForPool', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const mockPoolName = utils_1.POOL_NAME.Arf;
    const mockNetwork = utils_1.StellarNetwork.mainnet;
    const mockWallet = new services_1.StellarWallet('SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO');
    const mockBorrower = 'GTESTBORROWER';
    it('should throw an error if credit hash is not found', async () => {
        ;
        transaction_1.sendTransaction.mockResolvedValueOnce({
            result: null,
        });
        await expect((0, CreditContractHelper_1.getAvailableCreditForPool)(mockPoolName, mockNetwork, mockWallet, mockBorrower)).rejects.toThrow('Could not find credit hash');
    });
    it('should throw an error if credit config or credit record is not found', async () => {
        ;
        transaction_1.sendTransaction
            .mockResolvedValueOnce({
            result: 'hash123',
        })
            .mockResolvedValueOnce({
            result: null,
        })
            .mockResolvedValueOnce({
            result: null,
        });
        await expect((0, CreditContractHelper_1.getAvailableCreditForPool)(mockPoolName, mockNetwork, mockWallet, mockBorrower)).rejects.toThrow('Could not find credit config or credit record');
    });
    it('should return the available credit if all data is found', async () => {
        const mockCreditConfig = { credit_limit: 5000n };
        const mockCreditRecord = { unbilled_principal: 1000n };
        transaction_1.sendTransaction
            .mockResolvedValueOnce({
            result: 'hash123',
        })
            .mockResolvedValueOnce({
            result: mockCreditConfig,
        })
            .mockResolvedValueOnce({
            result: mockCreditRecord,
        });
        const availableCredit = await (0, CreditContractHelper_1.getAvailableCreditForPool)(mockPoolName, mockNetwork, mockWallet, mockBorrower);
        expect(availableCredit).toEqual(4000n);
    });
});
describe('getTotalDue', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const mockPoolName = utils_1.POOL_NAME.Arf;
    const mockNetwork = utils_1.StellarNetwork.mainnet;
    const mockWallet = new services_1.StellarWallet('SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO');
    const mockBorrower = 'GTESTBORROWER';
    it('should handle errors thrown by getCreditRecordForPool', async () => {
        ;
        transaction_1.sendTransaction.mockResolvedValueOnce({
            result: null,
        });
        await expect((0, CreditContractHelper_1.getTotalDue)(mockPoolName, mockNetwork, mockWallet, mockBorrower)).rejects.toThrow('Could not find credit hash');
    });
    it('should return the sum of next_due and total_past_due if credit record is found', async () => {
        const mockCreditRecord = {
            next_due: 1000n,
            total_past_due: 500n,
        };
        transaction_1.sendTransaction
            .mockResolvedValueOnce({
            result: 'hash123',
        })
            .mockResolvedValueOnce({
            result: mockCreditRecord,
        });
        const totalDue = await (0, CreditContractHelper_1.getTotalDue)(mockPoolName, mockNetwork, mockWallet, mockBorrower);
        expect(totalDue).toEqual(1500n);
    });
});
describe('approveAllowanceForSentinel', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const mockPoolName = utils_1.POOL_NAME.Arf;
    const mockNetwork = utils_1.StellarNetwork.mainnet;
    const mockWallet = new services_1.StellarWallet('SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO');
    it('should throw an error if credit hash is not found', async () => {
        ;
        transaction_1.sendTransaction.mockResolvedValueOnce({
            result: null,
        });
        await expect((0, CreditContractHelper_1.approveAllowanceForSentinel)(mockPoolName, mockNetwork, mockWallet)).rejects.toThrow('Could not find credit hash');
    });
    it('should return a transaction if all conditions are met', async () => {
        const mockTransaction = { id: 'tx123' };
        transaction_1.sendTransaction
            .mockResolvedValueOnce({
            result: 'hash123',
        })
            .mockResolvedValueOnce({
            result: {
                next_due: 1000n,
                total_past_due: 500n,
            },
        })
            .mockResolvedValueOnce({
            result: 'token123',
        })
            .mockResolvedValueOnce({
            result: 'sentinel123',
        });
        Sep41ContractHelper_1.approveSep41Allowance.mockResolvedValueOnce(mockTransaction);
        const result = await (0, CreditContractHelper_1.approveAllowanceForSentinel)(mockPoolName, mockNetwork, mockWallet);
        expect(result).toEqual(mockTransaction);
    });
});
describe('drawdown', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const mockPoolName = utils_1.POOL_NAME.Arf;
    const mockNetwork = utils_1.StellarNetwork.mainnet;
    const mockWallet = new services_1.StellarWallet('SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO');
    const mockDrawdownAmount = 1000n;
    it('should return a transaction result if all conditions are met', async () => {
        ;
        transaction_1.sendTransaction
            .mockResolvedValueOnce({
            result: 'hash123',
        })
            .mockResolvedValueOnce({
            result: {
                next_due: 1000n,
                total_past_due: 500n,
            },
        })
            .mockResolvedValueOnce({
            result: 'sentinel123',
        })
            .mockResolvedValueOnce({
            result: 'transactionResult',
        });
        Sep41ContractHelper_1.approveSep41Allowance.mockResolvedValueOnce({});
        const result = await (0, CreditContractHelper_1.drawdown)(mockPoolName, mockNetwork, mockWallet, mockDrawdownAmount);
        expect(result).toEqual({
            result: 'transactionResult',
        });
    });
});
describe('makePayment', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const mockPoolName = utils_1.POOL_NAME.Arf;
    const mockNetwork = utils_1.StellarNetwork.mainnet;
    const mockWallet = new services_1.StellarWallet('SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO');
    const mockPaymentAmount = 1000n;
    it('should return a transaction result if all conditions are met for make_principal_payment', async () => {
        const mockPrincipalOnly = true;
        transaction_1.sendTransaction
            .mockResolvedValueOnce({
            result: 'hash123',
        })
            .mockResolvedValueOnce({
            result: {
                next_due: 1000n,
                total_past_due: 500n,
            },
        })
            .mockResolvedValueOnce({
            result: 'sentinel123',
        })
            .mockResolvedValueOnce({
            result: 'sentinel123',
        })
            .mockResolvedValueOnce({
            result: 'transactionResult',
        });
        Sep41ContractHelper_1.approveSep41Allowance.mockResolvedValue({});
        const result = await (0, CreditContractHelper_1.makePayment)(mockPoolName, mockNetwork, mockWallet, mockPaymentAmount, mockPrincipalOnly);
        expect(result).toEqual({
            result: 'transactionResult',
        });
        expect(transaction_1.sendTransaction).toHaveBeenLastCalledWith({
            context: expect.any(Object),
            method: 'make_principal_payment',
            params: [
                {
                    name: 'borrower',
                    type: utils_1.ScValType.address,
                    value: mockWallet.userInfo.publicKey,
                },
                {
                    name: 'amount',
                    type: utils_1.ScValType.u128,
                    value: mockPaymentAmount,
                },
            ],
            shouldSignTransaction: true,
        });
    });
    it('should return a transaction result if all conditions are met for make_payment', async () => {
        const mockPrincipalOnly = false;
        transaction_1.sendTransaction
            .mockResolvedValueOnce({
            result: 'hash123',
        })
            .mockResolvedValueOnce({
            result: {
                next_due: 1000n,
                total_past_due: 500n,
            },
        })
            .mockResolvedValueOnce({
            result: 'sentinel123',
        })
            .mockResolvedValueOnce({
            result: 'sentinel123',
        })
            .mockResolvedValueOnce({
            result: 'transactionResult',
        });
        Sep41ContractHelper_1.approveSep41Allowance.mockResolvedValue({});
        const result = await (0, CreditContractHelper_1.makePayment)(mockPoolName, mockNetwork, mockWallet, mockPaymentAmount, mockPrincipalOnly);
        expect(result).toEqual({
            result: 'transactionResult',
        });
        expect(transaction_1.sendTransaction).toHaveBeenLastCalledWith({
            context: expect.any(Object),
            method: 'make_payment',
            params: [
                {
                    name: 'caller',
                    type: utils_1.ScValType.address,
                    value: mockWallet.userInfo.publicKey,
                },
                {
                    name: 'borrower',
                    type: utils_1.ScValType.address,
                    value: mockWallet.userInfo.publicKey,
                },
                {
                    name: 'amount',
                    type: utils_1.ScValType.u128,
                    value: mockPaymentAmount,
                },
            ],
            shouldSignTransaction: true,
        });
    });
});
