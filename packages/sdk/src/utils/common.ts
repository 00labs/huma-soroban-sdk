import { Address, nativeToScVal, rpc, xdr } from '@stellar/stellar-sdk'
import {
  StellarNetwork,
  NetworkMetadatas,
  StellarPublicRpcUrl,
} from './network'

export enum ScValType {
  address = 'address',
  u128 = 'u128',
  u64 = 'u64',
  u32 = 'u32',
  i128 = 'i128',
  i64 = 'i64',
  i32 = 'i32',
  bool = 'bool',
  enum = 'enum',
  buffer = 'buffer',
}

export const toScVal = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  type: ScValType,
) => {
  switch (type) {
    case ScValType.address:
      return Address.fromString(value).toScVal()

    case ScValType.u128:
      return nativeToScVal(value, { type: ScValType.u128 })

    case ScValType.u64:
      return nativeToScVal(value, { type: ScValType.u64 })

    case ScValType.u32:
      return nativeToScVal(value, { type: ScValType.u32 })

    case ScValType.i128:
      return nativeToScVal(value, { type: ScValType.i128 })

    case ScValType.i64:
      return nativeToScVal(value, { type: ScValType.i64 })

    case ScValType.i32:
      return nativeToScVal(value, { type: ScValType.i32 })

    case ScValType.bool:
      return xdr.ScVal.scvBool(value)

    case ScValType.enum:
      return xdr.ScVal.scvVec([xdr.ScVal.scvSymbol(value)])

    case ScValType.buffer:
      return xdr.ScVal.scvBytes(value)
  }
}

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
  const server = new rpc.Server(StellarPublicRpcUrl[network], {
    allowHttp: true,
  })
  return server.getLatestLedger()
}
