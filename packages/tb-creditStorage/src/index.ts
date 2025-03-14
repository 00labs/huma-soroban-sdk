import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBLQYYB2KEJ7JFJASAVYLR7BR7NS5E4AQ36QIETEHTGDQ4OZL323E43S",
  }
} as const

export type ClientDataKey = {tag: "Credit", values: void} | {tag: "CreditManager", values: void} | {tag: "PoolStorage", values: void};

export const Errors = {
  501: {message:"BorrowerRequired"},

  801: {message:"StartDateLaterThanEndDate"},
  
  1: {message:"AlreadyInitialized"},

  2: {message:"ProtocolIsPausedOrPoolIsNotOn"},

  3: {message:"PoolOwnerOrHumaOwnerRequired"},

  4: {message:"PoolOperatorRequired"},

  5: {message:"AuthorizedContractCallerRequired"},

  6: {message:"UnsupportedFunction"},

  7: {message:"ZeroAmountProvided"}
}
export type CreditDataKey = {tag: "CreditConfig", values: readonly [Buffer]} | {tag: "CreditRecord", values: readonly [Buffer]} | {tag: "DueDetail", values: readonly [Buffer]} | {tag: "Borrower", values: readonly [Buffer]};

export type PayPeriodDuration = {tag: "Monthly", values: void} | {tag: "Quarterly", values: void} | {tag: "SemiAnnually", values: void};

export interface BillRefreshedEvent {
  credit_hash: Buffer;
  new_due_date: u64;
  next_due: u128;
  total_past_due: u128;
}

export type CreditState = {tag: "Deleted", values: void} | {tag: "Approved", values: void} | {tag: "GoodStanding", values: void} | {tag: "Delayed", values: void} | {tag: "Defaulted", values: void};


export interface CreditConfig {
  committed_amount: u128;
  credit_limit: u128;
  num_periods: u32;
  pay_period_duration: PayPeriodDuration;
  revolving: boolean;
  yield_bps: u32;
}


export interface CreditRecord {
  missed_periods: u32;
  next_due: u128;
  next_due_date: u64;
  remaining_periods: u32;
  state: CreditState;
  total_past_due: u128;
  unbilled_principal: u128;
  yield_due: u128;
}


export interface DueDetail {
  accrued: u128;
  committed: u128;
  late_fee: u128;
  late_fee_updated_date: u64;
  paid: u128;
  principal_past_due: u128;
  yield_past_due: u128;
}


export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({credit, credit_manager, pool_storage}: {credit: string, credit_manager: string, pool_storage: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_contract_addrs transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_contract_addrs: ({credit, credit_manager}: {credit: string, credit_manager: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_credit_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_credit_config: ({credit_hash, cc}: {credit_hash: Buffer, cc: CreditConfig}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_credit_record transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_credit_record: ({caller, credit_hash, cr}: {caller: string, credit_hash: Buffer, cr: CreditRecord}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_due_detail transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_due_detail: ({caller, credit_hash, dd}: {caller: string, credit_hash: Buffer, dd: DueDetail}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_borrower transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_borrower: ({credit_hash, addr}: {credit_hash: Buffer, addr: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: ({new_wasm_hash}: {new_wasm_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_credit_hash transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_credit_hash: ({borrower}: {borrower: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>

  /**
   * Construct and simulate a get_credit_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_credit_config: ({credit_hash}: {credit_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<CreditConfig>>

  /**
   * Construct and simulate a get_credit_record transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_credit_record: ({credit_hash}: {credit_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<CreditRecord>>

  /**
   * Construct and simulate a get_due_detail transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_due_detail: ({credit_hash}: {credit_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<DueDetail>>

  /**
   * Construct and simulate a get_borrower transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_borrower: ({credit_hash}: {credit_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a require_borrower transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  require_borrower: ({borrower}: {borrower: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAADAAAAAAAAAAAAAAAGQ3JlZGl0AAAAAAAAAAAAAAAAAA1DcmVkaXRNYW5hZ2VyAAAAAAAAAAAAAAAAAAALUG9vbFN0b3JhZ2UA",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAGY3JlZGl0AAAAAAATAAAAAAAAAA5jcmVkaXRfbWFuYWdlcgAAAAAAEwAAAAAAAAAMcG9vbF9zdG9yYWdlAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAASc2V0X2NvbnRyYWN0X2FkZHJzAAAAAAACAAAAAAAAAAZjcmVkaXQAAAAAABMAAAAAAAAADmNyZWRpdF9tYW5hZ2VyAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAARc2V0X2NyZWRpdF9jb25maWcAAAAAAAACAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAAAAAACY2MAAAAAB9AAAAAMQ3JlZGl0Q29uZmlnAAAAAA==",
        "AAAAAAAAAAAAAAARc2V0X2NyZWRpdF9yZWNvcmQAAAAAAAADAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAAC2NyZWRpdF9oYXNoAAAAA+4AAAAgAAAAAAAAAAJjcgAAAAAH0AAAAAxDcmVkaXRSZWNvcmQAAAAA",
        "AAAAAAAAAAAAAAAOc2V0X2R1ZV9kZXRhaWwAAAAAAAMAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAAAmRkAAAAAAfQAAAACUR1ZURldGFpbAAAAAAAAAA=",
        "AAAAAAAAAAAAAAAMc2V0X2JvcnJvd2VyAAAAAgAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAABGFkZHIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAPZ2V0X2NyZWRpdF9oYXNoAAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAARZ2V0X2NyZWRpdF9jb25maWcAAAAAAAABAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAEAAAfQAAAADENyZWRpdENvbmZpZw==",
        "AAAAAAAAAAAAAAARZ2V0X2NyZWRpdF9yZWNvcmQAAAAAAAABAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAEAAAfQAAAADENyZWRpdFJlY29yZA==",
        "AAAAAAAAAAAAAAAOZ2V0X2R1ZV9kZXRhaWwAAAAAAAEAAAAAAAAAC2NyZWRpdF9oYXNoAAAAA+4AAAAgAAAAAQAAB9AAAAAJRHVlRGV0YWlsAAAA",
        "AAAAAAAAAAAAAAAMZ2V0X2JvcnJvd2VyAAAAAQAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAQcmVxdWlyZV9ib3Jyb3dlcgAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAPuAAAAIA==",
        "AAAABAAAAAAAAAAAAAAAEkNyZWRpdFN0b3JhZ2VFcnJvcgAAAAAAAQAAAAAAAAAQQm9ycm93ZXJSZXF1aXJlZAAAAfU=",
        "AAAAAgAAAAAAAAAAAAAADUNyZWRpdERhdGFLZXkAAAAAAAAEAAAAAQAAAAAAAAAMQ3JlZGl0Q29uZmlnAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAMQ3JlZGl0UmVjb3JkAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAJRHVlRGV0YWlsAAAAAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAIQm9ycm93ZXIAAAABAAAD7gAAACA=",
        "AAAAAgAAAAAAAAAAAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAwAAAAAAAAAAAAAAB01vbnRobHkAAAAAAAAAAAAAAAAJUXVhcnRlcmx5AAAAAAAAAAAAAAAAAAAMU2VtaUFubnVhbGx5",
        "AAAABAAAAAAAAAAAAAAADUNhbGVuZGFyRXJyb3IAAAAAAAABAAAAAAAAABlTdGFydERhdGVMYXRlclRoYW5FbmREYXRlAAAAAAADIQ==",
        "AAAABAAAAAAAAAAAAAAAC0NvbW1vbkVycm9yAAAAAAcAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAdUHJvdG9jb2xJc1BhdXNlZE9yUG9vbElzTm90T24AAAAAAAACAAAAAAAAABxQb29sT3duZXJPckh1bWFPd25lclJlcXVpcmVkAAAAAwAAAAAAAAAUUG9vbE9wZXJhdG9yUmVxdWlyZWQAAAAEAAAAAAAAACBBdXRob3JpemVkQ29udHJhY3RDYWxsZXJSZXF1aXJlZAAAAAUAAAAAAAAAE1Vuc3VwcG9ydGVkRnVuY3Rpb24AAAAABgAAAAAAAAASWmVyb0Ftb3VudFByb3ZpZGVkAAAAAAAH",
        "AAAAAQAAAAAAAAAAAAAAEkJpbGxSZWZyZXNoZWRFdmVudAAAAAAABAAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADG5ld19kdWVfZGF0ZQAAAAYAAAAAAAAACG5leHRfZHVlAAAACgAAAAAAAAAOdG90YWxfcGFzdF9kdWUAAAAAAAo=",
        "AAAAAgAAAAAAAAAAAAAAC0NyZWRpdFN0YXRlAAAAAAUAAAAAAAAAAAAAAAdEZWxldGVkAAAAAAAAAAAAAAAACEFwcHJvdmVkAAAAAAAAAAAAAAAMR29vZFN0YW5kaW5nAAAAAAAAAAAAAAAHRGVsYXllZAAAAAAAAAAAAAAAAAlEZWZhdWx0ZWQAAAA=",
        "AAAAAQAAAAAAAAAAAAAADENyZWRpdENvbmZpZwAAAAYAAAAAAAAAEGNvbW1pdHRlZF9hbW91bnQAAAAKAAAAAAAAAAxjcmVkaXRfbGltaXQAAAAKAAAAAAAAAAtudW1fcGVyaW9kcwAAAAAEAAAAAAAAABNwYXlfcGVyaW9kX2R1cmF0aW9uAAAAB9AAAAARUGF5UGVyaW9kRHVyYXRpb24AAAAAAAAAAAAACXJldm9sdmluZwAAAAAAAAEAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAADENyZWRpdFJlY29yZAAAAAgAAAAAAAAADm1pc3NlZF9wZXJpb2RzAAAAAAAEAAAAAAAAAAhuZXh0X2R1ZQAAAAoAAAAAAAAADW5leHRfZHVlX2RhdGUAAAAAAAAGAAAAAAAAABFyZW1haW5pbmdfcGVyaW9kcwAAAAAAAAQAAAAAAAAABXN0YXRlAAAAAAAH0AAAAAtDcmVkaXRTdGF0ZQAAAAAAAAAADnRvdGFsX3Bhc3RfZHVlAAAAAAAKAAAAAAAAABJ1bmJpbGxlZF9wcmluY2lwYWwAAAAAAAoAAAAAAAAACXlpZWxkX2R1ZQAAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAACUR1ZURldGFpbAAAAAAAAAcAAAAAAAAAB2FjY3J1ZWQAAAAACgAAAAAAAAAJY29tbWl0dGVkAAAAAAAACgAAAAAAAAAIbGF0ZV9mZWUAAAAKAAAAAAAAABVsYXRlX2ZlZV91cGRhdGVkX2RhdGUAAAAAAAAGAAAAAAAAAARwYWlkAAAACgAAAAAAAAAScHJpbmNpcGFsX3Bhc3RfZHVlAAAAAAAKAAAAAAAAAA55aWVsZF9wYXN0X2R1ZQAAAAAACg==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        set_contract_addrs: this.txFromJSON<null>,
        set_credit_config: this.txFromJSON<null>,
        set_credit_record: this.txFromJSON<null>,
        set_due_detail: this.txFromJSON<null>,
        set_borrower: this.txFromJSON<null>,
        upgrade: this.txFromJSON<null>,
        get_credit_hash: this.txFromJSON<Buffer>,
        get_credit_config: this.txFromJSON<CreditConfig>,
        get_credit_record: this.txFromJSON<CreditRecord>,
        get_due_detail: this.txFromJSON<DueDetail>,
        get_borrower: this.txFromJSON<string>,
        require_borrower: this.txFromJSON<Buffer>
  }
}
