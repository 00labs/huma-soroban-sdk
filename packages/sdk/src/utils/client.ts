import { Client as CreditStorageClient } from '@huma-finance/soroban-credit-storage'
import { Client as CreditManagerClient } from '@huma-finance/soroban-credit-manager'
import { Client as PoolClient } from '@huma-finance/soroban-pool'
import { Client as PoolCreditClient } from '@huma-finance/soroban-pool-credit'
import { Client as PoolStorageClient } from '@huma-finance/soroban-pool-storage'
import { Client as TrancheVaultClient } from '@huma-finance/soroban-tranche-vault'
import { Client as Sep41Client } from '@huma-finance/soroban-sep41'

import { StellarWallet } from '../services/StellarWallet'
import { findPoolMetadata } from './common'
import {
  POOL_NAME,
  StellarNetwork,
  StellarNetworkPassphrase,
  StellarPublicRpcUrl,
} from './network'

const getCommonProps = (network: StellarNetwork, wallet: StellarWallet) => {
  return {
    publicKey: wallet.userInfo.publicKey,
    networkPassphrase: StellarNetworkPassphrase[network],
    rpcUrl: StellarPublicRpcUrl[network],
    allowHttp: StellarPublicRpcUrl[network].startsWith('http://'),
    signTransaction: wallet.signTransaction.bind(wallet),
  }
}

export const getPoolClient = (
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
) => {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    return undefined
  }

  return new PoolClient({
    contractId: poolMetadata.contracts.pool,
    ...getCommonProps(network, wallet),
  })
}

export const getPoolStorageClient = (
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
) => {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    return undefined
  }

  return new PoolStorageClient({
    contractId: poolMetadata.contracts.poolStorage,
    ...getCommonProps(network, wallet),
  })
}

export const getPoolCreditClient = (
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
) => {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    return undefined
  }

  return new PoolCreditClient({
    contractId: poolMetadata.contracts.poolCredit,
    ...getCommonProps(network, wallet),
  })
}

export const getCreditStorageClient = (
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
) => {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    return undefined
  }

  return new CreditStorageClient({
    contractId: poolMetadata.contracts.creditStorage,
    ...getCommonProps(network, wallet),
  })
}

export const getCreditManagerClient = (
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
) => {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    return undefined
  }

  return new CreditManagerClient({
    contractId: poolMetadata.contracts.creditManager,
    ...getCommonProps(network, wallet),
  })
}

export const getTrancheVaultClient = (
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  tranche: 'senior' | 'junior',
) => {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    return undefined
  }

  return new TrancheVaultClient({
    contractId: poolMetadata.contracts[`${tranche}Tranche`],
    ...getCommonProps(network, wallet),
  })
}

export const getUnderlyingTokenClient = (
  tokenAddress: string,
  network: StellarNetwork,
  wallet: StellarWallet,
) => {
  return new Sep41Client({
    contractId: tokenAddress,
    ...getCommonProps(network, wallet),
  })
}
