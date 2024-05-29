import { SorobanRpc } from '@stellar/stellar-sdk'
import {
  StellarNetwork,
  NetworkMetadatas,
  StellarPublicRpcUrl,
} from './network'

export const findPoolMetadata = (network: StellarNetwork, poolName: string) => {
  const selectedNetworkMetadata = NetworkMetadatas.find(
    (metadata) => metadata.network === network,
  )
  if (selectedNetworkMetadata) {
    return selectedNetworkMetadata.pools.find(
      (pool) => pool.poolName === poolName,
    )
  }
  return undefined
}

export const getLatestLedger = async (network: StellarNetwork) => {
  const server = new SorobanRpc.Server(StellarPublicRpcUrl[network], {
    allowHttp: true,
  })
  return server.getLatestLedger()
}
