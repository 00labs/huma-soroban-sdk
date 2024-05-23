import { ContractSpec, Address } from '@stellar/stellar-sdk';
import { Buffer } from "buffer";
import {
  AssembledTransaction,
  ContractClient,
  ContractClientOptions,
} from '@stellar/stellar-sdk/lib/contract_client/index.js';
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
} from '@stellar/stellar-sdk/lib/contract_client';
import { Result } from '@stellar/stellar-sdk/lib/rust_types/index.js';
export * from '@stellar/stellar-sdk'
export * from '@stellar/stellar-sdk/lib/contract_client/index.js'
export * from '@stellar/stellar-sdk/lib/rust_types/index.js'

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCQMDMB2J6XRPZKG4QYNSXNN6W56HH5QCQXM6MDIW7ZEJRYSLL2ZEG2U",
  }
} as const

export type ClientDataKey = {tag: "Credit", values: void} | {tag: "CreditManager", values: void};

export const Errors = {
  77: {message:""}
}
export type CreditDataKey = {tag: "CreditConfig", values: readonly [Buffer]} | {tag: "CreditRecord", values: readonly [Buffer]} | {tag: "DueDetail", values: readonly [Buffer]} | {tag: "Borrower", values: readonly [Buffer]};

export type PayPeriodDuration = {tag: "Monthly", values: void} | {tag: "Quarterly", values: void} | {tag: "SemiAnnually", values: void};

export type CreditState = {tag: "Deleted", values: void} | {tag: "Approved", values: void} | {tag: "GoodStanding", values: void} | {tag: "Delayed", values: void} | {tag: "Defaulted", values: void};


/**
 * `CreditConfig` keeps track of the static settings of a credit.
 * A `CreditConfig` is created after the approval of each credit.
 * # Fields:
 * * `credit_limit` - The maximum amount that can be borrowed.
 * * `committed_amount` - The amount that the borrower has committed to use. If the used credit
 * is less than this amount, the borrower will be charged yield using this amount.
 * * `pay_period_duration` - The duration of each pay period, e.g., monthly, quarterly, or semi-annually.
 * * `num_of_periods` - The number of periods before the credit expires.
 * * `yield_bps` - The expected yield expressed in basis points, where 1% is 100, and 100% is 10,000. It means different things
 * for different credit types:
 * 1. For credit line, it is APR.
 * 2. For factoring, it is factoring fee for the given period.
 * 3. For dynamic yield credit, it is the estimated APY.
 * * `revolving` - A flag indicating if repeated borrowing is allowed.
 */
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
  initialize: ({credit, credit_manager}: {credit: string, credit_manager: string}, options?: {
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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAACAAAAAAAAAAAAAAAGQ3JlZGl0AAAAAAAAAAAAAAAAAA1DcmVkaXRNYW5hZ2VyAAAA",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAGY3JlZGl0AAAAAAATAAAAAAAAAA5jcmVkaXRfbWFuYWdlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAARc2V0X2NyZWRpdF9jb25maWcAAAAAAAACAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAAAAAACY2MAAAAAB9AAAAAMQ3JlZGl0Q29uZmlnAAAAAA==",
        "AAAAAAAAAAAAAAARc2V0X2NyZWRpdF9yZWNvcmQAAAAAAAADAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAAC2NyZWRpdF9oYXNoAAAAA+4AAAAgAAAAAAAAAAJjcgAAAAAH0AAAAAxDcmVkaXRSZWNvcmQAAAAA",
        "AAAAAAAAAAAAAAAOc2V0X2R1ZV9kZXRhaWwAAAAAAAMAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAAAmRkAAAAAAfQAAAACUR1ZURldGFpbAAAAAAAAAA=",
        "AAAAAAAAAAAAAAAMc2V0X2JvcnJvd2VyAAAAAgAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAABGFkZHIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAPZ2V0X2NyZWRpdF9oYXNoAAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAARZ2V0X2NyZWRpdF9jb25maWcAAAAAAAABAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAEAAAfQAAAADENyZWRpdENvbmZpZw==",
        "AAAAAAAAAAAAAAARZ2V0X2NyZWRpdF9yZWNvcmQAAAAAAAABAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAEAAAfQAAAADENyZWRpdFJlY29yZA==",
        "AAAAAAAAAAAAAAAOZ2V0X2R1ZV9kZXRhaWwAAAAAAAEAAAAAAAAAC2NyZWRpdF9oYXNoAAAAA+4AAAAgAAAAAQAAB9AAAAAJRHVlRGV0YWlsAAAA",
        "AAAAAAAAAAAAAAAMZ2V0X2JvcnJvd2VyAAAAAQAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAQcmVxdWlyZV9ib3Jyb3dlcgAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAPuAAAAIA==",
        "AAAABAAAAAAAAAAAAAAAEkNyZWRpdFN0b3JhZ2VFcnJvcgAAAAAAAQAAAAAAAAAQQm9ycm93ZXJSZXF1aXJlZAAAAE0=",
        "AAAAAgAAAAAAAAAAAAAADUNyZWRpdERhdGFLZXkAAAAAAAAEAAAAAQAAAAAAAAAMQ3JlZGl0Q29uZmlnAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAMQ3JlZGl0UmVjb3JkAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAJRHVlRGV0YWlsAAAAAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAIQm9ycm93ZXIAAAABAAAD7gAAACA=",
        "AAAAAgAAAAAAAAAAAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAwAAAAAAAAAAAAAAB01vbnRobHkAAAAAAAAAAAAAAAAJUXVhcnRlcmx5AAAAAAAAAAAAAAAAAAAMU2VtaUFubnVhbGx5",
        "AAAABAAAAAAAAAAAAAAADUNhbGVuZGFyRXJyb3IAAAAAAAABAAAAAAAAABlTdGFydERhdGVMYXRlclRoYW5FbmREYXRlAAAAAAAAZQ==",
        "AAAABAAAAAAAAAAAAAAAC0NvbW1vbkVycm9yAAAAAAIAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAgQXV0aG9yaXplZENvbnRyYWN0Q2FsbGVyUmVxdWlyZWQAAABP",
        "AAAAAgAAAAAAAAAAAAAAC0NyZWRpdFN0YXRlAAAAAAUAAAAAAAAAAAAAAAdEZWxldGVkAAAAAAAAAAAAAAAACEFwcHJvdmVkAAAAAAAAAAAAAAAMR29vZFN0YW5kaW5nAAAAAAAAAAAAAAAHRGVsYXllZAAAAAAAAAAAAAAAAAlEZWZhdWx0ZWQAAAA=",
        "AAAAAQAAA4tgQ3JlZGl0Q29uZmlnYCBrZWVwcyB0cmFjayBvZiB0aGUgc3RhdGljIHNldHRpbmdzIG9mIGEgY3JlZGl0LgpBIGBDcmVkaXRDb25maWdgIGlzIGNyZWF0ZWQgYWZ0ZXIgdGhlIGFwcHJvdmFsIG9mIGVhY2ggY3JlZGl0LgojIEZpZWxkczoKKiBgY3JlZGl0X2xpbWl0YCAtIFRoZSBtYXhpbXVtIGFtb3VudCB0aGF0IGNhbiBiZSBib3Jyb3dlZC4KKiBgY29tbWl0dGVkX2Ftb3VudGAgLSBUaGUgYW1vdW50IHRoYXQgdGhlIGJvcnJvd2VyIGhhcyBjb21taXR0ZWQgdG8gdXNlLiBJZiB0aGUgdXNlZCBjcmVkaXQKaXMgbGVzcyB0aGFuIHRoaXMgYW1vdW50LCB0aGUgYm9ycm93ZXIgd2lsbCBiZSBjaGFyZ2VkIHlpZWxkIHVzaW5nIHRoaXMgYW1vdW50LgoqIGBwYXlfcGVyaW9kX2R1cmF0aW9uYCAtIFRoZSBkdXJhdGlvbiBvZiBlYWNoIHBheSBwZXJpb2QsIGUuZy4sIG1vbnRobHksIHF1YXJ0ZXJseSwgb3Igc2VtaS1hbm51YWxseS4KKiBgbnVtX29mX3BlcmlvZHNgIC0gVGhlIG51bWJlciBvZiBwZXJpb2RzIGJlZm9yZSB0aGUgY3JlZGl0IGV4cGlyZXMuCiogYHlpZWxkX2Jwc2AgLSBUaGUgZXhwZWN0ZWQgeWllbGQgZXhwcmVzc2VkIGluIGJhc2lzIHBvaW50cywgd2hlcmUgMSUgaXMgMTAwLCBhbmQgMTAwJSBpcyAxMCwwMDAuIEl0IG1lYW5zIGRpZmZlcmVudCB0aGluZ3MKZm9yIGRpZmZlcmVudCBjcmVkaXQgdHlwZXM6CjEuIEZvciBjcmVkaXQgbGluZSwgaXQgaXMgQVBSLgoyLiBGb3IgZmFjdG9yaW5nLCBpdCBpcyBmYWN0b3JpbmcgZmVlIGZvciB0aGUgZ2l2ZW4gcGVyaW9kLgozLiBGb3IgZHluYW1pYyB5aWVsZCBjcmVkaXQsIGl0IGlzIHRoZSBlc3RpbWF0ZWQgQVBZLgoqIGByZXZvbHZpbmdgIC0gQSBmbGFnIGluZGljYXRpbmcgaWYgcmVwZWF0ZWQgYm9ycm93aW5nIGlzIGFsbG93ZWQuAAAAAAAAAAAMQ3JlZGl0Q29uZmlnAAAABgAAAAAAAAAQY29tbWl0dGVkX2Ftb3VudAAAAAoAAAAAAAAADGNyZWRpdF9saW1pdAAAAAoAAAAAAAAAC251bV9wZXJpb2RzAAAAAAQAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAJcmV2b2x2aW5nAAAAAAAAAQAAAAAAAAAJeWllbGRfYnBzAAAAAAAABA==",
        "AAAAAQAAAAAAAAAAAAAADENyZWRpdFJlY29yZAAAAAgAAAAAAAAADm1pc3NlZF9wZXJpb2RzAAAAAAAEAAAAAAAAAAhuZXh0X2R1ZQAAAAoAAAAAAAAADW5leHRfZHVlX2RhdGUAAAAAAAAGAAAAAAAAABFyZW1haW5pbmdfcGVyaW9kcwAAAAAAAAQAAAAAAAAABXN0YXRlAAAAAAAH0AAAAAtDcmVkaXRTdGF0ZQAAAAAAAAAADnRvdGFsX3Bhc3RfZHVlAAAAAAAKAAAAAAAAABJ1bmJpbGxlZF9wcmluY2lwYWwAAAAAAAoAAAAAAAAACXlpZWxkX2R1ZQAAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAACUR1ZURldGFpbAAAAAAAAAcAAAAAAAAAB2FjY3J1ZWQAAAAACgAAAAAAAAAJY29tbWl0dGVkAAAAAAAACgAAAAAAAAAIbGF0ZV9mZWUAAAAKAAAAAAAAABVsYXRlX2ZlZV91cGRhdGVkX2RhdGUAAAAAAAAGAAAAAAAAAARwYWlkAAAACgAAAAAAAAAScHJpbmNpcGFsX3Bhc3RfZHVlAAAAAAAKAAAAAAAAAA55aWVsZF9wYXN0X2R1ZQAAAAAACg==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        set_credit_config: this.txFromJSON<null>,
        set_credit_record: this.txFromJSON<null>,
        set_due_detail: this.txFromJSON<null>,
        set_borrower: this.txFromJSON<null>,
        get_credit_hash: this.txFromJSON<Buffer>,
        get_credit_config: this.txFromJSON<CreditConfig>,
        get_credit_record: this.txFromJSON<CreditRecord>,
        get_due_detail: this.txFromJSON<DueDetail>,
        get_borrower: this.txFromJSON<string>,
        require_borrower: this.txFromJSON<Buffer>
  }
}