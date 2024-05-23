import { StellarWallet } from '../services/StellarWallet'

import { Client as PoolClient } from '../packages/pool'
import { Client as PoolStorageClient } from '../packages/poolStorage'
import { Client as PoolCreditClient } from '../packages/poolCredit'
import { Client as CreditStorageClient } from '../packages/creditStorage'
import {
  POOL_NAME,
  StellarNetwork,
  StellarNetworkPassphrase,
  StellarPublicRpcUrl,
} from './network'
import { findPoolMetadata } from './common'

const getCommonProps = (network: StellarNetwork, wallet: StellarWallet) => {
  return {
    publicKey: wallet.getUserInfo().publicKey,
    networkPassphrase: StellarNetworkPassphrase[network],
    rpcUrl: StellarPublicRpcUrl[network],
    ...wallet,
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
    contractId: poolMetadata.contracts.pool,
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
