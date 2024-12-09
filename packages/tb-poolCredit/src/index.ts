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
    contractId: "CANCNGJEAAN4GS6WVI3OAFWD2IAJW6WMI7TOD4UHC623QTDMD3LVTN3G",
  },
} as const;

export interface CreditAddressesChangedEvent {
  credit_storage: string;
  pool: string;
  pool_storage: string;
}

export type ClientDataKey =
  | { tag: "Pool"; values: void }
  | { tag: "PoolStorage"; values: void }
  | { tag: "CreditStorage"; values: void };

export interface DrawdownMadeEvent {
  borrow_amount: u128;
  borrower: string;
  net_amount_to_borrower: u128;
}

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

export interface PrincipalPaymentMadeEvent {
  amount: u128;
  borrower: string;
  next_due_date: u64;
  principal_due: u128;
  principal_due_paid: u128;
  unbilled_principal: u128;
  unbilled_principal_paid: u128;
}

export interface CreditClosedAfterPayOffEvent {
  credit_hash: Buffer;
}

export const Errors = {
  601: { message: "BorrowerOrSentinelRequired" },

  602: { message: "AttemptedDrawdownOnNonRevolvingCredit" },

  603: { message: "CreditLimitExceeded" },

  604: { message: "DrawdownNotAllowedInFinalPeriodAndBeyond" },

  605: { message: "InsufficientPoolBalanceForDrawdown" },

  606: { message: "FirstDrawdownTooEarly" },

  607: { message: "CreditNotInStateForDrawdown" },

  608: { message: "DrawdownNotAllowedAfterDueDateWithUnpaidDue" },

  609: { message: "CreditNotInStateForMakingPayment" },

  610: { message: "CreditNotInStateForMakingPrincipalPayment" },

  801: { message: "StartDateLaterThanEndDate" },

  1: { message: "AlreadyInitialized" },

  2: { message: "ProtocolIsPausedOrPoolIsNotOn" },

  3: { message: "PoolOwnerOrHumaOwnerRequired" },

  4: { message: "PoolOperatorRequired" },

  5: { message: "AuthorizedContractCallerRequired" },

  6: { message: "UnsupportedFunction" },

  7: { message: "ZeroAmountProvided" },

  221: { message: "BorrowAmountLessThanPlatformFees" },
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
  ) => Promise<AssembledTransaction<u128>>;

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
   * Construct and simulate a get_amt_available_for_drawdown transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_amt_available_for_drawdown: (
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
  ) => Promise<AssembledTransaction<u128>>;
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAQAAAAAAAAAAAAAAG0NyZWRpdEFkZHJlc3Nlc0NoYW5nZWRFdmVudAAAAAADAAAAAAAAAA5jcmVkaXRfc3RvcmFnZQAAAAAAEwAAAAAAAAAEcG9vbAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABM=",
        "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAADAAAAAAAAAAAAAAAEUG9vbAAAAAAAAAAAAAAAC1Bvb2xTdG9yYWdlAAAAAAAAAAAAAAAADUNyZWRpdFN0b3JhZ2UAAAA=",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAEcG9vbAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABMAAAAAAAAADmNyZWRpdF9zdG9yYWdlAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAASc2V0X2NvbnRyYWN0X2FkZHJzAAAAAAAEAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABMAAAAAAAAABHBvb2wAAAATAAAAAAAAAA5jcmVkaXRfc3RvcmFnZQAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAIZHJhd2Rvd24AAAACAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACgAAAAEAAAAK",
        "AAAAAAAAAAAAAAAMbWFrZV9wYXltZW50AAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACgAAAAEAAAPtAAAAAgAAAAoAAAAB",
        "AAAAAAAAAAAAAAAWbWFrZV9wcmluY2lwYWxfcGF5bWVudAAAAAAAAgAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAAZhbW91bnQAAAAAAAoAAAABAAAD7QAAAAIAAAAKAAAAAQ==",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAMZ2V0X2R1ZV9pbmZvAAAAAQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAQAAA+0AAAACAAAH0AAAAAxDcmVkaXRSZWNvcmQAAAfQAAAACUR1ZURldGFpbAAAAA==",
        "AAAAAAAAAAAAAAAaZ2V0X25leHRfYmlsbF9yZWZyZXNoX2RhdGUAAAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAEAAAAG",
        "AAAAAAAAAAAAAAAeZ2V0X2FtdF9hdmFpbGFibGVfZm9yX2RyYXdkb3duAAAAAAABAAAAAAAAAAhib3Jyb3dlcgAAABMAAAABAAAACg==",
        "AAAAAQAAAAAAAAAAAAAAEURyYXdkb3duTWFkZUV2ZW50AAAAAAAAAwAAAAAAAAANYm9ycm93X2Ftb3VudAAAAAAAAAoAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAWbmV0X2Ftb3VudF90b19ib3Jyb3dlcgAAAAAACg==",
        "AAAAAQAAAAAAAAAAAAAAEFBheW1lbnRNYWRlRXZlbnQAAAALAAAAAAAAAAZhbW91bnQAAAAAAAoAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAANbGF0ZV9mZWVfcGFpZAAAAAAAAAoAAAAAAAAADW5leHRfZHVlX2RhdGUAAAAAAAAGAAAAAAAAAA1wcmluY2lwYWxfZHVlAAAAAAAACgAAAAAAAAAScHJpbmNpcGFsX2R1ZV9wYWlkAAAAAAAKAAAAAAAAABdwcmluY2lwYWxfcGFzdF9kdWVfcGFpZAAAAAAKAAAAAAAAABd1bmJpbGxlZF9wcmluY2lwYWxfcGFpZAAAAAAKAAAAAAAAAAl5aWVsZF9kdWUAAAAAAAAKAAAAAAAAAA55aWVsZF9kdWVfcGFpZAAAAAAACgAAAAAAAAATeWllbGRfcGFzdF9kdWVfcGFpZAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAAGVByaW5jaXBhbFBheW1lbnRNYWRlRXZlbnQAAAAAAAAHAAAAAAAAAAZhbW91bnQAAAAAAAoAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAANbmV4dF9kdWVfZGF0ZQAAAAAAAAYAAAAAAAAADXByaW5jaXBhbF9kdWUAAAAAAAAKAAAAAAAAABJwcmluY2lwYWxfZHVlX3BhaWQAAAAAAAoAAAAAAAAAEnVuYmlsbGVkX3ByaW5jaXBhbAAAAAAACgAAAAAAAAAXdW5iaWxsZWRfcHJpbmNpcGFsX3BhaWQAAAAACg==",
        "AAAAAQAAAAAAAAAAAAAAHENyZWRpdENsb3NlZEFmdGVyUGF5T2ZmRXZlbnQAAAABAAAAAAAAAAtjcmVkaXRfaGFzaAAAAAPuAAAAIA==",
        "AAAABAAAAAAAAAAAAAAAC0NyZWRpdEVycm9yAAAAAAoAAAAAAAAAGkJvcnJvd2VyT3JTZW50aW5lbFJlcXVpcmVkAAAAAAJZAAAAAAAAACVBdHRlbXB0ZWREcmF3ZG93bk9uTm9uUmV2b2x2aW5nQ3JlZGl0AAAAAAACWgAAAAAAAAATQ3JlZGl0TGltaXRFeGNlZWRlZAAAAAJbAAAAAAAAAChEcmF3ZG93bk5vdEFsbG93ZWRJbkZpbmFsUGVyaW9kQW5kQmV5b25kAAACXAAAAAAAAAAiSW5zdWZmaWNpZW50UG9vbEJhbGFuY2VGb3JEcmF3ZG93bgAAAAACXQAAAAAAAAAVRmlyc3REcmF3ZG93blRvb0Vhcmx5AAAAAAACXgAAAAAAAAAbQ3JlZGl0Tm90SW5TdGF0ZUZvckRyYXdkb3duAAAAAl8AAAAAAAAAK0RyYXdkb3duTm90QWxsb3dlZEFmdGVyRHVlRGF0ZVdpdGhVbnBhaWREdWUAAAACYAAAAAAAAAAgQ3JlZGl0Tm90SW5TdGF0ZUZvck1ha2luZ1BheW1lbnQAAAJhAAAAAAAAAClDcmVkaXROb3RJblN0YXRlRm9yTWFraW5nUHJpbmNpcGFsUGF5bWVudAAAAAAAAmI=",
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
    drawdown: this.txFromJSON<u128>,
    make_payment: this.txFromJSON<readonly [u128, boolean]>,
    make_principal_payment: this.txFromJSON<readonly [u128, boolean]>,
    upgrade: this.txFromJSON<null>,
    get_due_info: this.txFromJSON<readonly [CreditRecord, DueDetail]>,
    get_next_bill_refresh_date: this.txFromJSON<u64>,
    get_amt_available_for_drawdown: this.txFromJSON<u128>,
  };
}
