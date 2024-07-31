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

import { TransactionContext } from './client'
import { ScValType, toScVal } from './common'
import {
  StellarNetwork,
  StellarNetworkPassphrase,
  StellarPublicRpcUrl,
} from './network'

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

export const simulateTransaction = async (
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
  const simResponse = await simulateTransaction(
    wallet,
    network,
    contractAddress,
    method,
    paramsXDR,
  )
  await restoreTransaction(wallet, network, simResponse)
  await extendTTLTransaction(wallet, network, simResponse)
}

export const sendTransaction = async <T = null>({
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
  const simResponse = await simulateTransaction(
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

  // @ts-ignore
  const tx = await context.client[method](paramsClient, {
    timeoutInSeconds: 30,
  })

  if (!shouldSignTransaction) {
    return tx
  }

  return tx.signAndSend()
}
