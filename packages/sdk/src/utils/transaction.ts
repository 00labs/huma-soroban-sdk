import { Client as CreditStorageClient } from '@huma-finance/soroban-credit-storage'
import { Client as CreditManagerClient } from '@huma-finance/soroban-credit-manager'
import { Client as PoolClient } from '@huma-finance/soroban-pool'
import { Client as PoolCreditClient } from '@huma-finance/soroban-pool-credit'
import { Client as PoolStorageClient } from '@huma-finance/soroban-pool-storage'
import { Client as TrancheVaultClient } from '@huma-finance/soroban-tranche-vault'
import { Client as Sep41Client } from '@huma-finance/soroban-sep41'
import {
  BASE_FEE,
  Contract,
  Operation,
  SorobanRpc,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk'
import { SentTransaction } from '@stellar/stellar-sdk/lib/contract'
import { StellarWallet } from 'services'

import { ScValType, toScVal } from './common'
import {
  StellarNetwork,
  StellarNetworkPassphrase,
  StellarPublicRpcUrl,
} from './network'
import { TransactionContext } from './client'

const handlePendingTransaction = async (
  sendResponse: SorobanRpc.Api.SendTransactionResponse,
  server: SorobanRpc.Server,
) => {
  if (sendResponse.status === 'PENDING') {
    let getResponse = await server.getTransaction(sendResponse.hash)
    while (getResponse.status === 'NOT_FOUND') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      getResponse = await server.getTransaction(sendResponse.hash)
    }

    if (getResponse.status === 'SUCCESS') {
      if (!getResponse.resultMetaXdr) {
        throw 'Empty resultMetaXDR in getTransaction response'
      }
      const transactionMeta = getResponse.resultMetaXdr
      return transactionMeta?.v3()?.sorobanMeta()?.returnValue()
    } else {
      throw getResponse.resultXdr
    }
  } else {
    throw sendResponse.errorResult
  }
}

export const simTransaction = async (
  wallet: StellarWallet,
  network: StellarNetwork,
  contractAddress: string,
  method: string,
  params: xdr.ScVal[] = [],
) => {
  const server = new SorobanRpc.Server(StellarPublicRpcUrl[network])
  const contract = new Contract(contractAddress)
  const account = await server.getAccount(wallet.userInfo.publicKey)
  const builtTransaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: StellarNetworkPassphrase[network],
  })
    .addOperation(contract.call(method, ...params))
    .setTimeout(30)
    .build()

  return server.simulateTransaction(builtTransaction)
}

export const restoreTransaction = async (
  wallet: StellarWallet,
  network: StellarNetwork,
  simResponse: SorobanRpc.Api.SimulateTransactionResponse,
) => {
  const server = new SorobanRpc.Server(StellarPublicRpcUrl[network])
  const account = await server.getAccount(wallet.userInfo.publicKey)

  const restoreNeeded = SorobanRpc.Api.isSimulationRestore(simResponse)
  if (!restoreNeeded) {
    return
  }

  console.log('Start restore transaction')
  const { restorePreamble } = simResponse
  const builtTransaction = new TransactionBuilder(account, {
    networkPassphrase: StellarNetworkPassphrase[network],
    fee: restorePreamble.minResourceFee,
  })
    .setSorobanData(restorePreamble.transactionData.build())
    .addOperation(Operation.restoreFootprint({}))
    .setTimeout(30)
    .build()

  const preparedTransaction = await server.prepareTransaction(builtTransaction)
  preparedTransaction.sign(wallet.keypair)

  const response = await server.sendTransaction(preparedTransaction)
  const result = await handlePendingTransaction(response, server)
  console.log('Restore transaction successfully: ', response.hash)
  return result
}

export const extendTTLTransaction = async (
  wallet: StellarWallet,
  network: StellarNetwork,
  simResponse: SorobanRpc.Api.SimulateTransactionResponse,
) => {
  const server = new SorobanRpc.Server(StellarPublicRpcUrl[network])
  const account = await server.getAccount(wallet.userInfo.publicKey)

  const restoreNeeded = SorobanRpc.Api.isSimulationRestore(simResponse)
  if (!restoreNeeded) {
    return
  }

  console.log('Start extend TTL transaction')
  const { restorePreamble } = simResponse
  const builtTransaction = new TransactionBuilder(account, {
    networkPassphrase: StellarNetworkPassphrase[network],
    fee: restorePreamble.minResourceFee,
  })
    .setSorobanData(restorePreamble.transactionData.build())
    .addOperation(
      Operation.extendFootprintTtl({
        extendTo: 3110400 - 1,
      }),
    )
    .setTimeout(30)
    .build()

  const preparedTransaction = await server.prepareTransaction(builtTransaction)
  preparedTransaction.sign(wallet.keypair)

  const response = await server.sendTransaction(preparedTransaction)
  const result = await handlePendingTransaction(response, server)
  console.log('Extend TTL transaction successfully: ', response.hash)
  return result
}

export const restoreAndExtendTTL = async (
  network: StellarNetwork,
  wallet: StellarWallet,
  contractAddress: string,
  method: string,
  params: { name: string; type: ScValType; value: string | number | bigint }[],
) => {
  const paramsXDR = params.map((param) => {
    return toScVal(param.value, param.type)
  })
  const simResponse = await simTransaction(
    wallet,
    network,
    contractAddress,
    method,
    paramsXDR,
  )
  await restoreTransaction(wallet, network, simResponse)
  await extendTTLTransaction(wallet, network, simResponse)
}

export const sendTransaction = async <T = null>(
  network: StellarNetwork,
  wallet: StellarWallet,
  client:
    | PoolCreditClient
    | CreditStorageClient
    | CreditManagerClient
    | PoolClient
    | PoolStorageClient
    | TrancheVaultClient
    | Sep41Client,
  method: string,
  params: {
    name: string
    type: ScValType
    value: string | number | bigint | Buffer
  }[] = [],
  shouldSignTransaction = false,
): Promise<SentTransaction<T>> => {
  const paramsXDR = params.map((param) => {
    return toScVal(param.value, param.type)
  })
  const simResponse = await simTransaction(
    wallet,
    network,
    client.options.contractId,
    method,
    paramsXDR,
  )
  await restoreTransaction(wallet, network, simResponse)
  await extendTTLTransaction(wallet, network, simResponse)

  const paramsClient = params.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.value
    return accumulator
  }, {} as Record<string, unknown>)
  if (!shouldSignTransaction) {
    // @ts-ignore
    return client[method](paramsClient)
  }

  // @ts-ignore
  const tx = await client[method](paramsClient, {
    timeoutInSeconds: 30,
  })
  return tx.signAndSend()
}

export const sendTransactionV2 = async <T = null>({
  context,
  method,
  params = [],
  shouldSignTransaction = false,
}: {
  context: TransactionContext
  method: string
  params?: {
    name: string
    type: ScValType
    value: string | number | bigint | Buffer
  }[]
  shouldSignTransaction?: boolean
}): Promise<SentTransaction<T>> => {
  const paramsXDR = params.map((param) => {
    return toScVal(param.value, param.type)
  })
  const simResponse = await simTransaction(
    context.wallet,
    context.network,
    context.contractId,
    method,
    paramsXDR,
  )
  await restoreTransaction(context.wallet, context.network, simResponse)
  await extendTTLTransaction(context.wallet, context.network, simResponse)

  const paramsClient = params.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.value
    return accumulator
  }, {} as Record<string, unknown>)
  if (!shouldSignTransaction) {
    // @ts-ignore
    return client[method](paramsClient)
  }

  // @ts-ignore
  const tx = await client[method](paramsClient, {
    timeoutInSeconds: 30,
  })
  return tx.signAndSend()
}
