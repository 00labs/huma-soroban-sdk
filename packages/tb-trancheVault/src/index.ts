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
    contractId: "CCHQ5HEKNHCH3LUQ3B73VJRDHNSKOUL567VB3HMOJ7M7BI4QVZ7WCQCL",
  },
} as const;

export interface TrancheVaultAddressesChangedEvent {
  pool_manager: string;
  pool_storage: string;
}

export type ClientDataKey =
  | { tag: "PoolManager"; values: void }
  | { tag: "PoolStorage"; values: void };

export const Errors = {
  401: { message: "LenderRequired" },

  402: { message: "AuthorizedInitialDepositorRequired" },

  403: { message: "PreviousAssetsNotWithdrawn" },

  404: { message: "DepositAmountTooLow" },

  405: { message: "TrancheLiquidityCapExceeded" },

  406: { message: "ZeroSharesMinted" },

  407: { message: "InsufficientSharesForRequest" },

  408: { message: "WithdrawTooEarly" },

  409: { message: "PoolIsNotClosed" },

  410: { message: "InvalidTrancheIndex" },

  411: { message: "LenderOrSentinelRequired" },

  412: { message: "RedemptionCancellationDisabled" },

  801: { message: "StartDateLaterThanEndDate" },

  1: { message: "AlreadyInitialized" },

  2: { message: "ProtocolIsPausedOrPoolIsNotOn" },

  3: { message: "PoolOwnerOrHumaOwnerRequired" },

  4: { message: "PoolOperatorRequired" },

  5: { message: "AuthorizedContractCallerRequired" },

  6: { message: "UnsupportedFunction" },

  7: { message: "ZeroAmountProvided" },
};
export type TrancheTokenDataKey =
  | { tag: "Balance"; values: readonly [string] }
  | { tag: "TotalSupply"; values: void };

export interface EpochProcessedEvent {
  amount_processed: u128;
  epoch_id: u64;
  shares_processed: u128;
  shares_requested: u128;
}

export interface LenderAddedEvent {
  account: string;
}

export interface LenderRemovedEvent {
  account: string;
}

export interface LiquidityDepositedEvent {
  assets: u128;
  sender: string;
  shares: u128;
}

export interface LenderFundDisbursedEvent {
  account: string;
  amount_disbursed: u128;
}

export interface LenderFundWithdrawnEvent {
  account: string;
  assets: u128;
  shares: u128;
}

export interface RedemptionRequestAddedEvent {
  account: string;
  epoch_id: u64;
  shares: u128;
}

export interface RedemptionRequestCanceledEvent {
  account: string;
  epoch_id: u64;
  shares: u128;
}

export type TrancheVaultDataKey =
  | { tag: "TrancheIndex"; values: void }
  | { tag: "ApprovedLender"; values: readonly [string] }
  | { tag: "DepositRecord"; values: readonly [string] }
  | { tag: "LenderRedemptionRecord"; values: readonly [string] }
  | { tag: "EpochRedemptionSummary"; values: readonly [u64] };

export interface DepositRecord {
  last_deposit_time: u64;
  principal: u128;
}

export interface LenderRedemptionRecord {
  next_epoch_id_to_process: u64;
  num_shares_requested: u128;
  principal_requested: u128;
  total_amount_processed: u128;
  total_amount_withdrawn: u128;
}

export type PayPeriodDuration =
  | { tag: "Monthly"; values: void }
  | { tag: "Quarterly"; values: void }
  | { tag: "SemiAnnually"; values: void };

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

export interface TokenMetadata {
  decimal: u32;
  name: string;
  symbol: string;
}

export interface EpochRedemptionSummary {
  epoch_id: u64;
  total_amount_processed: u128;
  total_shares_processed: u128;
  total_shares_requested: u128;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    {
      decimals,
      name,
      symbol,
      pool_storage,
      pool_manager,
      index,
    }: {
      decimals: u32;
      name: string;
      symbol: string;
      pool_storage: string;
      pool_manager: string;
      index: u32;
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
      caller,
      pool_storage,
      pool_manager,
    }: { caller: string; pool_storage: string; pool_manager: string },
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
   * Construct and simulate a add_approved_lender transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_approved_lender: (
    { caller, lender }: { caller: string; lender: string },
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
   * Construct and simulate a remove_approved_lender transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_approved_lender: (
    { caller, lender }: { caller: string; lender: string },
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
   * Construct and simulate a make_initial_deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  make_initial_deposit: (
    { caller, assets }: { caller: string; assets: u128 },
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
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: (
    { lender, assets }: { lender: string; assets: u128 },
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
   * Construct and simulate a add_redemption_request transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_redemption_request: (
    {
      caller,
      lender,
      shares,
    }: { caller: string; lender: string; shares: u128 },
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
   * Construct and simulate a cancel_redemption_request transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  cancel_redemption_request: (
    { lender, shares }: { lender: string; shares: u128 },
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
   * Construct and simulate a disburse transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  disburse: (
    { lender }: { lender: string },
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
   * Construct and simulate a withdraw_after_pool_closure transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_after_pool_closure: (
    { lender }: { lender: string },
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
   * Construct and simulate a execute_redemption_summary transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  execute_redemption_summary: (
    { summary }: { summary: EpochRedemptionSummary },
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
   * Construct and simulate a get_latest_redemption_record transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_latest_redemption_record: (
    { lender }: { lender: string },
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
  ) => Promise<AssembledTransaction<LenderRedemptionRecord>>;

  /**
   * Construct and simulate a get_epoch_redemption_summary transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_epoch_redemption_summary: (
    { epoch_id }: { epoch_id: u64 },
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
  ) => Promise<AssembledTransaction<EpochRedemptionSummary>>;

  /**
   * Construct and simulate a get_redemption_record transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_redemption_record: (
    { account }: { account: string },
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
  ) => Promise<AssembledTransaction<LenderRedemptionRecord>>;

  /**
   * Construct and simulate a total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_supply: (options?: {
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
  }) => Promise<AssembledTransaction<u128>>;

  /**
   * Construct and simulate a total_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_assets: (options?: {
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
  }) => Promise<AssembledTransaction<u128>>;

  /**
   * Construct and simulate a total_assets_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_assets_of: (
    { account }: { account: string },
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
   * Construct and simulate a convert_to_shares transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  convert_to_shares: (
    { assets }: { assets: u128 },
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
   * Construct and simulate a convert_to_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  convert_to_assets: (
    { shares }: { shares: u128 },
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
   * Construct and simulate a is_approved_lender transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_approved_lender: (
    { account }: { account: string },
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
   * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve: (
    {
      _from,
      _spender,
      _amount,
      _expiration_ledger,
    }: {
      _from: string;
      _spender: string;
      _amount: i128;
      _expiration_ledger: u32;
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
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer: (
    { _from, _to, _amount }: { _from: string; _to: string; _amount: i128 },
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
   * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_from: (
    {
      _spender,
      _from,
      _to,
      _amount,
    }: { _spender: string; _from: string; _to: string; _amount: i128 },
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
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn: (
    { _from, _amount }: { _from: string; _amount: i128 },
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
   * Construct and simulate a burn_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn_from: (
    {
      _spender,
      _from,
      _amount,
    }: { _spender: string; _from: string; _amount: i128 },
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
   * Construct and simulate a allowance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  allowance: (
    { _from, _spender }: { _from: string; _spender: string },
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
  ) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: (
    { id }: { id: string },
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
  ) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  decimals: (options?: {
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
  }) => Promise<AssembledTransaction<u32>>;

  /**
   * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  name: (options?: {
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
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  symbol: (options?: {
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
  }) => Promise<AssembledTransaction<string>>;
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAQAAAAAAAAAAAAAAIVRyYW5jaGVWYXVsdEFkZHJlc3Nlc0NoYW5nZWRFdmVudAAAAAAAAAIAAAAAAAAADHBvb2xfbWFuYWdlcgAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABM=",
        "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAACAAAAAAAAAAAAAAALUG9vbE1hbmFnZXIAAAAAAAAAAAAAAAALUG9vbFN0b3JhZ2UA",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABgAAAAAAAAAIZGVjaW1hbHMAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQAAAAAAAAAAxwb29sX3N0b3JhZ2UAAAATAAAAAAAAAAxwb29sX21hbmFnZXIAAAATAAAAAAAAAAVpbmRleAAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAASc2V0X2NvbnRyYWN0X2FkZHJzAAAAAAADAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABMAAAAAAAAADHBvb2xfbWFuYWdlcgAAABMAAAAA",
        "AAAAAAAAAAAAAAATYWRkX2FwcHJvdmVkX2xlbmRlcgAAAAACAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAWcmVtb3ZlX2FwcHJvdmVkX2xlbmRlcgAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAZsZW5kZXIAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAUbWFrZV9pbml0aWFsX2RlcG9zaXQAAAACAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABmFzc2V0cwAAAAAACgAAAAEAAAAK",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAACAAAAAAAAAAZsZW5kZXIAAAAAABMAAAAAAAAABmFzc2V0cwAAAAAACgAAAAEAAAAK",
        "AAAAAAAAAAAAAAAWYWRkX3JlZGVtcHRpb25fcmVxdWVzdAAAAAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAZsZW5kZXIAAAAAABMAAAAAAAAABnNoYXJlcwAAAAAACgAAAAA=",
        "AAAAAAAAAAAAAAAZY2FuY2VsX3JlZGVtcHRpb25fcmVxdWVzdAAAAAAAAAIAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAAAAAAGc2hhcmVzAAAAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAAIZGlzYnVyc2UAAAABAAAAAAAAAAZsZW5kZXIAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAbd2l0aGRyYXdfYWZ0ZXJfcG9vbF9jbG9zdXJlAAAAAAEAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAaZXhlY3V0ZV9yZWRlbXB0aW9uX3N1bW1hcnkAAAAAAAEAAAAAAAAAB3N1bW1hcnkAAAAH0AAAABZFcG9jaFJlZGVtcHRpb25TdW1tYXJ5AAAAAAAA",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAcZ2V0X2xhdGVzdF9yZWRlbXB0aW9uX3JlY29yZAAAAAEAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAEAAAfQAAAAFkxlbmRlclJlZGVtcHRpb25SZWNvcmQAAA==",
        "AAAAAAAAAAAAAAAcZ2V0X2Vwb2NoX3JlZGVtcHRpb25fc3VtbWFyeQAAAAEAAAAAAAAACGVwb2NoX2lkAAAABgAAAAEAAAfQAAAAFkVwb2NoUmVkZW1wdGlvblN1bW1hcnkAAA==",
        "AAAAAAAAAAAAAAAVZ2V0X3JlZGVtcHRpb25fcmVjb3JkAAAAAAAAAQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAB9AAAAAWTGVuZGVyUmVkZW1wdGlvblJlY29yZAAA",
        "AAAAAAAAAAAAAAAMdG90YWxfc3VwcGx5AAAAAAAAAAEAAAAK",
        "AAAAAAAAAAAAAAAMdG90YWxfYXNzZXRzAAAAAAAAAAEAAAAK",
        "AAAAAAAAAAAAAAAPdG90YWxfYXNzZXRzX29mAAAAAAEAAAAAAAAAB2FjY291bnQAAAAAEwAAAAEAAAAK",
        "AAAAAAAAAAAAAAARY29udmVydF90b19zaGFyZXMAAAAAAAABAAAAAAAAAAZhc3NldHMAAAAAAAoAAAABAAAACg==",
        "AAAAAAAAAAAAAAARY29udmVydF90b19hc3NldHMAAAAAAAABAAAAAAAAAAZzaGFyZXMAAAAAAAoAAAABAAAACg==",
        "AAAAAAAAAAAAAAASaXNfYXBwcm92ZWRfbGVuZGVyAAAAAAABAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAAAQ==",
        "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAAVfZnJvbQAAAAAAABMAAAAAAAAACF9zcGVuZGVyAAAAEwAAAAAAAAAHX2Ftb3VudAAAAAALAAAAAAAAABJfZXhwaXJhdGlvbl9sZWRnZXIAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAAVfZnJvbQAAAAAAABMAAAAAAAAAA190bwAAAAATAAAAAAAAAAdfYW1vdW50AAAAAAsAAAAA",
        "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAACF9zcGVuZGVyAAAAEwAAAAAAAAAFX2Zyb20AAAAAAAATAAAAAAAAAANfdG8AAAAAEwAAAAAAAAAHX2Ftb3VudAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABV9mcm9tAAAAAAAAEwAAAAAAAAAHX2Ftb3VudAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAJYnVybl9mcm9tAAAAAAAAAwAAAAAAAAAIX3NwZW5kZXIAAAATAAAAAAAAAAVfZnJvbQAAAAAAABMAAAAAAAAAB19hbW91bnQAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAJYWxsb3dhbmNlAAAAAAAAAgAAAAAAAAAFX2Zyb20AAAAAAAATAAAAAAAAAAhfc3BlbmRlcgAAABMAAAABAAAACw==",
        "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
        "AAAABAAAAAAAAAAAAAAAEVRyYW5jaGVWYXVsdEVycm9yAAAAAAAADAAAAAAAAAAOTGVuZGVyUmVxdWlyZWQAAAAAAZEAAAAAAAAAIkF1dGhvcml6ZWRJbml0aWFsRGVwb3NpdG9yUmVxdWlyZWQAAAAAAZIAAAAAAAAAGlByZXZpb3VzQXNzZXRzTm90V2l0aGRyYXduAAAAAAGTAAAAAAAAABNEZXBvc2l0QW1vdW50VG9vTG93AAAAAZQAAAAAAAAAG1RyYW5jaGVMaXF1aWRpdHlDYXBFeGNlZWRlZAAAAAGVAAAAAAAAABBaZXJvU2hhcmVzTWludGVkAAABlgAAAAAAAAAcSW5zdWZmaWNpZW50U2hhcmVzRm9yUmVxdWVzdAAAAZcAAAAAAAAAEFdpdGhkcmF3VG9vRWFybHkAAAGYAAAAAAAAAA9Qb29sSXNOb3RDbG9zZWQAAAABmQAAAAAAAAATSW52YWxpZFRyYW5jaGVJbmRleAAAAAGaAAAAAAAAABhMZW5kZXJPclNlbnRpbmVsUmVxdWlyZWQAAAGbAAAAAAAAAB5SZWRlbXB0aW9uQ2FuY2VsbGF0aW9uRGlzYWJsZWQAAAAAAZw=",
        "AAAAAgAAAAAAAAAAAAAAE1RyYW5jaGVUb2tlbkRhdGFLZXkAAAAAAgAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAQAAABMAAAAAAAAAAAAAAAtUb3RhbFN1cHBseQA=",
        "AAAAAQAAAAAAAAAAAAAAE0Vwb2NoUHJvY2Vzc2VkRXZlbnQAAAAABAAAAAAAAAAQYW1vdW50X3Byb2Nlc3NlZAAAAAoAAAAAAAAACGVwb2NoX2lkAAAABgAAAAAAAAAQc2hhcmVzX3Byb2Nlc3NlZAAAAAoAAAAAAAAAEHNoYXJlc19yZXF1ZXN0ZWQAAAAK",
        "AAAAAQAAAAAAAAAAAAAAEExlbmRlckFkZGVkRXZlbnQAAAABAAAAAAAAAAdhY2NvdW50AAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAEkxlbmRlclJlbW92ZWRFdmVudAAAAAAAAQAAAAAAAAAHYWNjb3VudAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAAF0xpcXVpZGl0eURlcG9zaXRlZEV2ZW50AAAAAAMAAAAAAAAABmFzc2V0cwAAAAAACgAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAZzaGFyZXMAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAAGExlbmRlckZ1bmREaXNidXJzZWRFdmVudAAAAAIAAAAAAAAAB2FjY291bnQAAAAAEwAAAAAAAAAQYW1vdW50X2Rpc2J1cnNlZAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAAGExlbmRlckZ1bmRXaXRoZHJhd25FdmVudAAAAAMAAAAAAAAAB2FjY291bnQAAAAAEwAAAAAAAAAGYXNzZXRzAAAAAAAKAAAAAAAAAAZzaGFyZXMAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAAG1JlZGVtcHRpb25SZXF1ZXN0QWRkZWRFdmVudAAAAAADAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAACGVwb2NoX2lkAAAABgAAAAAAAAAGc2hhcmVzAAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAAHlJlZGVtcHRpb25SZXF1ZXN0Q2FuY2VsZWRFdmVudAAAAAAAAwAAAAAAAAAHYWNjb3VudAAAAAATAAAAAAAAAAhlcG9jaF9pZAAAAAYAAAAAAAAABnNoYXJlcwAAAAAACg==",
        "AAAAAgAAAAAAAAAAAAAAE1RyYW5jaGVWYXVsdERhdGFLZXkAAAAABQAAAAAAAAAAAAAADFRyYW5jaGVJbmRleAAAAAEAAAAAAAAADkFwcHJvdmVkTGVuZGVyAAAAAAABAAAAEwAAAAEAAAAAAAAADURlcG9zaXRSZWNvcmQAAAAAAAABAAAAEwAAAAEAAAAAAAAAFkxlbmRlclJlZGVtcHRpb25SZWNvcmQAAAAAAAEAAAATAAAAAQAAAAAAAAAWRXBvY2hSZWRlbXB0aW9uU3VtbWFyeQAAAAAAAQAAAAY=",
        "AAAAAQAAAAAAAAAAAAAADURlcG9zaXRSZWNvcmQAAAAAAAACAAAAAAAAABFsYXN0X2RlcG9zaXRfdGltZQAAAAAAAAYAAAAAAAAACXByaW5jaXBhbAAAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAAFkxlbmRlclJlZGVtcHRpb25SZWNvcmQAAAAAAAUAAAAAAAAAGG5leHRfZXBvY2hfaWRfdG9fcHJvY2VzcwAAAAYAAAAAAAAAFG51bV9zaGFyZXNfcmVxdWVzdGVkAAAACgAAAAAAAAATcHJpbmNpcGFsX3JlcXVlc3RlZAAAAAAKAAAAAAAAABZ0b3RhbF9hbW91bnRfcHJvY2Vzc2VkAAAAAAAKAAAAAAAAABZ0b3RhbF9hbW91bnRfd2l0aGRyYXduAAAAAAAK",
        "AAAAAgAAAAAAAAAAAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAwAAAAAAAAAAAAAAB01vbnRobHkAAAAAAAAAAAAAAAAJUXVhcnRlcmx5AAAAAAAAAAAAAAAAAAAMU2VtaUFubnVhbGx5",
        "AAAABAAAAAAAAAAAAAAADUNhbGVuZGFyRXJyb3IAAAAAAAABAAAAAAAAABlTdGFydERhdGVMYXRlclRoYW5FbmREYXRlAAAAAAADIQ==",
        "AAAABAAAAAAAAAAAAAAAC0NvbW1vbkVycm9yAAAAAAcAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAdUHJvdG9jb2xJc1BhdXNlZE9yUG9vbElzTm90T24AAAAAAAACAAAAAAAAABxQb29sT3duZXJPckh1bWFPd25lclJlcXVpcmVkAAAAAwAAAAAAAAAUUG9vbE9wZXJhdG9yUmVxdWlyZWQAAAAEAAAAAAAAACBBdXRob3JpemVkQ29udHJhY3RDYWxsZXJSZXF1aXJlZAAAAAUAAAAAAAAAE1Vuc3VwcG9ydGVkRnVuY3Rpb24AAAAABgAAAAAAAAASWmVyb0Ftb3VudFByb3ZpZGVkAAAAAAAH",
        "AAAAAgAAAAAAAAAAAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAgAAAAAAAAAAAAAAEEZpeGVkU2VuaW9yWWllbGQAAAAAAAAAAAAAAAxSaXNrQWRqdXN0ZWQ=",
        "AAAAAQAAAAAAAAAAAAAADFBvb2xTZXR0aW5ncwAAAAYAAAAAAAAAGWRlZmF1bHRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAAEAAAAAAAAAB5sYXRlX3BheW1lbnRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAACExQQ29uZmlnAAAABgAAAAAAAAAcYXV0b19yZWRlbXB0aW9uX2FmdGVyX2xvY2t1cAAAAAEAAAAAAAAAFmZpeGVkX3Nlbmlvcl95aWVsZF9icHMAAAAAAAQAAAAAAAAADWxpcXVpZGl0eV9jYXAAAAAAAAAKAAAAAAAAABdtYXhfc2VuaW9yX2p1bmlvcl9yYXRpbwAAAAAEAAAAAAAAABx0cmFuY2hlc19yaXNrX2FkanVzdG1lbnRfYnBzAAAABAAAAAAAAAAed2l0aGRyYXdhbF9sb2Nrb3V0X3BlcmlvZF9kYXlzAAAAAAAE",
        "AAAAAQAAAAAAAAAAAAAADEZlZVN0cnVjdHVyZQAAAAQAAAAAAAAAFWZyb250X2xvYWRpbmdfZmVlX2JwcwAAAAAAAAQAAAAAAAAAFmZyb250X2xvYWRpbmdfZmVlX2ZsYXQAAAAAAAoAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAgAAAAAAAAAAAAAAClBvb2xTdGF0dXMAAAAAAAMAAAAAAAAAAAAAAANPZmYAAAAAAAAAAAAAAAACT24AAAAAAAAAAAAAAAAABkNsb3NlZAAA",
        "AAAAAQAAAAAAAAAAAAAABUVwb2NoAAAAAAAAAgAAAAAAAAAIZW5kX3RpbWUAAAAGAAAAAAAAAAJpZAAAAAAABg==",
        "AAAAAQAAAAAAAAAAAAAACEFkbWluUm5SAAAABAAAAAAAAAAVbGlxdWlkaXR5X3JhdGVfYnBzX2VhAAAAAAAABAAAAAAAAAAdbGlxdWlkaXR5X3JhdGVfYnBzX3Bvb2xfb3duZXIAAAAAAAAEAAAAAAAAABJyZXdhcmRfcmF0ZV9icHNfZWEAAAAAAAQAAAAAAAAAGnJld2FyZF9yYXRlX2Jwc19wb29sX293bmVyAAAAAAAE",
        "AAAAAQAAAAAAAAAAAAAAEFRyYW5jaGVBZGRyZXNzZXMAAAABAAAAAAAAAAVhZGRycwAAAAAAA+oAAAPoAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAADVRyYW5jaGVBc3NldHMAAAAAAAABAAAAAAAAAAZhc3NldHMAAAAAA+oAAAAK",
        "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA=",
        "AAAAAQAAAAAAAAAAAAAAFkVwb2NoUmVkZW1wdGlvblN1bW1hcnkAAAAAAAQAAAAAAAAACGVwb2NoX2lkAAAABgAAAAAAAAAWdG90YWxfYW1vdW50X3Byb2Nlc3NlZAAAAAAACgAAAAAAAAAWdG90YWxfc2hhcmVzX3Byb2Nlc3NlZAAAAAAACgAAAAAAAAAWdG90YWxfc2hhcmVzX3JlcXVlc3RlZAAAAAAACg==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    set_contract_addrs: this.txFromJSON<null>,
    add_approved_lender: this.txFromJSON<null>,
    remove_approved_lender: this.txFromJSON<null>,
    make_initial_deposit: this.txFromJSON<u128>,
    deposit: this.txFromJSON<u128>,
    add_redemption_request: this.txFromJSON<null>,
    cancel_redemption_request: this.txFromJSON<null>,
    disburse: this.txFromJSON<null>,
    withdraw_after_pool_closure: this.txFromJSON<null>,
    execute_redemption_summary: this.txFromJSON<null>,
    upgrade: this.txFromJSON<null>,
    get_latest_redemption_record: this.txFromJSON<LenderRedemptionRecord>,
    get_epoch_redemption_summary: this.txFromJSON<EpochRedemptionSummary>,
    get_redemption_record: this.txFromJSON<LenderRedemptionRecord>,
    total_supply: this.txFromJSON<u128>,
    total_assets: this.txFromJSON<u128>,
    total_assets_of: this.txFromJSON<u128>,
    convert_to_shares: this.txFromJSON<u128>,
    convert_to_assets: this.txFromJSON<u128>,
    is_approved_lender: this.txFromJSON<boolean>,
    approve: this.txFromJSON<null>,
    transfer: this.txFromJSON<null>,
    transfer_from: this.txFromJSON<null>,
    burn: this.txFromJSON<null>,
    burn_from: this.txFromJSON<null>,
    allowance: this.txFromJSON<i128>,
    balance: this.txFromJSON<i128>,
    decimals: this.txFromJSON<u32>,
    name: this.txFromJSON<string>,
    symbol: this.txFromJSON<string>,
  };
}
