import { Client as CreditManagerClient } from '@huma-shan/soroban-credit-manager'
import { Client as CreditStorageClient } from '@huma-shan/soroban-credit-storage'
import { Client as PoolClient } from '@huma-shan/soroban-pool'
import { Client as PoolCreditClient } from '@huma-shan/soroban-pool-credit'
import { Client as PoolStorageClient } from '@huma-shan/soroban-pool-storage'
import { Client as Sep41Client } from '@huma-shan/soroban-sep41'
import { Client as TrancheVaultClient } from '@huma-shan/soroban-tranche-vault'

import { StellarWallet } from '../services/StellarWallet'
import { findPoolMetadata } from './common'
import {
  ContractType,
  POOL_NAME,
  StellarNetwork,
  StellarNetworkPassphrase,
  StellarPublicRpcUrl,
} from './network'

export type Client =
  | PoolCreditClient
  | CreditStorageClient
  | CreditManagerClient
  | PoolClient
  | PoolStorageClient
  | TrancheVaultClient
  | Sep41Client

const ClientMap = {
  poolCredit: PoolCreditClient,
  creditStorage: CreditStorageClient,
  creditManager: CreditManagerClient,
  pool: PoolClient,
  poolStorage: PoolStorageClient,
  juniorTranche: TrancheVaultClient,
  seniorTranche: TrancheVaultClient,
  underlyingToken: Sep41Client,
}

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
  if (!poolMetadata || !poolMetadata.contracts[`${tranche}Tranche`]) {
    return undefined
  }

  return new TrancheVaultClient({
    contractId: poolMetadata.contracts[`${tranche}Tranche`]!,
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

export class TransactionContext {
  #client: Client
  #wallet: StellarWallet
  #network: StellarNetwork
  #contractId: string

  constructor(
    poolName: POOL_NAME,
    network: StellarNetwork,
    wallet: StellarWallet,
    contractType: ContractType,
  ) {
    const poolMetadata = findPoolMetadata(network, poolName)
    if (!poolMetadata) {
      throw new Error(`Could not find pool metadata by pool name: ${poolName}`)
    }
    if (!poolMetadata.contracts[contractType]) {
      throw new Error(
        `Could not find contract by contract type: ${contractType}`,
      )
    }
    // @ts-ignore
    const clientClass = ClientMap[contractType]
    if (!clientClass) {
      throw new Error(`Could not find client by contract type: ${contractType}`)
    }
    const client = new clientClass({
      contractId: poolMetadata.contracts[contractType],
      ...getCommonProps(network, wallet),
    })

    this.#client = client
    this.#wallet = wallet
    this.#network = network
    this.#contractId = client.options.contractId
  }

  get client() {
    return this.#client
  }

  get wallet() {
    return this.#wallet
  }

  get network() {
    return this.#network
  }

  get contractId() {
    return this.#contractId
  }
}
