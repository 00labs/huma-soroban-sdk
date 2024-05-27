import { Client as CreditStorageClient } from '@huma-shan/soroban-credit-storage'
import { Client as PoolClient } from '@huma-shan/soroban-pool'
import { Client as PoolCreditClient } from '@huma-shan/soroban-pool-credit'
import { Client as PoolStorageClient } from '@huma-shan/soroban-pool-storage'

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
    allowHttp: network === StellarNetwork.localnet,
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
