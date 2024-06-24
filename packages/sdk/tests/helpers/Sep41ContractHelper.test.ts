import { approveSep41AllowanceIfInsufficient } from '../../src/helpers/Sep41ContractHelper'
import { StellarWallet } from '../../src/services'
import { StellarNetwork } from '../../src/utils'
import { getUnderlyingTokenClient } from '../../src/utils/client'
import { getLatestLedger } from '../../src/utils/common'

jest.mock('../../src/utils/client', () => ({
  ...jest.requireActual('../../src/utils/client'),
  getUnderlyingTokenClient: jest.fn(),
}))

jest.mock('../../src/utils/common', () => ({
  ...jest.requireActual('../../src/utils/common'),
  getLatestLedger: jest.fn(),
}))

describe('approveSep41AllowanceIfInsufficient', () => {
  const mockNetwork = StellarNetwork.testnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockTokenAddress = 'token123'
  const mockSpenderAddress = 'spender123'
  const mockAllowanceAmount = 1000n

  it('should return null if the current allowance is sufficient', async () => {
    const mockTokenClient = {
      allowance: jest.fn().mockResolvedValue({ result: 2000n }),
      decimals: jest.fn().mockResolvedValue({ result: 2 }),
    }
    ;(getUnderlyingTokenClient as jest.Mock).mockReturnValue(mockTokenClient)

    const result = await approveSep41AllowanceIfInsufficient(
      mockNetwork,
      mockWallet,
      mockTokenAddress,
      mockSpenderAddress,
      mockAllowanceAmount,
    )
    expect(result).toBeNull()
    expect(mockTokenClient.allowance).toHaveBeenCalledWith({
      from: mockWallet.userInfo.publicKey,
      spender: mockSpenderAddress,
    })
  })

  it('should return a transaction result if the current allowance is insufficient', async () => {
    const mockTransaction = {
      signAndSend: jest.fn().mockResolvedValue('transactionResult'),
    }
    const mockTokenClient = {
      allowance: jest.fn().mockResolvedValue({ result: 500n }),
      decimals: jest.fn().mockResolvedValue({ result: 2 }),
      approve: jest.fn().mockResolvedValue(mockTransaction),
    }
    const mockLatestLedger = { sequence: 123456 }
    ;(getUnderlyingTokenClient as jest.Mock).mockReturnValue(mockTokenClient)
    ;(getLatestLedger as jest.Mock).mockResolvedValue(mockLatestLedger)

    const result = await approveSep41AllowanceIfInsufficient(
      mockNetwork,
      mockWallet,
      mockTokenAddress,
      mockSpenderAddress,
      mockAllowanceAmount,
    )
    expect(result).toBe('transactionResult')
    expect(mockTokenClient.approve).toHaveBeenCalledWith(
      {
        from: mockWallet.userInfo.publicKey,
        spender: mockSpenderAddress,
        amount: 100000000000n,
        expiration_ledger: 3123456,
      },
      {
        timeoutInSeconds: 30,
      },
    )
  })
})
