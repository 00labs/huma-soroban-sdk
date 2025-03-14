import { rpc, Address, xdr, scValToNative } from '@stellar/stellar-sdk'
import { getCommonProps, TransactionContext } from './client'

const getDepositRecordKey = (contractId: string, address: string) => {
  const addressScVal = new Address(address).toScVal()
  return xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: new Address(contractId).toScAddress(),
      key: xdr.ScVal.scvVec([
        xdr.ScVal.scvSymbol('DepositRecord'),
        addressScVal,
      ]),
      durability: xdr.ContractDataDurability.persistent(),
    }),
  )
}

export type DepositRecord = {
  lastDepositTime: number
  principal: bigint
}

export async function fetchStellarDepositRecord(
  transactionContext: TransactionContext,
  account: string,
): Promise<DepositRecord | null> {
  try {
    const server = new rpc.Server(
      getCommonProps(
        transactionContext.network,
        transactionContext.wallet,
      ).rpcUrl,
    )

    const key = getDepositRecordKey(transactionContext.contractId, account)
    // Get the contract data with proper durability
    const response = await server.getLedgerEntries(key)

    const contractData = response.entries[0].val

    if (contractData.switch() === xdr.LedgerEntryType.contractData()) {
      const data = scValToNative(contractData.contractData().val())

      if (
        data.last_deposit_time === undefined ||
        data.principal === undefined
      ) {
        return null
      }

      return {
        lastDepositTime: Number(data.last_deposit_time),
        principal: BigInt(data.principal),
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching deposit record:', error)
    return null
  }
}
