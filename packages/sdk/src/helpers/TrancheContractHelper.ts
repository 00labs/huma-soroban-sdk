import { StellarWallet } from '../services'
import {
  ContractType,
  DepositRecord,
  POOL_NAME,
  ScValType,
  StellarNetwork,
  TransactionContext,
  fetchStellarDepositRecord,
  findPoolMetadata,
  sendTransaction,
} from '../utils'

const DEFAULT_DECIMALS_FACTOR = BigInt('1000000000000000000')

function convertToAssets(
  totalAssets: bigint,
  totalSupply: bigint,
  shares: bigint,
) {
  if (totalSupply === BigInt(0)) {
    return shares
  } else {
    return (shares * totalAssets) / totalSupply
  }
}

async function getYieldToWithdrawFromTranche(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  contractType: ContractType,
) {
  const trancheContext = new TransactionContext(
    poolName,
    network,
    wallet,
    contractType,
  )
  const { result: totalAssets }: { result: bigint } = await sendTransaction({
    context: trancheContext,
    method: 'total_assets',
  })
  const { result: totalSupply }: { result: bigint } = await sendTransaction({
    context: trancheContext,
    method: 'total_supply',
  })
  const { result: balance }: { result: bigint } = await sendTransaction({
    context: trancheContext,
    method: 'balance',
    params: [
      {
        name: 'id',
        type: ScValType.address,
        value: wallet.userInfo.publicKey,
      },
    ],
  })
  const depositRecord: DepositRecord | null = await fetchStellarDepositRecord(
    trancheContext,
    wallet.userInfo.publicKey,
  )
  if (depositRecord == null) {
    throw new Error('Deposit record not found')
  }

  // Scale numbers using `DEFAULT_DECIMALS_FACTOR` to reduce precision loss caused by
  // integer division.
  const priceWithDecimals = convertToAssets(
    totalAssets,
    totalSupply,
    DEFAULT_DECIMALS_FACTOR,
  )
  const assetsWithDecimals = balance * priceWithDecimals
  const principalWithDecimals =
    depositRecord.principal * DEFAULT_DECIMALS_FACTOR
  const yieldWithDecimals = assetsWithDecimals - principalWithDecimals
  return yieldWithDecimals / DEFAULT_DECIMALS_FACTOR
}

/**
 * Get yield available to withdraw from the pool for a lender account
 *
 * @async
 * @function
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @returns {Promise<SentTransaction>} - A Promise of the SentTransaction.
 */
export async function getYieldToWithdraw(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
) {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    throw new Error(`Could not find pool metadata by pool name: ${poolName}`)
  }

  const juniorTrancheResult = await getYieldToWithdrawFromTranche(
    poolName,
    network,
    wallet,
    'juniorTranche',
  )

  if (!poolMetadata.contracts['seniorTranche']) {
    return juniorTrancheResult
  }

  const seniorTrancheResult = await getYieldToWithdrawFromTranche(
    poolName,
    network,
    wallet,
    'seniorTranche',
  )

  return [juniorTrancheResult, seniorTrancheResult]
}

export async function depositToTranche(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  contractType: ContractType,
  assets: bigint,
) {
  const trancheContext = new TransactionContext(
    poolName,
    network,
    wallet,
    contractType,
  )
  const trancheResult = await sendTransaction({
    context: trancheContext,
    method: 'deposit',
    params: [
      {
        name: 'lender',
        type: ScValType.address,
        value: wallet.userInfo.publicKey,
      },
      {
        name: 'assets',
        type: ScValType.u128,
        value: assets,
      },
    ],
  })

  return trancheResult
}

/**
 * Deposit assets into a tranche of the pool
 *
 * @async
 * @function
 * @param {POOL_NAME} poolName - The name of the credit pool to deposit into.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {bigint} assets - The amount of underlying assets to deposit.
 * @param {'juniorTranche' | 'seniorTranche'} - The tranche to deposit into.
 * @returns {Promise<SentTransaction>} - A Promise of the SentTransaction containing the shares minted.
 */
export async function deposit(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  assets: bigint,
  trancheType: 'juniorTranche' | 'seniorTranche',
) {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    throw new Error(`Could not find pool metadata by pool name: ${poolName}`)
  }

  if (
    trancheType === 'seniorTranche' &&
    !poolMetadata.contracts['seniorTranche']
  ) {
    throw new Error(`Senior tranche is not available for pool: ${poolName}`)
  }

  return depositToTranche(poolName, network, wallet, trancheType, assets)
}

export async function withdrawYieldFromTranche(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  contractType: ContractType,
) {
  const trancheContext = new TransactionContext(
    poolName,
    network,
    wallet,
    contractType,
  )
  const trancheResult = await sendTransaction({
    context: trancheContext,
    method: 'withdraw_yields',
    params: [
      {
        name: 'lender',
        type: ScValType.address,
        value: wallet.userInfo.publicKey,
      },
    ],
    shouldSignTransaction: false,
  })

  return trancheResult
}

/**
 * Withdraw yield from the pool for a lender account
 *
 * @async
 * @function
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @returns {Promise<SentTransaction>} - A Promise of the SentTransaction.
 */
export async function withdrawYields(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
) {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    throw new Error(`Could not find pool metadata by pool name: ${poolName}`)
  }

  const juniorTrancheResult = await withdrawYieldFromTranche(
    poolName,
    network,
    wallet,
    'juniorTranche',
  )

  if (!poolMetadata.contracts['seniorTranche']) {
    return [juniorTrancheResult]
  }

  const seniorTrancheResult = await withdrawYieldFromTranche(
    poolName,
    network,
    wallet,
    'seniorTranche',
  )

  return [juniorTrancheResult, seniorTrancheResult]
}
