import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
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
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCYWDOW34SPB3FCR6A633B5GS5DPRRQKTTCT4DU7YYFDRT7XBOA2HYYY",
  },
} as const;

export type ClientDataKey =
  | { tag: "Pool"; values: void }
  | { tag: "PoolStorage"; values: void }
  | { tag: "CreditStorage"; values: void }
  | { tag: "UnderlyingToken"; values: void };

export interface CreditAddressesChangedEvent {
  credit_storage: string;
  pool: string;
  pool_storage: string;
}

export const Errors = {
  601: { message: "" },
  602: { message: "" },
  603: { message: "" },
  604: { message: "" },
  605: { message: "" },
  606: { message: "" },
  607: { message: "" },
  608: { message: "" },
  609: { message: "" },
  610: { message: "" },
  101: { message: "" },
  1: { message: "" },
  2: { message: "" },
  3: { message: "" },
  4: { message: "" },
  5: { message: "" },
  221: { message: "" },
};

/**
 * A credit has been borrowed from.
 * # Fields:
 * * `borrower` - The address of the borrower.
 * * `borrow_amount` - The amount the user has borrowed.
 * * `net_amount_to_borrower` - The borrowing amount minus the fees that are charged upfront.
 */
export interface DrawdownMadeEvent {
  borrow_amount: u128;
  borrower: string;
  net_amount_to_borrower: u128;
}

/**
 * A payment has been made against the credit.
 * # Fields:
 * * `borrower` - The address of the borrower.
 * * `amount` - The payback amount.
 * * `next_due_date` - The due date of the next payment.
 * * `yield_due` - The yield due on the credit after processing the payment.
 * * `principal_due` - The principal due on the credit after processing the payment.
 * * `yield_due_paid` - The amount of this payment applied to yield due in the current billing cycle.
 * * `principal_due_paid` - The amount of this payment applied to principal due in the current billing cycle.
 * * `unbilled_principal_paid` - The amount of this payment applied to unbilled principal.
 * * `yield_past_due_paid` - The amount of this payment applied to yield past due.
 * * `late_fee_paid` - The amount of this payment applied to late fee.
 * * `principal_past_due_paid` - The amount of this payment applied to principal past due.
 */
export interface PaymentMadeEvent {
  amount: u128;
  borrower: string;
  late_fee_paid: u128;
  next_due_date: u64;
  principal_due: u128;
  principal_due_paid: u128;
  principal_past_due_paid: u128;
  unbilled_principal_paid: u128;
  yield_due: u128;
  yield_due_paid: u128;
  yield_past_due_paid: u128;
}

/**
 * A principal payment has been made against the credit.
 * # Fields:
 * * `borrower` - The address of the borrower.
 * * `payer` - The address from which the money is coming.
 * * `amount` - The payback amount.
 * * `next_due_date` - The due date of the next payment.
 * * `principal_due` - The principal due on the credit after processing the payment.
 * * `unbilled_principal` - The unbilled principal on the credit after processing the payment.
 * * `principal_due_paid` - The amount of this payment applied to principal due.
 * * `unbilled_principal_paid` - The amount of this payment applied to unbilled principal.
 */
export interface PrincipalPaymentMadeEvent {
  amount: u128;
  borrower: string;
  next_due_date: u64;
  principal_due: u128;
  principal_due_paid: u128;
  unbilled_principal: u128;
  unbilled_principal_paid: u128;
}

/**
 * An existing credit has been closed.
 * # Fields:
 * * `credit_hash` - The credit hash.
 */
export interface CreditClosedAfterPayOffEvent {
  credit_hash: Buffer;
}

export type PayPeriodDuration =
  | { tag: "Monthly"; values: void }
  | { tag: "Quarterly"; values: void }
  | { tag: "SemiAnnually"; values: void };

/**
 * Account billing info refreshed with the updated due amount and date.
 * # Fields:
 * * `credit_hash` - The hash of the credit.
 * * `new_due_date` - The updated due date of the bill.
 * * `next_due` - The amount of next due on the bill.
 * * `total_past_due` - The total amount of past due on the bill.
 */
export interface BillRefreshedEvent {
  credit_hash: Buffer;
  new_due_date: u64;
  next_due: u128;
  total_past_due: u128;
}

export type CreditState =
  | { tag: "Deleted"; values: void }
  | { tag: "Approved"; values: void }
  | { tag: "GoodStanding"; values: void }
  | { tag: "Delayed"; values: void }
  | { tag: "Defaulted"; values: void };

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

export type TranchesPolicyType =
  | { tag: "FixedSeniorYield"; values: void }
  | { tag: "RiskAdjusted"; values: void };

export interface PoolSettings {
  default_grace_period_days: u32;
  late_payment_grace_period_days: u32;
  max_credit_line: u128;
  min_deposit_amount: u128;
  pay_period_duration: PayPeriodDuration;
  principal_only_payment_allowed: boolean;
}

export interface LPConfig {
  fixed_senior_yield_bps: u32;
  liquidity_cap: u128;
  max_senior_junior_ratio: u32;
  tranches_risk_adjustment_bps: u32;
  withdrawal_lockout_period_days: u32;
}

export interface FeeStructure {
  front_loading_fee_bps: u32;
  front_loading_fee_flat: u128;
  late_fee_bps: u32;
  yield_bps: u32;
}

export type PoolStatus =
  | { tag: "Off"; values: void }
  | { tag: "On"; values: void }
  | { tag: "Closed"; values: void };

export interface Epoch {
  end_time: u64;
  id: u64;
}

export interface AdminRnR {
  liquidity_rate_bps_ea: u32;
  liquidity_rate_bps_pool_owner: u32;
  reward_rate_bps_ea: u32;
  reward_rate_bps_pool_owner: u32;
}

export interface TrancheAddresses {
  addrs: Array<Option<string>>;
}

export interface TrancheAssets {
  assets: Array<u128>;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    {
      pool,
      pool_storage,
      credit_storage,
      underlying_token,
    }: {
      pool: string;
      pool_storage: string;
      credit_storage: string;
      underlying_token: string;
    },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a set_contract_addrs transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_contract_addrs: (
    {
      pool_storage,
      pool,
      credit_storage,
    }: { pool_storage: string; pool: string; credit_storage: string },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a get_due_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_due_info: (
    { borrower }: { borrower: string },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<readonly [CreditRecord, DueDetail]>>;

  /**
   * Construct and simulate a get_next_bill_refresh_date transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_next_bill_refresh_date: (
    { borrower }: { borrower: string },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<u64>>;

  /**
   * Construct and simulate a drawdown transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  drawdown: (
    { borrower, amount }: { borrower: string; amount: u128 },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a make_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  make_payment: (
    {
      caller,
      borrower,
      amount,
    }: { caller: string; borrower: string; amount: u128 },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<readonly [u128, boolean]>>;

  /**
   * Construct and simulate a make_principal_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  make_principal_payment: (
    { borrower, amount }: { borrower: string; amount: u128 },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<readonly [u128, boolean]>>;

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: (
    { new_wasm_hash }: { new_wasm_hash: Buffer },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAAEAAAAAAAAAAAAAAAEUG9vbAAAAAAAAAAAAAAAC1Bvb2xTdG9yYWdlAAAAAAAAAAAAAAAADUNyZWRpdFN0b3JhZ2UAAAAAAAAAAAAAAAAAAA9VbmRlcmx5aW5nVG9rZW4A",
        "AAAAAQAAAAAAAAAAAAAAG0NyZWRpdEFkZHJlc3Nlc0NoYW5nZWRFdmVudAAAAAADAAAAAAAAAA5jcmVkaXRfc3RvcmFnZQAAAAAAEwAAAAAAAAAEcG9vbAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABM=",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAEcG9vbAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABMAAAAAAAAADmNyZWRpdF9zdG9yYWdlAAAAAAATAAAAAAAAABB1bmRlcmx5aW5nX3Rva2VuAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAASc2V0X2NvbnRyYWN0X2FkZHJzAAAAAAADAAAAAAAAAAxwb29sX3N0b3JhZ2UAAAATAAAAAAAAAARwb29sAAAAEwAAAAAAAAAOY3JlZGl0X3N0b3JhZ2UAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAMZ2V0X2R1ZV9pbmZvAAAAAQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAQAAA+0AAAACAAAH0AAAAAxDcmVkaXRSZWNvcmQAAAfQAAAACUR1ZURldGFpbAAAAA==",
        "AAAAAAAAAAAAAAAaZ2V0X25leHRfYmlsbF9yZWZyZXNoX2RhdGUAAAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAAG",
        "AAAAAAAAAAAAAAAIZHJhd2Rvd24AAAACAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACgAAAAA=",
        "AAAAAAAAAAAAAAAMbWFrZV9wYXltZW50AAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACgAAAAEAAAPtAAAAAgAAAAoAAAAB",
        "AAAAAAAAAAAAAAAWbWFrZV9wcmluY2lwYWxfcGF5bWVudAAAAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAAZhbW91bnQAAAAAAAoAAAABAAAD7QAAAAIAAAAKAAAAAQ==",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAABAAAAAAAAAAAAAAAC0NyZWRpdEVycm9yAAAAAAoAAAAAAAAAGkJvcnJvd2VyT3JTZW50aW5lbFJlcXVpcmVkAAAAAAJZAAAAAAAAACVBdHRlbXB0ZWREcmF3ZG93bk9uTm9uUmV2b2x2aW5nQ3JlZGl0AAAAAAACWgAAAAAAAAATQ3JlZGl0TGltaXRFeGNlZWRlZAAAAAJbAAAAAAAAAChEcmF3ZG93bk5vdEFsbG93ZWRJbkZpbmFsUGVyaW9kQW5kQmV5b25kAAACXAAAAAAAAAAiSW5zdWZmaWNpZW50UG9vbEJhbGFuY2VGb3JEcmF3ZG93bgAAAAACXQAAAAAAAAAVRmlyc3REcmF3ZG93blRvb0Vhcmx5AAAAAAACXgAAAAAAAAAbQ3JlZGl0Tm90SW5TdGF0ZUZvckRyYXdkb3duAAAAAl8AAAAAAAAAK0RyYXdkb3duTm90QWxsb3dlZEFmdGVyRHVlRGF0ZVdpdGhVbnBhaWREdWUAAAACYAAAAAAAAAAgQ3JlZGl0Tm90SW5TdGF0ZUZvck1ha2luZ1BheW1lbnQAAAJhAAAAAAAAAClDcmVkaXROb3RJblN0YXRlRm9yTWFraW5nUHJpbmNpcGFsUGF5bWVudAAAAAAAAmI=",
        "AAAAAQAAAOdBIGNyZWRpdCBoYXMgYmVlbiBib3Jyb3dlZCBmcm9tLgojIEZpZWxkczoKKiBgYm9ycm93ZXJgIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGJvcnJvd2VyLgoqIGBib3Jyb3dfYW1vdW50YCAtIFRoZSBhbW91bnQgdGhlIHVzZXIgaGFzIGJvcnJvd2VkLgoqIGBuZXRfYW1vdW50X3RvX2JvcnJvd2VyYCAtIFRoZSBib3Jyb3dpbmcgYW1vdW50IG1pbnVzIHRoZSBmZWVzIHRoYXQgYXJlIGNoYXJnZWQgdXBmcm9udC4AAAAAAAAAABFEcmF3ZG93bk1hZGVFdmVudAAAAAAAAAMAAAAAAAAADWJvcnJvd19hbW91bnQAAAAAAAAKAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAAFm5ldF9hbW91bnRfdG9fYm9ycm93ZXIAAAAAAAo=",
        "AAAAAQAAA2ZBIHBheW1lbnQgaGFzIGJlZW4gbWFkZSBhZ2FpbnN0IHRoZSBjcmVkaXQuCiMgRmllbGRzOgoqIGBib3Jyb3dlcmAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgYm9ycm93ZXIuCiogYGFtb3VudGAgLSBUaGUgcGF5YmFjayBhbW91bnQuCiogYG5leHRfZHVlX2RhdGVgIC0gVGhlIGR1ZSBkYXRlIG9mIHRoZSBuZXh0IHBheW1lbnQuCiogYHlpZWxkX2R1ZWAgLSBUaGUgeWllbGQgZHVlIG9uIHRoZSBjcmVkaXQgYWZ0ZXIgcHJvY2Vzc2luZyB0aGUgcGF5bWVudC4KKiBgcHJpbmNpcGFsX2R1ZWAgLSBUaGUgcHJpbmNpcGFsIGR1ZSBvbiB0aGUgY3JlZGl0IGFmdGVyIHByb2Nlc3NpbmcgdGhlIHBheW1lbnQuCiogYHlpZWxkX2R1ZV9wYWlkYCAtIFRoZSBhbW91bnQgb2YgdGhpcyBwYXltZW50IGFwcGxpZWQgdG8geWllbGQgZHVlIGluIHRoZSBjdXJyZW50IGJpbGxpbmcgY3ljbGUuCiogYHByaW5jaXBhbF9kdWVfcGFpZGAgLSBUaGUgYW1vdW50IG9mIHRoaXMgcGF5bWVudCBhcHBsaWVkIHRvIHByaW5jaXBhbCBkdWUgaW4gdGhlIGN1cnJlbnQgYmlsbGluZyBjeWNsZS4KKiBgdW5iaWxsZWRfcHJpbmNpcGFsX3BhaWRgIC0gVGhlIGFtb3VudCBvZiB0aGlzIHBheW1lbnQgYXBwbGllZCB0byB1bmJpbGxlZCBwcmluY2lwYWwuCiogYHlpZWxkX3Bhc3RfZHVlX3BhaWRgIC0gVGhlIGFtb3VudCBvZiB0aGlzIHBheW1lbnQgYXBwbGllZCB0byB5aWVsZCBwYXN0IGR1ZS4KKiBgbGF0ZV9mZWVfcGFpZGAgLSBUaGUgYW1vdW50IG9mIHRoaXMgcGF5bWVudCBhcHBsaWVkIHRvIGxhdGUgZmVlLgoqIGBwcmluY2lwYWxfcGFzdF9kdWVfcGFpZGAgLSBUaGUgYW1vdW50IG9mIHRoaXMgcGF5bWVudCBhcHBsaWVkIHRvIHByaW5jaXBhbCBwYXN0IGR1ZS4AAAAAAAAAAAAQUGF5bWVudE1hZGVFdmVudAAAAAsAAAAAAAAABmFtb3VudAAAAAAACgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAA1sYXRlX2ZlZV9wYWlkAAAAAAAACgAAAAAAAAANbmV4dF9kdWVfZGF0ZQAAAAAAAAYAAAAAAAAADXByaW5jaXBhbF9kdWUAAAAAAAAKAAAAAAAAABJwcmluY2lwYWxfZHVlX3BhaWQAAAAAAAoAAAAAAAAAF3ByaW5jaXBhbF9wYXN0X2R1ZV9wYWlkAAAAAAoAAAAAAAAAF3VuYmlsbGVkX3ByaW5jaXBhbF9wYWlkAAAAAAoAAAAAAAAACXlpZWxkX2R1ZQAAAAAAAAoAAAAAAAAADnlpZWxkX2R1ZV9wYWlkAAAAAAAKAAAAAAAAABN5aWVsZF9wYXN0X2R1ZV9wYWlkAAAAAAo=",
        "AAAAAQAAAk5BIHByaW5jaXBhbCBwYXltZW50IGhhcyBiZWVuIG1hZGUgYWdhaW5zdCB0aGUgY3JlZGl0LgojIEZpZWxkczoKKiBgYm9ycm93ZXJgIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGJvcnJvd2VyLgoqIGBwYXllcmAgLSBUaGUgYWRkcmVzcyBmcm9tIHdoaWNoIHRoZSBtb25leSBpcyBjb21pbmcuCiogYGFtb3VudGAgLSBUaGUgcGF5YmFjayBhbW91bnQuCiogYG5leHRfZHVlX2RhdGVgIC0gVGhlIGR1ZSBkYXRlIG9mIHRoZSBuZXh0IHBheW1lbnQuCiogYHByaW5jaXBhbF9kdWVgIC0gVGhlIHByaW5jaXBhbCBkdWUgb24gdGhlIGNyZWRpdCBhZnRlciBwcm9jZXNzaW5nIHRoZSBwYXltZW50LgoqIGB1bmJpbGxlZF9wcmluY2lwYWxgIC0gVGhlIHVuYmlsbGVkIHByaW5jaXBhbCBvbiB0aGUgY3JlZGl0IGFmdGVyIHByb2Nlc3NpbmcgdGhlIHBheW1lbnQuCiogYHByaW5jaXBhbF9kdWVfcGFpZGAgLSBUaGUgYW1vdW50IG9mIHRoaXMgcGF5bWVudCBhcHBsaWVkIHRvIHByaW5jaXBhbCBkdWUuCiogYHVuYmlsbGVkX3ByaW5jaXBhbF9wYWlkYCAtIFRoZSBhbW91bnQgb2YgdGhpcyBwYXltZW50IGFwcGxpZWQgdG8gdW5iaWxsZWQgcHJpbmNpcGFsLgAAAAAAAAAAABlQcmluY2lwYWxQYXltZW50TWFkZUV2ZW50AAAAAAAABwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAADW5leHRfZHVlX2RhdGUAAAAAAAAGAAAAAAAAAA1wcmluY2lwYWxfZHVlAAAAAAAACgAAAAAAAAAScHJpbmNpcGFsX2R1ZV9wYWlkAAAAAAAKAAAAAAAAABJ1bmJpbGxlZF9wcmluY2lwYWwAAAAAAAoAAAAAAAAAF3VuYmlsbGVkX3ByaW5jaXBhbF9wYWlkAAAAAAo=",
        "AAAAAQAAAFBBbiBleGlzdGluZyBjcmVkaXQgaGFzIGJlZW4gY2xvc2VkLgojIEZpZWxkczoKKiBgY3JlZGl0X2hhc2hgIC0gVGhlIGNyZWRpdCBoYXNoLgAAAAAAAAAcQ3JlZGl0Q2xvc2VkQWZ0ZXJQYXlPZmZFdmVudAAAAAEAAAAAAAAAC2NyZWRpdF9oYXNoAAAAA+4AAAAg",
        "AAAAAgAAAAAAAAAAAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAwAAAAAAAAAAAAAAB01vbnRobHkAAAAAAAAAAAAAAAAJUXVhcnRlcmx5AAAAAAAAAAAAAAAAAAAMU2VtaUFubnVhbGx5",
        "AAAABAAAAAAAAAAAAAAADUNhbGVuZGFyRXJyb3IAAAAAAAABAAAAAAAAABlTdGFydERhdGVMYXRlclRoYW5FbmREYXRlAAAAAAAAZQ==",
        "AAAABAAAAAAAAAAAAAAAC0NvbW1vbkVycm9yAAAAAAUAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAdUHJvdG9jb2xJc1BhdXNlZE9yUG9vbElzTm90T24AAAAAAAACAAAAAAAAACBBdXRob3JpemVkQ29udHJhY3RDYWxsZXJSZXF1aXJlZAAAAAMAAAAAAAAAE1Vuc3VwcG9ydGVkRnVuY3Rpb24AAAAABAAAAAAAAAASWmVyb0Ftb3VudFByb3ZpZGVkAAAAAAAF",
        "AAAAAQAAAR9BY2NvdW50IGJpbGxpbmcgaW5mbyByZWZyZXNoZWQgd2l0aCB0aGUgdXBkYXRlZCBkdWUgYW1vdW50IGFuZCBkYXRlLgojIEZpZWxkczoKKiBgY3JlZGl0X2hhc2hgIC0gVGhlIGhhc2ggb2YgdGhlIGNyZWRpdC4KKiBgbmV3X2R1ZV9kYXRlYCAtIFRoZSB1cGRhdGVkIGR1ZSBkYXRlIG9mIHRoZSBiaWxsLgoqIGBuZXh0X2R1ZWAgLSBUaGUgYW1vdW50IG9mIG5leHQgZHVlIG9uIHRoZSBiaWxsLgoqIGB0b3RhbF9wYXN0X2R1ZWAgLSBUaGUgdG90YWwgYW1vdW50IG9mIHBhc3QgZHVlIG9uIHRoZSBiaWxsLgAAAAAAAAAAEkJpbGxSZWZyZXNoZWRFdmVudAAAAAAABAAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADG5ld19kdWVfZGF0ZQAAAAYAAAAAAAAACG5leHRfZHVlAAAACgAAAAAAAAAOdG90YWxfcGFzdF9kdWUAAAAAAAo=",
        "AAAAAgAAAAAAAAAAAAAAC0NyZWRpdFN0YXRlAAAAAAUAAAAAAAAAAAAAAAdEZWxldGVkAAAAAAAAAAAAAAAACEFwcHJvdmVkAAAAAAAAAAAAAAAMR29vZFN0YW5kaW5nAAAAAAAAAAAAAAAHRGVsYXllZAAAAAAAAAAAAAAAAAlEZWZhdWx0ZWQAAAA=",
        "AAAAAQAAA4tgQ3JlZGl0Q29uZmlnYCBrZWVwcyB0cmFjayBvZiB0aGUgc3RhdGljIHNldHRpbmdzIG9mIGEgY3JlZGl0LgpBIGBDcmVkaXRDb25maWdgIGlzIGNyZWF0ZWQgYWZ0ZXIgdGhlIGFwcHJvdmFsIG9mIGVhY2ggY3JlZGl0LgojIEZpZWxkczoKKiBgY3JlZGl0X2xpbWl0YCAtIFRoZSBtYXhpbXVtIGFtb3VudCB0aGF0IGNhbiBiZSBib3Jyb3dlZC4KKiBgY29tbWl0dGVkX2Ftb3VudGAgLSBUaGUgYW1vdW50IHRoYXQgdGhlIGJvcnJvd2VyIGhhcyBjb21taXR0ZWQgdG8gdXNlLiBJZiB0aGUgdXNlZCBjcmVkaXQKaXMgbGVzcyB0aGFuIHRoaXMgYW1vdW50LCB0aGUgYm9ycm93ZXIgd2lsbCBiZSBjaGFyZ2VkIHlpZWxkIHVzaW5nIHRoaXMgYW1vdW50LgoqIGBwYXlfcGVyaW9kX2R1cmF0aW9uYCAtIFRoZSBkdXJhdGlvbiBvZiBlYWNoIHBheSBwZXJpb2QsIGUuZy4sIG1vbnRobHksIHF1YXJ0ZXJseSwgb3Igc2VtaS1hbm51YWxseS4KKiBgbnVtX29mX3BlcmlvZHNgIC0gVGhlIG51bWJlciBvZiBwZXJpb2RzIGJlZm9yZSB0aGUgY3JlZGl0IGV4cGlyZXMuCiogYHlpZWxkX2Jwc2AgLSBUaGUgZXhwZWN0ZWQgeWllbGQgZXhwcmVzc2VkIGluIGJhc2lzIHBvaW50cywgd2hlcmUgMSUgaXMgMTAwLCBhbmQgMTAwJSBpcyAxMCwwMDAuIEl0IG1lYW5zIGRpZmZlcmVudCB0aGluZ3MKZm9yIGRpZmZlcmVudCBjcmVkaXQgdHlwZXM6CjEuIEZvciBjcmVkaXQgbGluZSwgaXQgaXMgQVBSLgoyLiBGb3IgZmFjdG9yaW5nLCBpdCBpcyBmYWN0b3JpbmcgZmVlIGZvciB0aGUgZ2l2ZW4gcGVyaW9kLgozLiBGb3IgZHluYW1pYyB5aWVsZCBjcmVkaXQsIGl0IGlzIHRoZSBlc3RpbWF0ZWQgQVBZLgoqIGByZXZvbHZpbmdgIC0gQSBmbGFnIGluZGljYXRpbmcgaWYgcmVwZWF0ZWQgYm9ycm93aW5nIGlzIGFsbG93ZWQuAAAAAAAAAAAMQ3JlZGl0Q29uZmlnAAAABgAAAAAAAAAQY29tbWl0dGVkX2Ftb3VudAAAAAoAAAAAAAAADGNyZWRpdF9saW1pdAAAAAoAAAAAAAAAC251bV9wZXJpb2RzAAAAAAQAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAJcmV2b2x2aW5nAAAAAAAAAQAAAAAAAAAJeWllbGRfYnBzAAAAAAAABA==",
        "AAAAAQAAAAAAAAAAAAAADENyZWRpdFJlY29yZAAAAAgAAAAAAAAADm1pc3NlZF9wZXJpb2RzAAAAAAAEAAAAAAAAAAhuZXh0X2R1ZQAAAAoAAAAAAAAADW5leHRfZHVlX2RhdGUAAAAAAAAGAAAAAAAAABFyZW1haW5pbmdfcGVyaW9kcwAAAAAAAAQAAAAAAAAABXN0YXRlAAAAAAAH0AAAAAtDcmVkaXRTdGF0ZQAAAAAAAAAADnRvdGFsX3Bhc3RfZHVlAAAAAAAKAAAAAAAAABJ1bmJpbGxlZF9wcmluY2lwYWwAAAAAAAoAAAAAAAAACXlpZWxkX2R1ZQAAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAACUR1ZURldGFpbAAAAAAAAAcAAAAAAAAAB2FjY3J1ZWQAAAAACgAAAAAAAAAJY29tbWl0dGVkAAAAAAAACgAAAAAAAAAIbGF0ZV9mZWUAAAAKAAAAAAAAABVsYXRlX2ZlZV91cGRhdGVkX2RhdGUAAAAAAAAGAAAAAAAAAARwYWlkAAAACgAAAAAAAAAScHJpbmNpcGFsX3Bhc3RfZHVlAAAAAAAKAAAAAAAAAA55aWVsZF9wYXN0X2R1ZQAAAAAACg==",
        "AAAABAAAAAAAAAAAAAAAD0R1ZU1hbmFnZXJFcnJvcgAAAAABAAAAAAAAACBCb3Jyb3dBbW91bnRMZXNzVGhhblBsYXRmb3JtRmVlcwAAAN0=",
        "AAAAAgAAAAAAAAAAAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAgAAAAAAAAAAAAAAEEZpeGVkU2VuaW9yWWllbGQAAAAAAAAAAAAAAAxSaXNrQWRqdXN0ZWQ=",
        "AAAAAQAAAAAAAAAAAAAADFBvb2xTZXR0aW5ncwAAAAYAAAAAAAAAGWRlZmF1bHRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAAEAAAAAAAAAB5sYXRlX3BheW1lbnRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAACExQQ29uZmlnAAAABQAAAAAAAAAWZml4ZWRfc2VuaW9yX3lpZWxkX2JwcwAAAAAABAAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAADEZlZVN0cnVjdHVyZQAAAAQAAAAAAAAAFWZyb250X2xvYWRpbmdfZmVlX2JwcwAAAAAAAAQAAAAAAAAAFmZyb250X2xvYWRpbmdfZmVlX2ZsYXQAAAAAAAoAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAgAAAAAAAAAAAAAAClBvb2xTdGF0dXMAAAAAAAMAAAAAAAAAAAAAAANPZmYAAAAAAAAAAAAAAAACT24AAAAAAAAAAAAAAAAABkNsb3NlZAAA",
        "AAAAAQAAAAAAAAAAAAAABUVwb2NoAAAAAAAAAgAAAAAAAAAIZW5kX3RpbWUAAAAGAAAAAAAAAAJpZAAAAAAABg==",
        "AAAAAQAAAAAAAAAAAAAACEFkbWluUm5SAAAABAAAAAAAAAAVbGlxdWlkaXR5X3JhdGVfYnBzX2VhAAAAAAAABAAAAAAAAAAdbGlxdWlkaXR5X3JhdGVfYnBzX3Bvb2xfb3duZXIAAAAAAAAEAAAAAAAAABJyZXdhcmRfcmF0ZV9icHNfZWEAAAAAAAQAAAAAAAAAGnJld2FyZF9yYXRlX2Jwc19wb29sX293bmVyAAAAAAAE",
        "AAAAAQAAAAAAAAAAAAAAEFRyYW5jaGVBZGRyZXNzZXMAAAABAAAAAAAAAAVhZGRycwAAAAAAA+oAAAPoAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAADVRyYW5jaGVBc3NldHMAAAAAAAABAAAAAAAAAAZhc3NldHMAAAAAA+oAAAAK",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    set_contract_addrs: this.txFromJSON<null>,
    get_due_info: this.txFromJSON<readonly [CreditRecord, DueDetail]>,
    get_next_bill_refresh_date: this.txFromJSON<u64>,
    drawdown: this.txFromJSON<null>,
    make_payment: this.txFromJSON<readonly [u128, boolean]>,
    make_principal_payment: this.txFromJSON<readonly [u128, boolean]>,
    upgrade: this.txFromJSON<null>,
  };
}
