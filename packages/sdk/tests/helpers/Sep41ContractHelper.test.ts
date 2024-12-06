import { approveSep41Allowance } from '../../src/helpers/Sep41ContractHelper'
import { StellarWallet } from '../../src/services'
import {
  getLatestLedger,
  POOL_NAME,
  sendTransaction,
  StellarNetwork,
} from '../../src/utils'

jest.mock('../../src/utils/client', () => ({
  ...jest.requireActual('../../src/utils/client'),
  getUnderlyingTokenClient: jest.fn(),
}))

jest.mock('../../src/utils/transaction', () => ({
  ...jest.requireActual('../../src/utils/transaction'),
  sendTransaction: jest.fn(),
}))

jest.mock('../../src/utils/common', () => ({
  ...jest.requireActual('../../src/utils/common'),
  getLatestLedger: jest.fn(),
}))

describe('approveSep41Allowance', () => {
  const mockPoolName = POOL_NAME.Arf
  const mockNetwork = StellarNetwork.mainnet
  const mockWallet = new StellarWallet(
    'SB2EYCOYEITOLL5NTD5ADVHFLZWPMQCMAZ33R4FP5GS3KLG3TA63WKPO',
  )
  const mockSpenderAddress = 'spender123'

  it('should return a transaction result', async () => {
    ;(sendTransaction as jest.Mock)
      .mockResolvedValueOnce({
        result: 500n,
      })
      .mockResolvedValueOnce({
        result: 'transactionResult',
      })

    const mockLatestLedger = { sequence: 123456 }
    ;(getLatestLedger as jest.Mock).mockResolvedValue(mockLatestLedger)

    const result = await approveSep41Allowance(
      mockPoolName,
      mockNetwork,
      mockWallet,
      mockSpenderAddress,
    )
    expect(result).toEqual({ result: 'transactionResult' })
  })
})
