import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/lib/contract";
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
} from "@stellar/stellar-sdk/lib/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/lib/contract";
export * as rpc from "@stellar/stellar-sdk/lib/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  unknown: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: "CBQ7KII3OETETYM65TFJT2YPVFFK42V4WUBIMJJNWKTIZ5XOWYZW3XAO",
  },
} as const;

export interface PoolManagerAddressesChangedEvent {
  pool: string;
  pool_storage: string;
}

export interface PoolStorageAddressesChangedEvent {
  credit: string;
  pool: string;
  pool_manager: string;
}

export type ClientDataKey =
  | { tag: "HumaConfig"; values: void }
  | { tag: "PoolStorage"; values: void }
  | { tag: "Pool"; values: void };

export interface PoolOperatorAddedEvent {
  operator: string;
}

export interface PoolOperatorRemovedEvent {
  operator: string;
}

export interface HumaConfigChangedEvent {
  huma_config: string;
  huma_owner: string;
  sentinel: string;
}

export interface TrancheAddressesChangedEvent {
  junior_addr: string;
  senior_addr: string;
}

export interface JuniorTrancheAddressChangedEvent {
  junior_addr: string;
}

export interface NewEpochStartedEvent {
  end_time: u64;
  epoch_id: u64;
}

export interface EpochClosedEvent {
  epoch_id: u64;
}

export interface EpochProcessedAfterPoolClosureEvent {
  epoch_id: u64;
}

export interface RedemptionRequestsProcessedEvent {
  junior_tranche_assets: u128;
  junior_tranche_price: u128;
  senior_tranche_assets: u128;
  senior_tranche_price: u128;
  unprocessed_amount: u128;
}

export interface PoolEnabledEvent {
  by: string;
}

export interface PoolDisabledEvent {
  by: string;
}

export interface PoolClosedEvent {
  by: string;
}

export interface PoolOwnerChangedEvent {
  pool_owner: string;
}

export interface PoolOwnerTreasuryChangedEvent {
  treasury: string;
}

export interface EvaluationAgentChangedEvent {
  ea: string;
}

export interface TranchesPolicyTypeChangedEvent {
  policy_type: TranchesPolicyType;
}

export interface PoolSettingsChangedEvent {
  default_grace_period_days: u32;
  late_payment_grace_period_days: u32;
  max_credit_line: u128;
  min_deposit_amount: u128;
  pay_period_duration: PayPeriodDuration;
  principal_only_payment_allowed: boolean;
}

export interface LPConfigChangedEvent {
  auto_redemption_after_lockup: boolean;
  fixed_senior_yield_bps: u32;
  liquidity_cap: u128;
  max_senior_junior_ratio: u32;
  tranches_risk_adjustment_bps: u32;
  withdrawal_lockout_period_days: u32;
}

export interface FeeStructureChangedEvent {
  front_loading_fee_bps: u32;
  front_loading_fee_flat: u128;
  late_fee_bps: u32;
  yield_bps: u32;
}

export interface AdminRnRChangedEvent {
  ea_liquidity_rate: u32;
  ea_reward_rate: u32;
  pool_owner_liquidity_rate: u32;
  pool_owner_reward_rate: u32;
}

export interface PoolNameChangedEvent {
  name: string;
}

export interface ProtocolRewardsWithdrawnEvent {
  amount: u128;
  receiver: string;
}

export interface PoolRewardsWithdrawnEvent {
  amount: u128;
  receiver: string;
}

export interface PoolRewardsWithdrawalFailedEvent {
  amount: u128;
  receiver: string;
}

export interface EvaluationAgentRewardsWithdrawnEvent {
  amount: u128;
  receiver: string;
}

export interface EARewardsWithdrawalFailedEvent {
  amount: u128;
  receiver: string;
}

export type PayPeriodDuration =
  | { tag: "Monthly"; values: void }
  | { tag: "Quarterly"; values: void }
  | { tag: "SemiAnnually"; values: void };

export const Errors = {
  801: { message: "StartDateLaterThanEndDate" },

  1: { message: "AlreadyInitialized" },

  2: { message: "ProtocolIsPausedOrPoolIsNotOn" },

  3: { message: "PoolOwnerOrHumaOwnerRequired" },

  4: { message: "PoolOperatorRequired" },

  5: { message: "AuthorizedContractCallerRequired" },

  6: { message: "UnsupportedFunction" },

  7: { message: "ZeroAmountProvided" },

  301: { message: "PoolOwnerOrEARequired" },

  302: { message: "AdminRewardRateTooHigh" },

  303: { message: "MinDepositAmountTooLow" },

  304: { message: "LatePaymentGracePeriodTooLong" },

  305: { message: "InsufficientAmountForRequest" },

  306: { message: "InvalidBasisPointHigherThan10000" },

  307: { message: "EpochClosedTooEarly" },
};
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
      pool_name,
      huma_config,
      pool_storage,
      pool,
    }: {
      pool_name: string;
      huma_config: string;
      pool_storage: string;
      pool: string;
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
   * Construct and simulate a set_huma_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_huma_config: (
    { huma_config }: { huma_config: string },
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
    }: { caller: string; pool_storage: string; pool: string },
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
      pool,
      pool_manager,
      credit,
    }: { caller: string; pool: string; pool_manager: string; credit: string },
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
   * Construct and simulate a set_pool_name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_name: (
    { caller, name }: { caller: string; name: string },
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
   * Construct and simulate a set_pool_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_owner: (
    { caller, addr }: { caller: string; addr: string },
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
   * Construct and simulate a set_pool_owner_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_owner_treasury: (
    { caller, addr }: { caller: string; addr: string },
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
   * Construct and simulate a set_evaluation_agent transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_evaluation_agent: (
    { caller, addr }: { caller: string; addr: string },
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
   * Construct and simulate a set_tranche_addresses transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_tranche_addresses: (
    {
      caller,
      junior_addr,
      senior_addr,
    }: { caller: string; junior_addr: string; senior_addr: Option<string> },
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
   * Construct and simulate a set_admin_rnr transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin_rnr: (
    {
      caller,
      pool_owner_reward_rate,
      pool_owner_liquidity_rate,
      ea_reward_rate,
      ea_liquidity_rate,
    }: {
      caller: string;
      pool_owner_reward_rate: u32;
      pool_owner_liquidity_rate: u32;
      ea_reward_rate: u32;
      ea_liquidity_rate: u32;
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
   * Construct and simulate a set_pool_settings transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_settings: (
    {
      caller,
      max_credit_line,
      min_deposit_amount,
      pay_period_duration,
      late_payment_grace_period_days,
      default_grace_period_days,
      principal_only_payment_allowed,
    }: {
      caller: string;
      max_credit_line: u128;
      min_deposit_amount: u128;
      pay_period_duration: PayPeriodDuration;
      late_payment_grace_period_days: u32;
      default_grace_period_days: u32;
      principal_only_payment_allowed: boolean;
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
   * Construct and simulate a set_lp_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_lp_config: (
    {
      caller,
      liquidity_cap,
      max_senior_junior_ratio,
      fixed_senior_yield_bps,
      tranches_risk_adjustment_bps,
      withdrawal_lockout_period_days,
      auto_redemption_after_lockup,
    }: {
      caller: string;
      liquidity_cap: u128;
      max_senior_junior_ratio: u32;
      fixed_senior_yield_bps: u32;
      tranches_risk_adjustment_bps: u32;
      withdrawal_lockout_period_days: u32;
      auto_redemption_after_lockup: boolean;
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
   * Construct and simulate a set_fee_structure transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_fee_structure: (
    {
      caller,
      yield_bps,
      late_fee_bps,
      front_loading_fee_flat,
      front_loading_fee_bps,
    }: {
      caller: string;
      yield_bps: u32;
      late_fee_bps: u32;
      front_loading_fee_flat: u128;
      front_loading_fee_bps: u32;
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
   * Construct and simulate a set_tranches_policy_type transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_tranches_policy_type: (
    {
      caller,
      policy_type,
    }: { caller: string; policy_type: TranchesPolicyType },
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
   * Construct and simulate a add_pool_operator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_pool_operator: (
    { addr }: { addr: string },
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
   * Construct and simulate a remove_pool_operator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_pool_operator: (
    { addr }: { addr: string },
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
   * Construct and simulate a enable_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  enable_pool: (
    { caller }: { caller: string },
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
   * Construct and simulate a disable_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  disable_pool: (
    { caller }: { caller: string },
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
   * Construct and simulate a close_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  close_pool: (
    { caller }: { caller: string },
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
   * Construct and simulate a close_epoch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  close_epoch: (options?: {
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
  }) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a withdraw_protocol_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_protocol_fees: (
    { amount }: { amount: u128 },
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
   * Construct and simulate a withdraw_pool_owner_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_pool_owner_fees: (
    { amount }: { amount: u128 },
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
   * Construct and simulate a withdraw_ea_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_ea_fees: (
    { caller, amount }: { caller: string; amount: u128 },
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
        "AAAAAQAAAAAAAAAAAAAAIFBvb2xNYW5hZ2VyQWRkcmVzc2VzQ2hhbmdlZEV2ZW50AAAAAgAAAAAAAAAEcG9vbAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABM=",
        "AAAAAQAAAAAAAAAAAAAAIFBvb2xTdG9yYWdlQWRkcmVzc2VzQ2hhbmdlZEV2ZW50AAAAAwAAAAAAAAAGY3JlZGl0AAAAAAATAAAAAAAAAARwb29sAAAAEwAAAAAAAAAMcG9vbF9tYW5hZ2VyAAAAEw==",
        "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAADAAAAAAAAAAAAAAAKSHVtYUNvbmZpZwAAAAAAAAAAAAAAAAALUG9vbFN0b3JhZ2UAAAAAAAAAAAAAAAAEUG9vbA==",
        "AAAAAQAAAAAAAAAAAAAAFlBvb2xPcGVyYXRvckFkZGVkRXZlbnQAAAAAAAEAAAAAAAAACG9wZXJhdG9yAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAGFBvb2xPcGVyYXRvclJlbW92ZWRFdmVudAAAAAEAAAAAAAAACG9wZXJhdG9yAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAFkh1bWFDb25maWdDaGFuZ2VkRXZlbnQAAAAAAAMAAAAAAAAAC2h1bWFfY29uZmlnAAAAABMAAAAAAAAACmh1bWFfb3duZXIAAAAAABMAAAAAAAAACHNlbnRpbmVsAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAHFRyYW5jaGVBZGRyZXNzZXNDaGFuZ2VkRXZlbnQAAAACAAAAAAAAAAtqdW5pb3JfYWRkcgAAAAATAAAAAAAAAAtzZW5pb3JfYWRkcgAAAAAT",
        "AAAAAQAAAAAAAAAAAAAAIEp1bmlvclRyYW5jaGVBZGRyZXNzQ2hhbmdlZEV2ZW50AAAAAQAAAAAAAAALanVuaW9yX2FkZHIAAAAAEw==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAJcG9vbF9uYW1lAAAAAAAAEAAAAAAAAAALaHVtYV9jb25maWcAAAAAEwAAAAAAAAAMcG9vbF9zdG9yYWdlAAAAEwAAAAAAAAAEcG9vbAAAABMAAAAA",
        "AAAAAAAAAAAAAAAPc2V0X2h1bWFfY29uZmlnAAAAAAEAAAAAAAAAC2h1bWFfY29uZmlnAAAAABMAAAAA",
        "AAAAAAAAAAAAAAASc2V0X2NvbnRyYWN0X2FkZHJzAAAAAAADAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABMAAAAAAAAABHBvb2wAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAac2V0X3N0b3JhZ2VfY29udHJhY3RfYWRkcnMAAAAAAAQAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEcG9vbAAAABMAAAAAAAAADHBvb2xfbWFuYWdlcgAAABMAAAAAAAAABmNyZWRpdAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAANc2V0X3Bvb2xfbmFtZQAAAAAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEbmFtZQAAABAAAAAA",
        "AAAAAAAAAAAAAAAOc2V0X3Bvb2xfb3duZXIAAAAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEYWRkcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAXc2V0X3Bvb2xfb3duZXJfdHJlYXN1cnkAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAARhZGRyAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAUc2V0X2V2YWx1YXRpb25fYWdlbnQAAAACAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABGFkZHIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAVc2V0X3RyYW5jaGVfYWRkcmVzc2VzAAAAAAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAtqdW5pb3JfYWRkcgAAAAATAAAAAAAAAAtzZW5pb3JfYWRkcgAAAAPoAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAANc2V0X2FkbWluX3JucgAAAAAAAAUAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAWcG9vbF9vd25lcl9yZXdhcmRfcmF0ZQAAAAAABAAAAAAAAAAZcG9vbF9vd25lcl9saXF1aWRpdHlfcmF0ZQAAAAAAAAQAAAAAAAAADmVhX3Jld2FyZF9yYXRlAAAAAAAEAAAAAAAAABFlYV9saXF1aWRpdHlfcmF0ZQAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAARc2V0X3Bvb2xfc2V0dGluZ3MAAAAAAAAHAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAebGF0ZV9wYXltZW50X2dyYWNlX3BlcmlvZF9kYXlzAAAAAAAEAAAAAAAAABlkZWZhdWx0X2dyYWNlX3BlcmlvZF9kYXlzAAAAAAAABAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAABAAAAAA==",
        "AAAAAAAAAAAAAAANc2V0X2xwX2NvbmZpZwAAAAAAAAcAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAFmZpeGVkX3Nlbmlvcl95aWVsZF9icHMAAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAHGF1dG9fcmVkZW1wdGlvbl9hZnRlcl9sb2NrdXAAAAABAAAAAA==",
        "AAAAAAAAAAAAAAARc2V0X2ZlZV9zdHJ1Y3R1cmUAAAAAAAAFAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAAAAAAFmZyb250X2xvYWRpbmdfZmVlX2ZsYXQAAAAAAAoAAAAAAAAAFWZyb250X2xvYWRpbmdfZmVlX2JwcwAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAYc2V0X3RyYW5jaGVzX3BvbGljeV90eXBlAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAtwb2xpY3lfdHlwZQAAAAfQAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAA==",
        "AAAAAAAAAAAAAAARYWRkX3Bvb2xfb3BlcmF0b3IAAAAAAAABAAAAAAAAAARhZGRyAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAUcmVtb3ZlX3Bvb2xfb3BlcmF0b3IAAAABAAAAAAAAAARhZGRyAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAALZW5hYmxlX3Bvb2wAAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAMZGlzYWJsZV9wb29sAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAKY2xvc2VfcG9vbAAAAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAALY2xvc2VfZXBvY2gAAAAAAAAAAAA=",
        "AAAAAAAAAAAAAAAWd2l0aGRyYXdfcHJvdG9jb2xfZmVlcwAAAAAAAQAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAAYd2l0aGRyYXdfcG9vbF9vd25lcl9mZWVzAAAAAQAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAAQd2l0aGRyYXdfZWFfZmVlcwAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAQAAAAAAAAAAAAAAFE5ld0Vwb2NoU3RhcnRlZEV2ZW50AAAAAgAAAAAAAAAIZW5kX3RpbWUAAAAGAAAAAAAAAAhlcG9jaF9pZAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAAEEVwb2NoQ2xvc2VkRXZlbnQAAAABAAAAAAAAAAhlcG9jaF9pZAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAAI0Vwb2NoUHJvY2Vzc2VkQWZ0ZXJQb29sQ2xvc3VyZUV2ZW50AAAAAAEAAAAAAAAACGVwb2NoX2lkAAAABg==",
        "AAAAAQAAAAAAAAAAAAAAIFJlZGVtcHRpb25SZXF1ZXN0c1Byb2Nlc3NlZEV2ZW50AAAABQAAAAAAAAAVanVuaW9yX3RyYW5jaGVfYXNzZXRzAAAAAAAACgAAAAAAAAAUanVuaW9yX3RyYW5jaGVfcHJpY2UAAAAKAAAAAAAAABVzZW5pb3JfdHJhbmNoZV9hc3NldHMAAAAAAAAKAAAAAAAAABRzZW5pb3JfdHJhbmNoZV9wcmljZQAAAAoAAAAAAAAAEnVucHJvY2Vzc2VkX2Ftb3VudAAAAAAACg==",
        "AAAABAAAAAAAAAAAAAAAEFBvb2xNYW5hZ2VyRXJyb3IAAAAHAAAAAAAAABVQb29sT3duZXJPckVBUmVxdWlyZWQAAAAAAAEtAAAAAAAAABZBZG1pblJld2FyZFJhdGVUb29IaWdoAAAAAAEuAAAAAAAAABZNaW5EZXBvc2l0QW1vdW50VG9vTG93AAAAAAEvAAAAAAAAAB1MYXRlUGF5bWVudEdyYWNlUGVyaW9kVG9vTG9uZwAAAAAAATAAAAAAAAAAHEluc3VmZmljaWVudEFtb3VudEZvclJlcXVlc3QAAAExAAAAAAAAACBJbnZhbGlkQmFzaXNQb2ludEhpZ2hlclRoYW4xMDAwMAAAATIAAAAAAAAAE0Vwb2NoQ2xvc2VkVG9vRWFybHkAAAABMw==",
        "AAAAAQAAAAAAAAAAAAAAEFBvb2xFbmFibGVkRXZlbnQAAAABAAAAAAAAAAJieQAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAEVBvb2xEaXNhYmxlZEV2ZW50AAAAAAAAAQAAAAAAAAACYnkAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAD1Bvb2xDbG9zZWRFdmVudAAAAAABAAAAAAAAAAJieQAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAFVBvb2xPd25lckNoYW5nZWRFdmVudAAAAAAAAAEAAAAAAAAACnBvb2xfb3duZXIAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAHVBvb2xPd25lclRyZWFzdXJ5Q2hhbmdlZEV2ZW50AAAAAAAAAQAAAAAAAAAIdHJlYXN1cnkAAAAT",
        "AAAAAQAAAAAAAAAAAAAAG0V2YWx1YXRpb25BZ2VudENoYW5nZWRFdmVudAAAAAABAAAAAAAAAAJlYQAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAHlRyYW5jaGVzUG9saWN5VHlwZUNoYW5nZWRFdmVudAAAAAAAAQAAAAAAAAALcG9saWN5X3R5cGUAAAAH0AAAABJUcmFuY2hlc1BvbGljeVR5cGUAAA==",
        "AAAAAQAAAAAAAAAAAAAAGFBvb2xTZXR0aW5nc0NoYW5nZWRFdmVudAAAAAYAAAAAAAAAGWRlZmF1bHRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAAEAAAAAAAAAB5sYXRlX3BheW1lbnRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAAFExQQ29uZmlnQ2hhbmdlZEV2ZW50AAAABgAAAAAAAAAcYXV0b19yZWRlbXB0aW9uX2FmdGVyX2xvY2t1cAAAAAEAAAAAAAAAFmZpeGVkX3Nlbmlvcl95aWVsZF9icHMAAAAAAAQAAAAAAAAADWxpcXVpZGl0eV9jYXAAAAAAAAAKAAAAAAAAABdtYXhfc2VuaW9yX2p1bmlvcl9yYXRpbwAAAAAEAAAAAAAAABx0cmFuY2hlc19yaXNrX2FkanVzdG1lbnRfYnBzAAAABAAAAAAAAAAed2l0aGRyYXdhbF9sb2Nrb3V0X3BlcmlvZF9kYXlzAAAAAAAE",
        "AAAAAQAAAAAAAAAAAAAAGEZlZVN0cnVjdHVyZUNoYW5nZWRFdmVudAAAAAQAAAAAAAAAFWZyb250X2xvYWRpbmdfZmVlX2JwcwAAAAAAAAQAAAAAAAAAFmZyb250X2xvYWRpbmdfZmVlX2ZsYXQAAAAAAAoAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAFEFkbWluUm5SQ2hhbmdlZEV2ZW50AAAABAAAAAAAAAARZWFfbGlxdWlkaXR5X3JhdGUAAAAAAAAEAAAAAAAAAA5lYV9yZXdhcmRfcmF0ZQAAAAAABAAAAAAAAAAZcG9vbF9vd25lcl9saXF1aWRpdHlfcmF0ZQAAAAAAAAQAAAAAAAAAFnBvb2xfb3duZXJfcmV3YXJkX3JhdGUAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAFFBvb2xOYW1lQ2hhbmdlZEV2ZW50AAAAAQAAAAAAAAAEbmFtZQAAABA=",
        "AAAAAQAAAAAAAAAAAAAAHVByb3RvY29sUmV3YXJkc1dpdGhkcmF3bkV2ZW50AAAAAAAAAgAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAAAAAAhyZWNlaXZlcgAAABM=",
        "AAAAAQAAAAAAAAAAAAAAGVBvb2xSZXdhcmRzV2l0aGRyYXduRXZlbnQAAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAoAAAAAAAAACHJlY2VpdmVyAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAIFBvb2xSZXdhcmRzV2l0aGRyYXdhbEZhaWxlZEV2ZW50AAAAAgAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAAAAAAhyZWNlaXZlcgAAABM=",
        "AAAAAQAAAAAAAAAAAAAAJEV2YWx1YXRpb25BZ2VudFJld2FyZHNXaXRoZHJhd25FdmVudAAAAAIAAAAAAAAABmFtb3VudAAAAAAACgAAAAAAAAAIcmVjZWl2ZXIAAAAT",
        "AAAAAQAAAAAAAAAAAAAAHkVBUmV3YXJkc1dpdGhkcmF3YWxGYWlsZWRFdmVudAAAAAAAAgAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAAAAAAhyZWNlaXZlcgAAABM=",
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
        "AAAAAQAAAAAAAAAAAAAAFkVwb2NoUmVkZW1wdGlvblN1bW1hcnkAAAAAAAQAAAAAAAAACGVwb2NoX2lkAAAABgAAAAAAAAAWdG90YWxfYW1vdW50X3Byb2Nlc3NlZAAAAAAACgAAAAAAAAAWdG90YWxfc2hhcmVzX3Byb2Nlc3NlZAAAAAAACgAAAAAAAAAWdG90YWxfc2hhcmVzX3JlcXVlc3RlZAAAAAAACg==",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    set_huma_config: this.txFromJSON<null>,
    set_contract_addrs: this.txFromJSON<null>,
    set_storage_contract_addrs: this.txFromJSON<null>,
    set_pool_name: this.txFromJSON<null>,
    set_pool_owner: this.txFromJSON<null>,
    set_pool_owner_treasury: this.txFromJSON<null>,
    set_evaluation_agent: this.txFromJSON<null>,
    set_tranche_addresses: this.txFromJSON<null>,
    set_admin_rnr: this.txFromJSON<null>,
    set_pool_settings: this.txFromJSON<null>,
    set_lp_config: this.txFromJSON<null>,
    set_fee_structure: this.txFromJSON<null>,
    set_tranches_policy_type: this.txFromJSON<null>,
    add_pool_operator: this.txFromJSON<null>,
    remove_pool_operator: this.txFromJSON<null>,
    enable_pool: this.txFromJSON<null>,
    disable_pool: this.txFromJSON<null>,
    close_pool: this.txFromJSON<null>,
    close_epoch: this.txFromJSON<null>,
    withdraw_protocol_fees: this.txFromJSON<null>,
    withdraw_pool_owner_fees: this.txFromJSON<null>,
    withdraw_ea_fees: this.txFromJSON<null>,
    upgrade: this.txFromJSON<null>,
  };
}
