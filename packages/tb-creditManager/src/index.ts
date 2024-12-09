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
  unknown: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: "CD7FKCTK2Z3KX7RZEEKD632RIR7J65KALICV6G7W4UPRMF65RNXAT5AM",
  },
} as const;

export interface CreditManagerAddressesChangedEvent {
  credit_storage: string;
  pool: string;
  pool_storage: string;
}

export interface CreditStorageAddressesChangedEvent {
  credit: string;
  credit_manager: string;
}

export type ClientDataKey =
  | { tag: "Pool"; values: void }
  | { tag: "PoolStorage"; values: void }
  | { tag: "CreditStorage"; values: void };

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

export interface CommittedCreditStartedEvent {
  credit_hash: Buffer;
}

export interface CreditClosedByAdminEvent {
  credit_hash: Buffer;
}

export interface DefaultTriggeredEvent {
  credit_hash: Buffer;
  fees_loss: u128;
  principal_loss: u128;
  yield_loss: u128;
}

export interface RemainingPeriodsExtendedEvent {
  credit_hash: Buffer;
  new_remaining_periods: u32;
  old_remaining_periods: u32;
}

export interface YieldUpdatedEvent {
  credit_hash: Buffer;
  new_yield_bps: u32;
  old_yield_bps: u32;
}

export interface LimitAndCommitmentUpdatedEvent {
  credit_hash: Buffer;
  new_committed_amount: u128;
  new_credit_limit: u128;
  old_committed_amount: u128;
  old_credit_limit: u128;
}

export interface LateFeeWaivedEvent {
  credit_hash: Buffer;
  new_late_fee: u128;
  old_late_fee: u128;
}

export const Errors = {
  701: { message: "BorrowerOrEARequired" },

  702: { message: "EAOrSentinelRequired" },

  703: { message: "ZeroPayPeriodsProvided" },

  704: { message: "CreditNotInStateForApproval" },

  705: { message: "CommittedAmountExceedsCreditLimit" },

  706: { message: "CreditWithoutCommitmentShouldHaveNoDesignatedStartDate" },

  707: { message: "DesignatedStartDateInThePast" },

  708: { message: "PayPeriodsTooLowForCreditsWithDesignatedStartDate" },

  709: { message: "CommittedCreditCannotBeStarted" },

  710: { message: "CreditLimitTooHigh" },

  711: { message: "DefaultHasAlreadyBeenTriggered" },

  712: { message: "DefaultTriggeredTooEarly" },

  713: { message: "CreditNotInStateForUpdate" },

  714: { message: "CreditHasOutstandingBalance" },

  715: { message: "CreditHasUnfulfilledCommitment" },

  221: { message: "BorrowAmountLessThanPlatformFees" },

  801: { message: "StartDateLaterThanEndDate" },

  1: { message: "AlreadyInitialized" },

  2: { message: "ProtocolIsPausedOrPoolIsNotOn" },

  3: { message: "PoolOwnerOrHumaOwnerRequired" },

  4: { message: "PoolOperatorRequired" },

  5: { message: "AuthorizedContractCallerRequired" },

  6: { message: "UnsupportedFunction" },

  7: { message: "ZeroAmountProvided" },
};

export type PayPeriodDuration =
  | { tag: "Monthly"; values: void }
  | { tag: "Quarterly"; values: void }
  | { tag: "SemiAnnually"; values: void };

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
  auto_redemption_after_lockup: boolean;
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
      caller,
      pool_storage,
      pool,
      credit_storage,
    }: {
      caller: string;
      pool_storage: string;
      pool: string;
      credit_storage: string;
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
   * Construct and simulate a set_storage_contract_addrs transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_storage_contract_addrs: (
    {
      caller,
      credit,
      credit_manager,
    }: { caller: string; credit: string; credit_manager: string },
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
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAQAAAAAAAAAAAAAAIkNyZWRpdE1hbmFnZXJBZGRyZXNzZXNDaGFuZ2VkRXZlbnQAAAAAAAMAAAAAAAAADmNyZWRpdF9zdG9yYWdlAAAAAAATAAAAAAAAAARwb29sAAAAEwAAAAAAAAAMcG9vbF9zdG9yYWdlAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAIkNyZWRpdFN0b3JhZ2VBZGRyZXNzZXNDaGFuZ2VkRXZlbnQAAAAAAAIAAAAAAAAABmNyZWRpdAAAAAAAEwAAAAAAAAAOY3JlZGl0X21hbmFnZXIAAAAAABM=",
        "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAADAAAAAAAAAAAAAAAEUG9vbAAAAAAAAAAAAAAAC1Bvb2xTdG9yYWdlAAAAAAAAAAAAAAAADUNyZWRpdFN0b3JhZ2UAAAA=",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAEcG9vbAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABMAAAAAAAAADmNyZWRpdF9zdG9yYWdlAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAASc2V0X2NvbnRyYWN0X2FkZHJzAAAAAAAEAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABMAAAAAAAAABHBvb2wAAAATAAAAAAAAAA5jcmVkaXRfc3RvcmFnZQAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAac2V0X3N0b3JhZ2VfY29udHJhY3RfYWRkcnMAAAAAAAMAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAGY3JlZGl0AAAAAAATAAAAAAAAAA5jcmVkaXRfbWFuYWdlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAQYXBwcm92ZV9ib3Jyb3dlcgAAAAcAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAMY3JlZGl0X2xpbWl0AAAACgAAAAAAAAALbnVtX3BlcmlvZHMAAAAABAAAAAAAAAAJeWllbGRfYnBzAAAAAAAABAAAAAAAAAAQY29tbWl0dGVkX2Ftb3VudAAAAAoAAAAAAAAAFWRlc2lnbmF0ZWRfc3RhcnRfZGF0ZQAAAAAAAAYAAAAAAAAACXJldm9sdmluZwAAAAAAAAEAAAAA",
        "AAAAAAAAAAAAAAAWc3RhcnRfY29tbWl0dGVkX2NyZWRpdAAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAOcmVmcmVzaF9jcmVkaXQAAAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAPdHJpZ2dlcl9kZWZhdWx0AAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAPtAAAAAwAAAAoAAAAKAAAACg==",
        "AAAAAAAAAAAAAAAMdXBkYXRlX3lpZWxkAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAA1uZXdfeWllbGRfYnBzAAAAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAXZXh0ZW5kX3JlbWFpbmluZ19wZXJpb2QAAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAA5udW1fb2ZfcGVyaW9kcwAAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAbdXBkYXRlX2xpbWl0X2FuZF9jb21taXRtZW50AAAAAAMAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAQbmV3X2NyZWRpdF9saW1pdAAAAAoAAAAAAAAAFG5ld19jb21taXR0ZWRfYW1vdW50AAAACgAAAAA=",
        "AAAAAAAAAAAAAAAOd2FpdmVfbGF0ZV9mZWUAAAAAAAIAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAQAAAAo=",
        "AAAAAAAAAAAAAAAMY2xvc2VfY3JlZGl0AAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAQaXNfZGVmYXVsdF9yZWFkeQAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAAB",
        "AAAAAQAAAAAAAAAAAAAAE0NyZWRpdEFwcHJvdmVkRXZlbnQAAAAACQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAABBjb21taXR0ZWRfYW1vdW50AAAACgAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADGNyZWRpdF9saW1pdAAAAAoAAAAAAAAAFWRlc2lnbmF0ZWRfc3RhcnRfZGF0ZQAAAAAAAAYAAAAAAAAAD3BlcmlvZF9kdXJhdGlvbgAAAAfQAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAAAAABFyZW1haW5pbmdfcGVyaW9kcwAAAAAAAAQAAAAAAAAACXJldm9sdmluZwAAAAAAAAEAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAG0NvbW1pdHRlZENyZWRpdFN0YXJ0ZWRFdmVudAAAAAABAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIA==",
        "AAAAAQAAAAAAAAAAAAAAGENyZWRpdENsb3NlZEJ5QWRtaW5FdmVudAAAAAEAAAAAAAAAC2NyZWRpdF9oYXNoAAAAA+4AAAAg",
        "AAAAAQAAAAAAAAAAAAAAFURlZmF1bHRUcmlnZ2VyZWRFdmVudAAAAAAAAAQAAAAAAAAAC2NyZWRpdF9oYXNoAAAAA+4AAAAgAAAAAAAAAAlmZWVzX2xvc3MAAAAAAAAKAAAAAAAAAA5wcmluY2lwYWxfbG9zcwAAAAAACgAAAAAAAAAKeWllbGRfbG9zcwAAAAAACg==",
        "AAAAAQAAAAAAAAAAAAAAHVJlbWFpbmluZ1BlcmlvZHNFeHRlbmRlZEV2ZW50AAAAAAAAAwAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAAFW5ld19yZW1haW5pbmdfcGVyaW9kcwAAAAAAAAQAAAAAAAAAFW9sZF9yZW1haW5pbmdfcGVyaW9kcwAAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAEVlpZWxkVXBkYXRlZEV2ZW50AAAAAAAAAwAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADW5ld195aWVsZF9icHMAAAAAAAAEAAAAAAAAAA1vbGRfeWllbGRfYnBzAAAAAAAABA==",
        "AAAAAQAAAAAAAAAAAAAAHkxpbWl0QW5kQ29tbWl0bWVudFVwZGF0ZWRFdmVudAAAAAAABQAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAAFG5ld19jb21taXR0ZWRfYW1vdW50AAAACgAAAAAAAAAQbmV3X2NyZWRpdF9saW1pdAAAAAoAAAAAAAAAFG9sZF9jb21taXR0ZWRfYW1vdW50AAAACgAAAAAAAAAQb2xkX2NyZWRpdF9saW1pdAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAAEkxhdGVGZWVXYWl2ZWRFdmVudAAAAAAAAwAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADG5ld19sYXRlX2ZlZQAAAAoAAAAAAAAADG9sZF9sYXRlX2ZlZQAAAAo=",
        "AAAABAAAAAAAAAAAAAAAEkNyZWRpdE1hbmFnZXJFcnJvcgAAAAAADwAAAAAAAAAUQm9ycm93ZXJPckVBUmVxdWlyZWQAAAK9AAAAAAAAABRFQU9yU2VudGluZWxSZXF1aXJlZAAAAr4AAAAAAAAAFlplcm9QYXlQZXJpb2RzUHJvdmlkZWQAAAAAAr8AAAAAAAAAG0NyZWRpdE5vdEluU3RhdGVGb3JBcHByb3ZhbAAAAALAAAAAAAAAACFDb21taXR0ZWRBbW91bnRFeGNlZWRzQ3JlZGl0TGltaXQAAAAAAALBAAAAAAAAADZDcmVkaXRXaXRob3V0Q29tbWl0bWVudFNob3VsZEhhdmVOb0Rlc2lnbmF0ZWRTdGFydERhdGUAAAAAAsIAAAAAAAAAHERlc2lnbmF0ZWRTdGFydERhdGVJblRoZVBhc3QAAALDAAAAAAAAADFQYXlQZXJpb2RzVG9vTG93Rm9yQ3JlZGl0c1dpdGhEZXNpZ25hdGVkU3RhcnREYXRlAAAAAAACxAAAAAAAAAAeQ29tbWl0dGVkQ3JlZGl0Q2Fubm90QmVTdGFydGVkAAAAAALFAAAAAAAAABJDcmVkaXRMaW1pdFRvb0hpZ2gAAAAAAsYAAAAAAAAAHkRlZmF1bHRIYXNBbHJlYWR5QmVlblRyaWdnZXJlZAAAAAACxwAAAAAAAAAYRGVmYXVsdFRyaWdnZXJlZFRvb0Vhcmx5AAACyAAAAAAAAAAZQ3JlZGl0Tm90SW5TdGF0ZUZvclVwZGF0ZQAAAAAAAskAAAAAAAAAG0NyZWRpdEhhc091dHN0YW5kaW5nQmFsYW5jZQAAAALKAAAAAAAAAB5DcmVkaXRIYXNVbmZ1bGZpbGxlZENvbW1pdG1lbnQAAAAAAss=",
        "AAAAAgAAAAAAAAAAAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAwAAAAAAAAAAAAAAB01vbnRobHkAAAAAAAAAAAAAAAAJUXVhcnRlcmx5AAAAAAAAAAAAAAAAAAAMU2VtaUFubnVhbGx5",
        "AAAABAAAAAAAAAAAAAAADUNhbGVuZGFyRXJyb3IAAAAAAAABAAAAAAAAABlTdGFydERhdGVMYXRlclRoYW5FbmREYXRlAAAAAAADIQ==",
        "AAAABAAAAAAAAAAAAAAAC0NvbW1vbkVycm9yAAAAAAcAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAdUHJvdG9jb2xJc1BhdXNlZE9yUG9vbElzTm90T24AAAAAAAACAAAAAAAAABxQb29sT3duZXJPckh1bWFPd25lclJlcXVpcmVkAAAAAwAAAAAAAAAUUG9vbE9wZXJhdG9yUmVxdWlyZWQAAAAEAAAAAAAAACBBdXRob3JpemVkQ29udHJhY3RDYWxsZXJSZXF1aXJlZAAAAAUAAAAAAAAAE1Vuc3VwcG9ydGVkRnVuY3Rpb24AAAAABgAAAAAAAAASWmVyb0Ftb3VudFByb3ZpZGVkAAAAAAAH",
        "AAAAAQAAAAAAAAAAAAAAEkJpbGxSZWZyZXNoZWRFdmVudAAAAAAABAAAAAAAAAALY3JlZGl0X2hhc2gAAAAD7gAAACAAAAAAAAAADG5ld19kdWVfZGF0ZQAAAAYAAAAAAAAACG5leHRfZHVlAAAACgAAAAAAAAAOdG90YWxfcGFzdF9kdWUAAAAAAAo=",
        "AAAAAgAAAAAAAAAAAAAAC0NyZWRpdFN0YXRlAAAAAAUAAAAAAAAAAAAAAAdEZWxldGVkAAAAAAAAAAAAAAAACEFwcHJvdmVkAAAAAAAAAAAAAAAMR29vZFN0YW5kaW5nAAAAAAAAAAAAAAAHRGVsYXllZAAAAAAAAAAAAAAAAAlEZWZhdWx0ZWQAAAA=",
        "AAAAAQAAAAAAAAAAAAAADENyZWRpdENvbmZpZwAAAAYAAAAAAAAAEGNvbW1pdHRlZF9hbW91bnQAAAAKAAAAAAAAAAxjcmVkaXRfbGltaXQAAAAKAAAAAAAAAAtudW1fcGVyaW9kcwAAAAAEAAAAAAAAABNwYXlfcGVyaW9kX2R1cmF0aW9uAAAAB9AAAAARUGF5UGVyaW9kRHVyYXRpb24AAAAAAAAAAAAACXJldm9sdmluZwAAAAAAAAEAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAADENyZWRpdFJlY29yZAAAAAgAAAAAAAAADm1pc3NlZF9wZXJpb2RzAAAAAAAEAAAAAAAAAAhuZXh0X2R1ZQAAAAoAAAAAAAAADW5leHRfZHVlX2RhdGUAAAAAAAAGAAAAAAAAABFyZW1haW5pbmdfcGVyaW9kcwAAAAAAAAQAAAAAAAAABXN0YXRlAAAAAAAH0AAAAAtDcmVkaXRTdGF0ZQAAAAAAAAAADnRvdGFsX3Bhc3RfZHVlAAAAAAAKAAAAAAAAABJ1bmJpbGxlZF9wcmluY2lwYWwAAAAAAAoAAAAAAAAACXlpZWxkX2R1ZQAAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAACUR1ZURldGFpbAAAAAAAAAcAAAAAAAAAB2FjY3J1ZWQAAAAACgAAAAAAAAAJY29tbWl0dGVkAAAAAAAACgAAAAAAAAAIbGF0ZV9mZWUAAAAKAAAAAAAAABVsYXRlX2ZlZV91cGRhdGVkX2RhdGUAAAAAAAAGAAAAAAAAAARwYWlkAAAACgAAAAAAAAAScHJpbmNpcGFsX3Bhc3RfZHVlAAAAAAAKAAAAAAAAAA55aWVsZF9wYXN0X2R1ZQAAAAAACg==",
        "AAAABAAAAAAAAAAAAAAAD0R1ZU1hbmFnZXJFcnJvcgAAAAABAAAAAAAAACBCb3Jyb3dBbW91bnRMZXNzVGhhblBsYXRmb3JtRmVlcwAAAN0=",
        "AAAAAgAAAAAAAAAAAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAgAAAAAAAAAAAAAAEEZpeGVkU2VuaW9yWWllbGQAAAAAAAAAAAAAAAxSaXNrQWRqdXN0ZWQ=",
        "AAAAAQAAAAAAAAAAAAAADFBvb2xTZXR0aW5ncwAAAAYAAAAAAAAAGWRlZmF1bHRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAAEAAAAAAAAAB5sYXRlX3BheW1lbnRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAACExQQ29uZmlnAAAABgAAAAAAAAAcYXV0b19yZWRlbXB0aW9uX2FmdGVyX2xvY2t1cAAAAAEAAAAAAAAAFmZpeGVkX3Nlbmlvcl95aWVsZF9icHMAAAAAAAQAAAAAAAAADWxpcXVpZGl0eV9jYXAAAAAAAAAKAAAAAAAAABdtYXhfc2VuaW9yX2p1bmlvcl9yYXRpbwAAAAAEAAAAAAAAABx0cmFuY2hlc19yaXNrX2FkanVzdG1lbnRfYnBzAAAABAAAAAAAAAAed2l0aGRyYXdhbF9sb2Nrb3V0X3BlcmlvZF9kYXlzAAAAAAAE",
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
    trigger_default: this.txFromJSON<readonly [u128, u128, u128]>,
    update_yield: this.txFromJSON<null>,
    extend_remaining_period: this.txFromJSON<null>,
    update_limit_and_commitment: this.txFromJSON<null>,
    waive_late_fee: this.txFromJSON<u128>,
    close_credit: this.txFromJSON<null>,
    upgrade: this.txFromJSON<null>,
    is_default_ready: this.txFromJSON<boolean>,
  };
}
