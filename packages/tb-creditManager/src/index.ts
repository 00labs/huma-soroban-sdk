import { ContractSpec, Address } from "@stellar/stellar-sdk";
import { Buffer } from "buffer";
import {
  AssembledTransaction,
  ContractClient,
  ContractClientOptions,
} from "@stellar/stellar-sdk/lib/contract_client/index.js";
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
} from "@stellar/stellar-sdk/lib/contract_client";
import { Result } from "@stellar/stellar-sdk/lib/rust_types/index.js";
export * from "@stellar/stellar-sdk";
export * from "@stellar/stellar-sdk/lib/contract_client/index.js";
export * from "@stellar/stellar-sdk/lib/rust_types/index.js";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CASGH7RO7Q4H3JOMACIFKIVZDIL7AFHYELXB5JQ6VWTMQ7IMO6GEBRQ5",
  },
} as const;

export type ClientDataKey =
  | { tag: "Pool"; values: void }
  | { tag: "PoolStorage"; values: void }
  | { tag: "CreditStorage"; values: void };

export interface CreditManagerAddressesChangedEvent {
  credit_storage: string;
  pool: string;
  pool_storage: string;
}

export interface CreditStorageAddressesChangedEvent {
  credit: string;
  credit_manager: string;
}

/**
 * A credit has been approved.
 * # Fields:
 * * `borrower` - The address of the borrower.
 * * `credit_hash` - The hash of the credit.
 * * `credit_limit` - The maximum amount that can be borrowed.
 * * `period_duration` - The duration of each pay period, e.g., monthly, quarterly, or semi-annually.
 * * `remaining_periods` - The number of periods before the credit expires.
 * * `yield_bps` - The expected yield expressed in basis points, where 1% is 100, and 100% is 10,000.
 * * `committed_amount` - The amount that the borrower has committed to use. If the used credit
 * is less than this amount, the borrower will be charged yield using this amount.
 * * `designated_start_date` - The date after which the credit can start.
 * * `revolving` - A flag indicating if repeated borrowing is allowed.
 */
export interface CreditApprovedEvent {
  borrower: string;
  committed_amount: u128;
  credit_hash: Buffer;
  credit_limit: u128;
  designated_start_date: u64;
  period_duration: PayPeriodDuration;
  remaining_periods: u32;
  revolving: boolean;
  yield_bps: u32;
}

/**
 * A credit with a committed amount has started.
 * # Fields:
 * * `credit_hash` - The hash of the credit.
 */
export interface CommittedCreditStartedEvent {
  credit_hash: Buffer;
}

/**
 * An existing credit has been closed by an admin.
 * # Fields:
 * * `credit_hash` - The hash of the credit.
 */
export interface CreditClosedByAdminEvent {
  credit_hash: Buffer;
}

/**
 * The credit has been marked as Defaulted.
 * # Fields:
 * * `credit_hash` - The hash of the credit.
 * * `principal_loss` - The principal losses to be written off because of the default.
 * * `yield_loss` - The unpaid yield due to be written off.
 * * `fees_loss` - The unpaid fees to be written off.
 */
export interface DefaultTriggeredEvent {
  credit_hash: Buffer;
  fees_loss: u128;
  principal_loss: u128;
  yield_loss: u128;
}

/**
 * The expiration (maturity) date of a credit has been extended.
 * # Fields:
 * * `credit_hash` - The hash of the credit.
 * * `old_remaining_periods` - The number of remaining pay periods before the extension.
 * * `new_remaining_periods` - The number of remaining pay periods after the extension.
 */
export interface RemainingPeriodsExtendedEvent {
  credit_hash: Buffer;
  new_remaining_periods: u32;
  old_remaining_periods: u32;
}

/**
 * The yield of a credit has been updated.
 * # Fields:
 * * `credit_hash` - The credit hash.
 * * `old_yield_bps` - The old yield in basis points before the update.
 * * `new_yield_bps` - The new yield in basis points after the update.
 */
export interface YieldUpdatedEvent {
  credit_hash: Buffer;
  new_yield_bps: u32;
  old_yield_bps: u32;
}

/**
 * The credit limit and committed amount of a credit have been updated.
 * # Fields:
 * * `credit_hash` - The credit hash.
 * * `old_credit_limit` - The old credit limit before the update.
 * * `new_credit_limit` - The new credit limit after the update.
 * * `old_committed_amount` - The old committed amount before the update.
 * * `new_committed_amount` - The new committed amount after the update.
 */
export interface LimitAndCommitmentUpdatedEvent {
  credit_hash: Buffer;
  new_committed_amount: u128;
  new_credit_limit: u128;
  old_committed_amount: u128;
  old_credit_limit: u128;
}

/**
 * Part or all of the late fee due of a credit has been waived.
 * # Fields:
 * * `credit_hash` - The credit hash.
 * * `old_late_fee` - The amount of late fee before the update.
 * * `new_late_fee` - The amount of late fee after the update.
 */
export interface LateFeeWaivedEvent {
  credit_hash: Buffer;
  new_late_fee: u128;
  old_late_fee: u128;
}

export const Errors = {
  701: { message: "" },
  702: { message: "" },
  703: { message: "" },
  704: { message: "" },
  705: { message: "" },
  706: { message: "" },
  707: { message: "" },
  708: { message: "" },
  709: { message: "" },
  710: { message: "" },
  711: { message: "" },
  712: { message: "" },
  713: { message: "" },
  714: { message: "" },
  715: { message: "" },
};
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
    }: { pool: string; pool_storage: string; credit_storage: string },
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
   * Construct and simulate a set_storage_contract_addrs transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_storage_contract_addrs: (
    { credit, credit_manager }: { credit: string; credit_manager: string },
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
   * Construct and simulate a approve_borrower transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve_borrower: (
    {
      borrower,
      credit_limit,
      num_periods,
      yield_bps,
      committed_amount,
      designated_start_date,
      revolving,
    }: {
      borrower: string;
      credit_limit: u128;
      num_periods: u32;
      yield_bps: u32;
      committed_amount: u128;
      designated_start_date: u64;
      revolving: boolean;
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
   * Construct and simulate a start_committed_credit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  start_committed_credit: (
    { caller, borrower }: { caller: string; borrower: string },
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
   * Construct and simulate a refresh_credit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  refresh_credit: (
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
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a is_default_ready transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_default_ready: (
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
  ) => Promise<AssembledTransaction<boolean>>;

  /**
   * Construct and simulate a trigger_default transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  trigger_default: (
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
  ) => Promise<AssembledTransaction<readonly [u128, u128, u128]>>;

  /**
   * Construct and simulate a update_yield transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_yield: (
    { borrower, new_yield_bps }: { borrower: string; new_yield_bps: u32 },
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
   * Construct and simulate a extend_remaining_period transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  extend_remaining_period: (
    { borrower, num_of_periods }: { borrower: string; num_of_periods: u32 },
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
   * Construct and simulate a update_limit_and_commitment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_limit_and_commitment: (
    {
      borrower,
      new_credit_limit,
      new_committed_amount,
    }: { borrower: string; new_credit_limit: u128; new_committed_amount: u128 },
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
   * Construct and simulate a waive_late_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  waive_late_fee: (
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
  ) => Promise<AssembledTransaction<u128>>;

  /**
   * Construct and simulate a close_credit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  close_credit: (
    { caller, borrower }: { caller: string; borrower: string },
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
        "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAADAAAAAAAAAAAAAAAEUG9vbAAAAAAAAAAAAAAAC1Bvb2xTdG9yYWdlAAAAAAAAAAAAAAAADUNyZWRpdFN0b3JhZ2UAAAA=",
        "AAAAAQAAAAAAAAAAAAAAIkNyZWRpdE1hbmFnZXJBZGRyZXNzZXNDaGFuZ2VkRXZlbnQAAAAAAAMAAAAAAAAADmNyZWRpdF9zdG9yYWdlAAAAAAATAAAAAAAAAARwb29sAAAAEwAAAAAAAAAMcG9vbF9zdG9yYWdlAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAIkNyZWRpdFN0b3JhZ2VBZGRyZXNzZXNDaGFuZ2VkRXZlbnQAAAAAAAIAAAAAAAAABmNyZWRpdAAAAAAAEwAAAAAAAAAOY3JlZGl0X21hbmFnZXIAAAAAABM=",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAEcG9vbAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABMAAAAAAAAADmNyZWRpdF9zdG9yYWdlAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAASc2V0X2NvbnRyYWN0X2FkZHJzAAAAAAADAAAAAAAAAAxwb29sX3N0b3JhZ2UAAAATAAAAAAAAAARwb29sAAAAEwAAAAAAAAAOY3JlZGl0X3N0b3JhZ2UAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAac2V0X3N0b3JhZ2VfY29udHJhY3RfYWRkcnMAAAAAAAIAAAAAAAAABmNyZWRpdAAAAAAAEwAAAAAAAAAOY3JlZGl0X21hbmFnZXIAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAQYXBwcm92ZV9ib3Jyb3dlcgAAAAcAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAMY3JlZGl0X2xpbWl0AAAACgAAAAAAAAALbnVtX3BlcmlvZHMAAAAABAAAAAAAAAAJeWllbGRfYnBzAAAAAAAABAAAAAAAAAAQY29tbWl0dGVkX2Ftb3VudAAAAAoAAAAAAAAAFWRlc2lnbmF0ZWRfc3RhcnRfZGF0ZQAAAAAAAAYAAAAAAAAACXJldm9sdmluZwAAAAAAAAEAAAAA",
        "AAAAAAAAAAAAAAAWc3RhcnRfY29tbWl0dGVkX2NyZWRpdAAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAOcmVmcmVzaF9jcmVkaXQAAAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAQaXNfZGVmYXVsdF9yZWFkeQAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAAB",
        "AAAAAAAAAAAAAAAPdHJpZ2dlcl9kZWZhdWx0AAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAPtAAAAAwAAAAoAAAAKAAAACg==",
        "AAAAAAAAAAAAAAAMdXBkYXRlX3lpZWxkAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAA1uZXdfeWllbGRfYnBzAAAAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAXZXh0ZW5kX3JlbWFpbmluZ19wZXJpb2QAAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAA5udW1fb2ZfcGVyaW9kcwAAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAbdXBkYXRlX2xpbWl0X2FuZF9jb21taXRtZW50AAAAAAMAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAQbmV3X2NyZWRpdF9saW1pdAAAAAoAAAAAAAAAFG5ld19jb21taXR0ZWRfYW1vdW50AAAACgAAAAA=",
        "AAAAAAAAAAAAAAAOd2FpdmVfbGF0ZV9mZWUAAAAAAAIAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAQAAAAo=",
        "AAAAAAAAAAAAAAAMY2xvc2VfY3JlZGl0AAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAQAAAv5BIGNyZWRpdCBoYXMgYmVlbiBhcHByb3ZlZC4KIyBGaWVsZHM6CiogYGJvcnJvd2VyYCAtIFRoZSBhZGRyZXNzIG9mIHRoZSBib3Jyb3dlci4KKiBgY3JlZGl0X2hhc2hgIC0gVGhlIGhhc2ggb2YgdGhlIGNyZWRpdC4KKiBgY3JlZGl0X2xpbWl0YCAtIFRoZSBtYXhpbXVtIGFtb3VudCB0aGF0IGNhbiBiZSBib3Jyb3dlZC4KKiBgcGVyaW9kX2R1cmF0aW9uYCAtIFRoZSBkdXJhdGlvbiBvZiBlYWNoIHBheSBwZXJpb2QsIGUuZy4sIG1vbnRobHksIHF1YXJ0ZXJseSwgb3Igc2VtaS1hbm51YWxseS4KKiBgcmVtYWluaW5nX3BlcmlvZHNgIC0gVGhlIG51bWJlciBvZiBwZXJpb2RzIGJlZm9yZSB0aGUgY3JlZGl0IGV4cGlyZXMuCiogYHlpZWxkX2Jwc2AgLSBUaGUgZXhwZWN0ZWQgeWllbGQgZXhwcmVzc2VkIGluIGJhc2lzIHBvaW50cywgd2hlcmUgMSUgaXMgMTAwLCBhbmQgMTAwJSBpcyAxMCwwMDAuCiogYGNvbW1pdHRlZF9hbW91bnRgIC0gVGhlIGFtb3VudCB0aGF0IHRoZSBib3Jyb3dlciBoYXMgY29tbWl0dGVkIHRvIHVzZS4gSWYgdGhlIHVzZWQgY3JlZGl0CmlzIGxlc3MgdGhhbiB0aGlzIGFtb3VudCwgdGhlIGJvcnJvd2VyIHdpbGwgYmUgY2hhcmdlZCB5aWVsZCB1c2luZyB0aGlzIGFtb3VudC4KKiBgZGVzaWduYXRlZF9zdGFydF9kYXRlYCAtIFRoZSBkYXRlIGFmdGVyIHdoaWNoIHRoZSBjcmVkaXQgY2FuIHN0YXJ0LgoqIGByZXZvbHZpbmdgIC0gQSBmbGFnIGluZGljYXRpbmcgaWYgcmVwZWF0ZWQgYm9ycm93aW5nIGlzIGFsbG93ZWQuAAAAAAAAAAAAE0NyZWRpdEFwcHJvdmVkRXZlbnQAAAAACQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAABBjb21taXR0ZWRfYW1vdW50AAAACgAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADGNyZWRpdF9saW1pdAAAAAoAAAAAAAAAFWRlc2lnbmF0ZWRfc3RhcnRfZGF0ZQAAAAAAAAYAAAAAAAAAD3BlcmlvZF9kdXJhdGlvbgAAAAfQAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAAAAABFyZW1haW5pbmdfcGVyaW9kcwAAAAAAAAQAAAAAAAAACXJldm9sdmluZwAAAAAAAAEAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAQAAAGFBIGNyZWRpdCB3aXRoIGEgY29tbWl0dGVkIGFtb3VudCBoYXMgc3RhcnRlZC4KIyBGaWVsZHM6CiogYGNyZWRpdF9oYXNoYCAtIFRoZSBoYXNoIG9mIHRoZSBjcmVkaXQuAAAAAAAAAAAAABtDb21taXR0ZWRDcmVkaXRTdGFydGVkRXZlbnQAAAAAAQAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACA=",
        "AAAAAQAAAGNBbiBleGlzdGluZyBjcmVkaXQgaGFzIGJlZW4gY2xvc2VkIGJ5IGFuIGFkbWluLgojIEZpZWxkczoKKiBgY3JlZGl0X2hhc2hgIC0gVGhlIGhhc2ggb2YgdGhlIGNyZWRpdC4AAAAAAAAAABhDcmVkaXRDbG9zZWRCeUFkbWluRXZlbnQAAAABAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIA==",
        "AAAAAQAAARxUaGUgY3JlZGl0IGhhcyBiZWVuIG1hcmtlZCBhcyBEZWZhdWx0ZWQuCiMgRmllbGRzOgoqIGBjcmVkaXRfaGFzaGAgLSBUaGUgaGFzaCBvZiB0aGUgY3JlZGl0LgoqIGBwcmluY2lwYWxfbG9zc2AgLSBUaGUgcHJpbmNpcGFsIGxvc3NlcyB0byBiZSB3cml0dGVuIG9mZiBiZWNhdXNlIG9mIHRoZSBkZWZhdWx0LgoqIGB5aWVsZF9sb3NzYCAtIFRoZSB1bnBhaWQgeWllbGQgZHVlIHRvIGJlIHdyaXR0ZW4gb2ZmLgoqIGBmZWVzX2xvc3NgIC0gVGhlIHVucGFpZCBmZWVzIHRvIGJlIHdyaXR0ZW4gb2ZmLgAAAAAAAAAVRGVmYXVsdFRyaWdnZXJlZEV2ZW50AAAAAAAABAAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAACWZlZXNfbG9zcwAAAAAAAAoAAAAAAAAADnByaW5jaXBhbF9sb3NzAAAAAAAKAAAAAAAAAAp5aWVsZF9sb3NzAAAAAAAK",
        "AAAAAQAAARxUaGUgZXhwaXJhdGlvbiAobWF0dXJpdHkpIGRhdGUgb2YgYSBjcmVkaXQgaGFzIGJlZW4gZXh0ZW5kZWQuCiMgRmllbGRzOgoqIGBjcmVkaXRfaGFzaGAgLSBUaGUgaGFzaCBvZiB0aGUgY3JlZGl0LgoqIGBvbGRfcmVtYWluaW5nX3BlcmlvZHNgIC0gVGhlIG51bWJlciBvZiByZW1haW5pbmcgcGF5IHBlcmlvZHMgYmVmb3JlIHRoZSBleHRlbnNpb24uCiogYG5ld19yZW1haW5pbmdfcGVyaW9kc2AgLSBUaGUgbnVtYmVyIG9mIHJlbWFpbmluZyBwYXkgcGVyaW9kcyBhZnRlciB0aGUgZXh0ZW5zaW9uLgAAAAAAAAAdUmVtYWluaW5nUGVyaW9kc0V4dGVuZGVkRXZlbnQAAAAAAAADAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAAAAAAVbmV3X3JlbWFpbmluZ19wZXJpb2RzAAAAAAAABAAAAAAAAAAVb2xkX3JlbWFpbmluZ19wZXJpb2RzAAAAAAAABA==",
        "AAAAAQAAAN1UaGUgeWllbGQgb2YgYSBjcmVkaXQgaGFzIGJlZW4gdXBkYXRlZC4KIyBGaWVsZHM6CiogYGNyZWRpdF9oYXNoYCAtIFRoZSBjcmVkaXQgaGFzaC4KKiBgb2xkX3lpZWxkX2Jwc2AgLSBUaGUgb2xkIHlpZWxkIGluIGJhc2lzIHBvaW50cyBiZWZvcmUgdGhlIHVwZGF0ZS4KKiBgbmV3X3lpZWxkX2Jwc2AgLSBUaGUgbmV3IHlpZWxkIGluIGJhc2lzIHBvaW50cyBhZnRlciB0aGUgdXBkYXRlLgAAAAAAAAAAAAARWWllbGRVcGRhdGVkRXZlbnQAAAAAAAADAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAAAAAANbmV3X3lpZWxkX2JwcwAAAAAAAAQAAAAAAAAADW9sZF95aWVsZF9icHMAAAAAAAAE",
        "AAAAAQAAAXtUaGUgY3JlZGl0IGxpbWl0IGFuZCBjb21taXR0ZWQgYW1vdW50IG9mIGEgY3JlZGl0IGhhdmUgYmVlbiB1cGRhdGVkLgojIEZpZWxkczoKKiBgY3JlZGl0X2hhc2hgIC0gVGhlIGNyZWRpdCBoYXNoLgoqIGBvbGRfY3JlZGl0X2xpbWl0YCAtIFRoZSBvbGQgY3JlZGl0IGxpbWl0IGJlZm9yZSB0aGUgdXBkYXRlLgoqIGBuZXdfY3JlZGl0X2xpbWl0YCAtIFRoZSBuZXcgY3JlZGl0IGxpbWl0IGFmdGVyIHRoZSB1cGRhdGUuCiogYG9sZF9jb21taXR0ZWRfYW1vdW50YCAtIFRoZSBvbGQgY29tbWl0dGVkIGFtb3VudCBiZWZvcmUgdGhlIHVwZGF0ZS4KKiBgbmV3X2NvbW1pdHRlZF9hbW91bnRgIC0gVGhlIG5ldyBjb21taXR0ZWQgYW1vdW50IGFmdGVyIHRoZSB1cGRhdGUuAAAAAAAAAAAeTGltaXRBbmRDb21taXRtZW50VXBkYXRlZEV2ZW50AAAAAAAFAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIAAAAAAAAAAUbmV3X2NvbW1pdHRlZF9hbW91bnQAAAAKAAAAAAAAABBuZXdfY3JlZGl0X2xpbWl0AAAACgAAAAAAAAAUb2xkX2NvbW1pdHRlZF9hbW91bnQAAAAKAAAAAAAAABBvbGRfY3JlZGl0X2xpbWl0AAAACg==",
        "AAAAAQAAAOJQYXJ0IG9yIGFsbCBvZiB0aGUgbGF0ZSBmZWUgZHVlIG9mIGEgY3JlZGl0IGhhcyBiZWVuIHdhaXZlZC4KIyBGaWVsZHM6CiogYGNyZWRpdF9oYXNoYCAtIFRoZSBjcmVkaXQgaGFzaC4KKiBgb2xkX2xhdGVfZmVlYCAtIFRoZSBhbW91bnQgb2YgbGF0ZSBmZWUgYmVmb3JlIHRoZSB1cGRhdGUuCiogYG5ld19sYXRlX2ZlZWAgLSBUaGUgYW1vdW50IG9mIGxhdGUgZmVlIGFmdGVyIHRoZSB1cGRhdGUuAAAAAAAAAAAAEkxhdGVGZWVXYWl2ZWRFdmVudAAAAAAAAwAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADG5ld19sYXRlX2ZlZQAAAAoAAAAAAAAADG9sZF9sYXRlX2ZlZQAAAAo=",
        "AAAABAAAAAAAAAAAAAAAEkNyZWRpdE1hbmFnZXJFcnJvcgAAAAAADwAAAAAAAAAUQm9ycm93ZXJPckVBUmVxdWlyZWQAAAK9AAAAAAAAABRFQU9yU2VudGluZWxSZXF1aXJlZAAAAr4AAAAAAAAAC1plcm9QZXJpb2RzAAAAAr8AAAAAAAAAG0NyZWRpdE5vdEluU3RhdGVGb3JBcHByb3ZhbAAAAALAAAAAAAAAACFDb21taXR0ZWRBbW91bnRFeGNlZWRzQ3JlZGl0TGltaXQAAAAAAALBAAAAAAAAADZDcmVkaXRXaXRob3V0Q29tbWl0bWVudFNob3VsZEhhdmVOb0Rlc2lnbmF0ZWRTdGFydERhdGUAAAAAAsIAAAAAAAAAHERlc2lnbmF0ZWRTdGFydERhdGVJblRoZVBhc3QAAALDAAAAAAAAADFQYXlQZXJpb2RzVG9vTG93Rm9yQ3JlZGl0c1dpdGhEZXNpZ25hdGVkU3RhcnREYXRlAAAAAAACxAAAAAAAAAAeQ29tbWl0dGVkQ3JlZGl0Q2Fubm90QmVTdGFydGVkAAAAAALFAAAAAAAAABJDcmVkaXRMaW1pdFRvb0hpZ2gAAAAAAsYAAAAAAAAAHkRlZmF1bHRIYXNBbHJlYWR5QmVlblRyaWdnZXJlZAAAAAACxwAAAAAAAAAYRGVmYXVsdFRyaWdnZXJlZFRvb0Vhcmx5AAACyAAAAAAAAAAZQ3JlZGl0Tm90SW5TdGF0ZUZvclVwZGF0ZQAAAAAAAskAAAAAAAAAG0NyZWRpdEhhc091dHN0YW5kaW5nQmFsYW5jZQAAAALKAAAAAAAAAB5DcmVkaXRIYXNVbmZ1bGZpbGxlZENvbW1pdG1lbnQAAAAAAss=",
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
    set_storage_contract_addrs: this.txFromJSON<null>,
    approve_borrower: this.txFromJSON<null>,
    start_committed_credit: this.txFromJSON<null>,
    refresh_credit: this.txFromJSON<null>,
    is_default_ready: this.txFromJSON<boolean>,
    trigger_default: this.txFromJSON<readonly [u128, u128, u128]>,
    update_yield: this.txFromJSON<null>,
    extend_remaining_period: this.txFromJSON<null>,
    update_limit_and_commitment: this.txFromJSON<null>,
    waive_late_fee: this.txFromJSON<u128>,
    close_credit: this.txFromJSON<null>,
    upgrade: this.txFromJSON<null>,
  };
}
