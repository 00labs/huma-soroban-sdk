/* eslint-disable @typescript-eslint/no-explicit-any */
import { HumaContextStellar } from '../../src/services/HumaContextStellar'
import { StellarWallet } from '../../src/services/StellarWallet'
import { POOL_NAME, POOL_TYPE, StellarNetwork } from '../../src/utils'

describe('HumaContextStellar', () => {
  const mockNetwork = StellarNetwork.testnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockPoolName = POOL_NAME.Arf
  const mockPoolType = POOL_TYPE.Creditline

  it('should throw an error if any parameter is missing', () => {
    expect(
      () =>
        new HumaContextStellar({
          wallet: null as any,
          network: mockNetwork,
          poolName: mockPoolName,
          poolType: mockPoolType,
        }),
    ).toThrow('All parameters are required')

    expect(
      () =>
        new HumaContextStellar({
          wallet: mockWallet,
          network: null as any,
          poolName: mockPoolName,
          poolType: mockPoolType,
        }),
    ).toThrow('All parameters are required')
  })

  it('should correctly initialize with all parameters', () => {
    const context = new HumaContextStellar({
      wallet: mockWallet,
      network: mockNetwork,
      poolName: mockPoolName,
      poolType: mockPoolType,
    })

    expect(context.wallet).toBe(mockWallet)
    expect(context.network).toBe(mockNetwork)
    expect(context.poolName).toBe(mockPoolName)
    expect(context.poolType).toBe(mockPoolType)
  })
})
