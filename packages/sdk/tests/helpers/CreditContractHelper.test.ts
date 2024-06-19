/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  approveAllowanceForSentinel,
  drawdown,
  getAvailableBalanceForPool,
  getAvailableCreditForPool,
  getCreditLineClient,
  getCreditRecordForPool,
  getTotalDue,
  makePayment,
} from '../../src/helpers/CreditContractHelper'
import { approveSep41AllowanceIfInsufficient } from '../../src/helpers/Sep41ContractHelper'
import { StellarWallet } from '../../src/services'
import { POOL_NAME, StellarNetwork } from '../../src/utils'
import {
  getCreditStorageClient,
  getPoolStorageClient,
  getPoolCreditClient,
} from '../../src/utils/client'

jest.mock('../../src/utils/client', () => ({
  ...jest.requireActual('../../src/utils/client'),
  getPoolStorageClient: jest.fn(),
  getCreditStorageClient: jest.fn(),
  getPoolCreditClient: jest.fn(),
}))

jest.mock('../../src/helpers/Sep41ContractHelper', () => ({
  ...jest.requireActual('../../src/helpers/Sep41ContractHelper'),
  approveSep41AllowanceIfInsufficient: jest.fn(),
}))

describe('getAvailableBalanceForPool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw if params not correct', async () => {
    ;(getPoolStorageClient as jest.Mock).mockReturnValue(null)

    const wallet = new StellarWallet(
      'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
    )

    await expect(
      getAvailableBalanceForPool(
        'wrong pool name' as any,
        StellarNetwork.testnet,
        wallet,
      ),
    ).rejects.toThrow('Could not find credit contract for pool')
  })

  it('should return available balance', async () => {
    ;(getPoolStorageClient as jest.Mock).mockReturnValue({
      get_available_balance: jest.fn().mockResolvedValue({
        result: 100n,
      }),
    })

    const wallet = new StellarWallet(
      'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
    )

    const result = await getAvailableBalanceForPool(
      POOL_NAME.Arf,
      StellarNetwork.testnet,
      wallet,
    )
    expect(result).toBe(100n)
  })
})

describe('getCreditRecordForPool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.testnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockBorrower = 'GTESTBORROWER'

  it('should throw an error if credit storage client is not found', async () => {
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(undefined)
    await expect(
      getCreditRecordForPool(
        mockPoolName,
        mockNetwork,
        mockWallet,
        mockBorrower,
      ),
    ).rejects.toThrow('Could not find credit storage contract for pool')
  })

  it('should throw an error if credit hash is not found', async () => {
    const mockClient = {
      get_credit_hash: jest.fn().mockResolvedValue({ result: null }),
    }
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(mockClient)
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
    const mockClient = {
      get_credit_hash: jest.fn().mockResolvedValue({ result: 'hash123' }),
      get_credit_record: jest.fn().mockResolvedValue({ result: null }),
    }
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(mockClient)
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
    const mockClient = {
      get_credit_hash: jest.fn().mockResolvedValue({ result: 'hash123' }),
      get_credit_record: jest
        .fn()
        .mockResolvedValue({ result: expectedCreditRecord }),
    }
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(mockClient)
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
    jest.clearAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.testnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockBorrower = 'GTESTBORROWER'

  it('should throw an error if credit storage client is not found', async () => {
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(undefined)
    await expect(
      getAvailableCreditForPool(
        mockPoolName,
        mockNetwork,
        mockWallet,
        mockBorrower,
      ),
    ).rejects.toThrow('Could not find credit storage contract for pool')
  })

  it('should throw an error if credit hash is not found', async () => {
    const mockClient = {
      get_credit_hash: jest.fn().mockResolvedValue({ result: null }),
    }
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(mockClient)
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
    const mockClient = {
      get_credit_hash: jest.fn().mockResolvedValue({ result: 'hash123' }),
      get_credit_config: jest.fn().mockResolvedValue({ result: null }),
      get_credit_record: jest.fn().mockResolvedValue({ result: null }),
    }
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(mockClient)
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
    const mockClient = {
      get_credit_hash: jest.fn().mockResolvedValue({ result: 'hash123' }),
      get_credit_config: jest
        .fn()
        .mockResolvedValue({ result: mockCreditConfig }),
      get_credit_record: jest
        .fn()
        .mockResolvedValue({ result: mockCreditRecord }),
    }
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(mockClient)
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
    jest.clearAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.testnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockBorrower = 'GTESTBORROWER'

  it('should handle errors thrown by getCreditRecordForPool', async () => {
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(null)
    await expect(
      getTotalDue(mockPoolName, mockNetwork, mockWallet, mockBorrower),
    ).rejects.toThrow('Could not find credit storage contract for pool')
  })

  it('should return the sum of next_due and total_past_due if credit record is found', async () => {
    const mockCreditRecord = {
      next_due: 1000n,
      total_past_due: 500n,
    }
    const mockClient = {
      get_credit_hash: jest.fn().mockResolvedValue({ result: 'hash123' }),
      get_credit_record: jest
        .fn()
        .mockResolvedValue({ result: mockCreditRecord }),
    }
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(mockClient)
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
    jest.clearAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.testnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )

  it('should throw an error if credit storage contract is not found', async () => {
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce(null)
    await expect(
      approveAllowanceForSentinel(mockPoolName, mockNetwork, mockWallet),
    ).rejects.toThrow('Could not find credit storage contract for pool')
  })

  it('should throw an error if pool storage client is not found', async () => {
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce({
      get_credit_hash: jest.fn().mockResolvedValue({ result: 'hash123' }),
      get_credit_record: jest.fn().mockResolvedValue({
        result: {
          next_due: 1000n,
          total_past_due: 500n,
        },
      }),
    })
    ;(getPoolStorageClient as jest.Mock).mockReturnValueOnce(undefined)
    await expect(
      approveAllowanceForSentinel(mockPoolName, mockNetwork, mockWallet),
    ).rejects.toThrow('Could not find pool storage contract for pool')
  })

  it('should return a transaction if all conditions are met', async () => {
    const mockTransaction = { id: 'tx123' }
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce({
      get_credit_hash: jest.fn().mockResolvedValue({ result: 'hash123' }),
      get_credit_record: jest.fn().mockResolvedValue({
        result: {
          next_due: 1000n,
          total_past_due: 500n,
        },
      }),
    })
    ;(getPoolStorageClient as jest.Mock).mockReturnValueOnce({
      get_underlying_token: jest.fn().mockResolvedValue({ result: 'token123' }),
      get_sentinel: jest.fn().mockResolvedValue({ result: 'sentinel123' }),
    })
    ;(approveSep41AllowanceIfInsufficient as jest.Mock).mockResolvedValueOnce(
      mockTransaction,
    )

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
    jest.clearAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.testnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockDrawdownAmount = 1000n

  it('should throw an error if credit contract for pool is not found', async () => {
    ;(getPoolCreditClient as jest.Mock).mockReturnValueOnce(undefined)
    await expect(
      drawdown(mockPoolName, mockNetwork, mockWallet, mockDrawdownAmount),
    ).rejects.toThrow('Could not find credit contract for pool')
  })

  it('should return a transaction result if all conditions are met', async () => {
    const mockTransaction = {
      signAndSend: jest.fn().mockResolvedValue('transactionResult'),
    }
    const mockPoolCreditClient = {
      drawdown: jest.fn().mockResolvedValue(mockTransaction),
    }
    ;(getPoolCreditClient as jest.Mock).mockReturnValueOnce(
      mockPoolCreditClient,
    )
    ;(getCreditStorageClient as jest.Mock).mockReturnValueOnce({
      get_credit_hash: jest.fn().mockResolvedValue({ result: 'hash123' }),
      get_credit_record: jest.fn().mockResolvedValue({
        result: {
          next_due: 1000n,
          total_past_due: 500n,
        },
      }),
    })
    ;(getPoolStorageClient as jest.Mock).mockReturnValueOnce({
      get_underlying_token: jest.fn().mockResolvedValue({ result: 'token123' }),
      get_sentinel: jest.fn().mockResolvedValue({ result: 'sentinel123' }),
    })
    ;(approveSep41AllowanceIfInsufficient as jest.Mock).mockResolvedValueOnce(
      {},
    )

    const result = await drawdown(
      mockPoolName,
      mockNetwork,
      mockWallet,
      mockDrawdownAmount,
    )
    expect(result).toBe('transactionResult')
    expect(mockPoolCreditClient.drawdown).toHaveBeenCalledWith(
      {
        borrower: mockWallet.userInfo.publicKey,
        amount: mockDrawdownAmount,
      },
      {
        timeoutInSeconds: 30,
      },
    )
    expect(mockTransaction.signAndSend).toHaveBeenCalled()
  })
})

describe('makePayment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.testnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockPaymentAmount = 1000n
  const mockPrincipalOnly = false

  it('should throw an error if credit contract for pool is not found', async () => {
    ;(getPoolCreditClient as jest.Mock).mockReturnValueOnce(undefined)
    await expect(
      makePayment(
        mockPoolName,
        mockNetwork,
        mockWallet,
        mockPaymentAmount,
        mockPrincipalOnly,
      ),
    ).rejects.toThrow('Could not find credit contract for pool')
  })

  it('should throw an error if pool storage contract is not found', async () => {
    ;(getPoolCreditClient as jest.Mock).mockReturnValueOnce({})
    ;(getPoolStorageClient as jest.Mock).mockReturnValueOnce(undefined)
    await expect(
      makePayment(
        mockPoolName,
        mockNetwork,
        mockWallet,
        mockPaymentAmount,
        mockPrincipalOnly,
      ),
    ).rejects.toThrow('Could not find pool storage contract for pool')
  })

  it('should return a transaction result if all conditions are met', async () => {
    const mockTransaction = {
      signAndSend: jest.fn().mockResolvedValue('transactionResult'),
    }
    const mockPoolCreditClient = {
      make_principal_payment: jest.fn().mockResolvedValue(mockTransaction),
      make_payment: jest.fn().mockResolvedValue(mockTransaction),
    }
    const mockPoolStorageClient = {
      get_underlying_token: jest.fn().mockResolvedValue({ result: 'token123' }),
      get_sentinel: jest.fn().mockResolvedValue({ result: 'sentinel123' }),
    }
    const mockCreditStorageClient = {
      get_credit_hash: jest.fn().mockResolvedValue({ result: 'hash123' }),
      get_credit_record: jest.fn().mockResolvedValue({
        result: {
          next_due: 1000n,
          total_past_due: 500n,
        },
      }),
    }
    ;(getPoolCreditClient as jest.Mock).mockReturnValue(mockPoolCreditClient)
    ;(getPoolStorageClient as jest.Mock).mockReturnValue(mockPoolStorageClient)
    ;(getCreditStorageClient as jest.Mock).mockReturnValue(
      mockCreditStorageClient,
    )
    ;(approveSep41AllowanceIfInsufficient as jest.Mock).mockResolvedValue({})

    const result = await makePayment(
      mockPoolName,
      mockNetwork,
      mockWallet,
      mockPaymentAmount,
      mockPrincipalOnly,
    )
    expect(result).toBe('transactionResult')
    expect(approveSep41AllowanceIfInsufficient).toHaveBeenCalledWith(
      mockNetwork,
      mockWallet,
      'token123',
      'sentinel123',
      mockPaymentAmount,
    )
    expect(
      mockPrincipalOnly
        ? mockPoolCreditClient.make_principal_payment
        : mockPoolCreditClient.make_payment,
    ).toHaveBeenCalled()
  })
})
