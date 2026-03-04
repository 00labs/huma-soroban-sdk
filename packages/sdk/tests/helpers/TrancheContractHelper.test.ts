/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deposit,
  depositToTranche,
  getYieldToWithdraw,
  withdrawYieldFromTranche,
  withdrawYields,
} from '../../src/helpers/TrancheContractHelper'
import { StellarWallet } from '../../src/services'
import { POOL_NAME, ScValType, StellarNetwork } from '../../src/utils'
import { sendTransaction } from '../../src/utils/transaction'
import { findPoolMetadata } from '../../src/utils/common'
import { fetchStellarDepositRecord } from '../../src/utils/depositRecord'

jest.mock('../../src/utils/transaction', () => ({
  ...jest.requireActual('../../src/utils/transaction'),
  sendTransaction: jest.fn(),
}))

jest.mock('../../src/utils/common', () => ({
  ...jest.requireActual('../../src/utils/common'),
  findPoolMetadata: jest.fn(),
}))

jest.mock('../../src/utils/depositRecord', () => ({
  ...jest.requireActual('../../src/utils/depositRecord'),
  fetchStellarDepositRecord: jest.fn(),
}))

const mockWallet = new StellarWallet(
  'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
)
const mockPoolName = POOL_NAME.Arf
const mockNetwork = StellarNetwork.mainnet

const mockPoolMetadataWithSenior = {
  poolName: POOL_NAME.Arf,
  contracts: {
    juniorTranche: 'CDJ6AO57ZWBIDITDN32URXYQY6MTSFBNF6OFOCENRDE2MUB67UZKLKDP',
    seniorTranche: 'CB7ZHYQW72JW4GA7ZGGZZQQSXC4H7QRJK6CA5JLQCOZKLL2YMSABKQNX',
  },
}

const mockPoolMetadataWithoutSenior = {
  poolName: POOL_NAME.Arf,
  contracts: {
    juniorTranche: 'CDJ6AO57ZWBIDITDN32URXYQY6MTSFBNF6OFOCENRDE2MUB67UZKLKDP',
  },
}

describe('depositToTranche', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    ;(findPoolMetadata as jest.Mock).mockReturnValue(
      mockPoolMetadataWithSenior,
    )
  })

  it('should return a transaction result on successful deposit', async () => {
    ;(sendTransaction as jest.Mock).mockResolvedValueOnce({
      result: 500n,
    })

    const result = await depositToTranche(
      mockPoolName,
      mockNetwork,
      mockWallet,
      'juniorTranche',
      1000n,
    )

    expect(result).toEqual({ result: 500n })
    expect(sendTransaction).toHaveBeenCalledWith({
      context: expect.any(Object),
      method: 'deposit',
      params: [
        {
          name: 'lender',
          type: ScValType.address,
          value: mockWallet.userInfo.publicKey,
        },
        {
          name: 'assets',
          type: ScValType.u128,
          value: 1000n,
        },
      ],
    })
  })
})

describe('deposit', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw an error if pool metadata is not found', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(undefined)

    await expect(
      deposit(mockPoolName, mockNetwork, mockWallet, 1000n, 'juniorTranche'),
    ).rejects.toThrow(`Could not find pool metadata by pool name: ${mockPoolName}`)
  })

  it('should throw an error if senior tranche is not available', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(
      mockPoolMetadataWithoutSenior,
    )

    await expect(
      deposit(mockPoolName, mockNetwork, mockWallet, 1000n, 'seniorTranche'),
    ).rejects.toThrow(`Senior tranche is not available for pool: ${mockPoolName}`)
  })

  it('should deposit to junior tranche successfully', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(
      mockPoolMetadataWithSenior,
    )
    ;(sendTransaction as jest.Mock).mockResolvedValueOnce({
      result: 500n,
    })

    const result = await deposit(
      mockPoolName,
      mockNetwork,
      mockWallet,
      1000n,
      'juniorTranche',
    )

    expect(result).toEqual({ result: 500n })
  })

  it('should deposit to senior tranche successfully when available', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(
      mockPoolMetadataWithSenior,
    )
    ;(sendTransaction as jest.Mock).mockResolvedValueOnce({
      result: 300n,
    })

    const result = await deposit(
      mockPoolName,
      mockNetwork,
      mockWallet,
      1000n,
      'seniorTranche',
    )

    expect(result).toEqual({ result: 300n })
  })
})

describe('getYieldToWithdraw', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw an error if pool metadata is not found', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(undefined)

    await expect(
      getYieldToWithdraw(mockPoolName, mockNetwork, mockWallet),
    ).rejects.toThrow(`Could not find pool metadata by pool name: ${mockPoolName}`)
  })

  it('should throw an error if deposit record is not found', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(
      mockPoolMetadataWithoutSenior,
    )
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({ result: 10000n })
      .mockResolvedValueOnce({ result: 1000n })
      .mockResolvedValueOnce({ result: 100n })
    ;(fetchStellarDepositRecord as jest.Mock).mockResolvedValueOnce(null)

    await expect(
      getYieldToWithdraw(mockPoolName, mockNetwork, mockWallet),
    ).rejects.toThrow('Deposit record not found')
  })

  it('should return junior tranche yield only when no senior tranche', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(
      mockPoolMetadataWithoutSenior,
    )
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({ result: 2000n })
      .mockResolvedValueOnce({ result: 1000n })
      .mockResolvedValueOnce({ result: 500n })
    ;(fetchStellarDepositRecord as jest.Mock).mockResolvedValueOnce({
      lastDepositTime: 1000,
      principal: 800n,
    })

    const result = await getYieldToWithdraw(
      mockPoolName,
      mockNetwork,
      mockWallet,
    )

    expect(result).toBe(200n)
  })

  it('should return both tranche yields when senior tranche exists', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(
      mockPoolMetadataWithSenior,
    )
    // Junior tranche calls: total_assets, total_supply, balance
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({ result: 2000n })
      .mockResolvedValueOnce({ result: 1000n })
      .mockResolvedValueOnce({ result: 500n })
    ;(fetchStellarDepositRecord as jest.Mock).mockResolvedValueOnce({
      lastDepositTime: 1000,
      principal: 800n,
    })
    // Senior tranche calls: total_assets, total_supply, balance
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({ result: 3000n })
      .mockResolvedValueOnce({ result: 1000n })
      .mockResolvedValueOnce({ result: 200n })
    ;(fetchStellarDepositRecord as jest.Mock).mockResolvedValueOnce({
      lastDepositTime: 1000,
      principal: 400n,
    })

    const result = await getYieldToWithdraw(
      mockPoolName,
      mockNetwork,
      mockWallet,
    )

    expect(Array.isArray(result)).toBe(true)
    expect((result as bigint[])[0]).toBe(200n)
    expect((result as bigint[])[1]).toBe(200n)
  })
})

describe('withdrawYieldFromTranche', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    ;(findPoolMetadata as jest.Mock).mockReturnValue(
      mockPoolMetadataWithSenior,
    )
  })

  it('should return a transaction result on successful withdrawal', async () => {
    ;(sendTransaction as jest.Mock).mockResolvedValueOnce({
      result: 'transactionResult',
    })

    const result = await withdrawYieldFromTranche(
      mockPoolName,
      mockNetwork,
      mockWallet,
      'juniorTranche',
    )

    expect(result).toEqual({ result: 'transactionResult' })
    expect(sendTransaction).toHaveBeenCalledWith({
      context: expect.any(Object),
      method: 'withdraw_yields',
      params: [
        {
          name: 'lender',
          type: ScValType.address,
          value: mockWallet.userInfo.publicKey,
        },
      ],
      shouldSignTransaction: false,
    })
  })
})

describe('withdrawYields', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw an error if pool metadata is not found', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(undefined)

    await expect(
      withdrawYields(mockPoolName, mockNetwork, mockWallet),
    ).rejects.toThrow(`Could not find pool metadata by pool name: ${mockPoolName}`)
  })

  it('should return only junior tranche result when no senior tranche', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(
      mockPoolMetadataWithoutSenior,
    )
    ;(sendTransaction as jest.Mock).mockResolvedValueOnce({
      result: 'juniorResult',
    })

    const result = await withdrawYields(mockPoolName, mockNetwork, mockWallet)

    expect(result).toEqual([{ result: 'juniorResult' }])
  })

  it('should return both tranche results when senior tranche exists', async () => {
    ;(findPoolMetadata as jest.Mock).mockReturnValue(
      mockPoolMetadataWithSenior,
    )
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({ result: 'juniorResult' })
      .mockResolvedValueOnce({ result: 'seniorResult' })

    const result = await withdrawYields(mockPoolName, mockNetwork, mockWallet)

    expect(result).toEqual([
      { result: 'juniorResult' },
      { result: 'seniorResult' },
    ])
  })
})
