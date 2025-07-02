/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  approveAllowanceForSentinel,
  drawdown,
  getAvailableBalanceForPool,
  getAvailableCreditForPool,
  getCreditRecordForPool,
  getTotalDue,
  makePayment,
} from '../../src/helpers/CreditContractHelper'
import { approveSep41Allowance } from '../../src/helpers/Sep41ContractHelper'
import { StellarWallet } from '../../src/services'
import { POOL_NAME, ScValType, StellarNetwork } from '../../src/utils'
import { sendTransaction } from '../../src/utils/transaction'

jest.mock('../../src/utils/client', () => ({
  ...jest.requireActual('../../src/utils/client'),
  getPoolStorageClient: jest.fn(),
  getCreditStorageClient: jest.fn(),
  getPoolCreditClient: jest.fn(),
}))

jest.mock('../../src/utils/transaction', () => ({
  ...jest.requireActual('../../src/utils/transaction'),
  sendTransaction: jest.fn(),
}))

jest.mock('../../src/helpers/Sep41ContractHelper', () => ({
  ...jest.requireActual('../../src/helpers/Sep41ContractHelper'),
  approveSep41Allowance: jest.fn(),
}))

describe('getAvailableBalanceForPool', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return available balance', async () => {
    ;(sendTransaction as jest.Mock).mockReturnValue({
      result: 100n,
    })

    const wallet = new StellarWallet(
      'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
    )

    const result = await getAvailableBalanceForPool(
      POOL_NAME.Arf,
      StellarNetwork.mainnet,
      wallet,
    )
    expect(result).toBe(100n)
  })
})

describe('getCreditRecordForPool', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.mainnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockBorrower = 'GTESTBORROWER'

  it('should throw an error if credit hash is not found', async () => {
    ;(sendTransaction as jest.Mock).mockResolvedValue({
      result: undefined,
    })
    await expect(
      getCreditRecordForPool(
        mockPoolName,
        mockNetwork,
        mockWallet,
        mockBorrower,
      ),
    ).rejects.toThrow('Could not find credit hash')
  })

  it('should throw an error if credit record is not found', async () => {
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({
        result: 'hash123',
      })
      .mockResolvedValueOnce({
        result: null,
      })
    await expect(
      getCreditRecordForPool(
        mockPoolName,
        mockNetwork,
        mockWallet,
        mockBorrower,
      ),
    ).rejects.toThrow('Could not find credit record')
  })

  it('should return the credit record if found', async () => {
    const expectedCreditRecord = { id: 'record123', amount: 1000n }
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({
        result: 'hash123',
      })
      .mockResolvedValueOnce({
        result: expectedCreditRecord,
      })
    const creditRecord = await getCreditRecordForPool(
      mockPoolName,
      mockNetwork,
      mockWallet,
      mockBorrower,
    )
    expect(creditRecord).toEqual(expectedCreditRecord)
  })
})

describe('getAvailableCreditForPool', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.mainnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockBorrower = 'GTESTBORROWER'

  it('should throw an error if credit hash is not found', async () => {
    ;(sendTransaction as jest.Mock).mockResolvedValueOnce({
      result: null,
    })
    await expect(
      getAvailableCreditForPool(
        mockPoolName,
        mockNetwork,
        mockWallet,
        mockBorrower,
      ),
    ).rejects.toThrow('Could not find credit hash')
  })

  it('should throw an error if credit config or credit record is not found', async () => {
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({
        result: 'hash123',
      })
      .mockResolvedValueOnce({
        result: null,
      })
      .mockResolvedValueOnce({
        result: null,
      })
    await expect(
      getAvailableCreditForPool(
        mockPoolName,
        mockNetwork,
        mockWallet,
        mockBorrower,
      ),
    ).rejects.toThrow('Could not find credit config or credit record')
  })

  it('should return the available credit if all data is found', async () => {
    const mockCreditConfig = { credit_limit: 5000n }
    const mockCreditRecord = { unbilled_principal: 1000n }
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({
        result: 'hash123',
      })
      .mockResolvedValueOnce({
        result: mockCreditConfig,
      })
      .mockResolvedValueOnce({
        result: mockCreditRecord,
      })
    const availableCredit = await getAvailableCreditForPool(
      mockPoolName,
      mockNetwork,
      mockWallet,
      mockBorrower,
    )
    expect(availableCredit).toEqual(4000n)
  })
})

describe('getTotalDue', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.mainnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockBorrower = 'GTESTBORROWER'

  it('should handle errors thrown by getCreditRecordForPool', async () => {
    ;(sendTransaction as jest.Mock).mockResolvedValueOnce({
      result: null,
    })
    await expect(
      getTotalDue(mockPoolName, mockNetwork, mockWallet, mockBorrower),
    ).rejects.toThrow('Could not find credit hash')
  })

  it('should return the sum of next_due and total_past_due if credit record is found', async () => {
    const mockCreditRecord = {
      next_due: 1000n,
      total_past_due: 500n,
    }
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({
        result: 'hash123',
      })
      .mockResolvedValueOnce({
        result: mockCreditRecord,
      })
    const totalDue = await getTotalDue(
      mockPoolName,
      mockNetwork,
      mockWallet,
      mockBorrower,
    )
    expect(totalDue).toEqual(1500n)
  })
})

describe('approveAllowanceForSentinel', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.mainnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )

  it('should return a transaction if all conditions are met', async () => {
    const mockTransaction = { id: 'tx123' }
    ;(sendTransaction as jest.Mock)
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
      })
    ;(approveSep41Allowance as jest.Mock).mockResolvedValueOnce(mockTransaction)

    const result = await approveAllowanceForSentinel(
      mockPoolName,
      mockNetwork,
      mockWallet,
    )
    expect(result).toEqual(mockTransaction)
  })
})

describe('drawdown', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.mainnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockDrawdownAmount = 1000n

  it('should return a transaction result if all conditions are met', async () => {
    ;(sendTransaction as jest.Mock).mockResolvedValueOnce({
      result: 'transactionResult',
    })
    ;(approveSep41Allowance as jest.Mock).mockResolvedValueOnce({})

    const result = await drawdown(
      mockPoolName,
      mockNetwork,
      mockWallet,
      mockDrawdownAmount,
    )
    expect(result).toEqual({
      result: 'transactionResult',
    })
  })
})

describe('makePayment', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.mainnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockPaymentAmount = 1000n

  it('should return a transaction result if all conditions are met for make_principal_payment', async () => {
    const mockPrincipalOnly = true
    ;(sendTransaction as jest.Mock).mockResolvedValueOnce({
      result: 'transactionResult',
    })
    ;(approveSep41Allowance as jest.Mock).mockResolvedValue({})

    const result = await makePayment(
      mockPoolName,
      mockNetwork,
      mockWallet,
      mockPaymentAmount,
      mockPrincipalOnly,
    )
    expect(result).toEqual({
      result: 'transactionResult',
    })
    expect(sendTransaction).toHaveBeenLastCalledWith({
      context: expect.any(Object),
      method: 'make_principal_payment',
      params: [
        {
          name: 'borrower',
          type: ScValType.address,
          value: mockWallet.userInfo.publicKey,
        },
        {
          name: 'amount',
          type: ScValType.u128,
          value: mockPaymentAmount,
        },
      ],
      shouldSignTransaction: false,
    })
  })

  it('should return a transaction result if all conditions are met for make_payment', async () => {
    const mockPrincipalOnly = false
    ;(sendTransaction as jest.Mock).mockResolvedValueOnce({
      result: 'transactionResult',
    })
    ;(approveSep41Allowance as jest.Mock).mockResolvedValue({})

    const result = await makePayment(
      mockPoolName,
      mockNetwork,
      mockWallet,
      mockPaymentAmount,
      mockPrincipalOnly,
    )
    expect(result).toEqual({
      result: 'transactionResult',
    })
    expect(sendTransaction).toHaveBeenLastCalledWith({
      context: expect.any(Object),
      method: 'make_payment',
      params: [
        {
          name: 'caller',
          type: ScValType.address,
          value: mockWallet.userInfo.publicKey,
        },
        {
          name: 'borrower',
          type: ScValType.address,
          value: mockWallet.userInfo.publicKey,
        },
        {
          name: 'amount',
          type: ScValType.u128,
          value: mockPaymentAmount,
        },
      ],
      shouldSignTransaction: false,
    })
  })
})
