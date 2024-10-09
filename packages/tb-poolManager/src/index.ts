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
    contractId: "CCTCNYWWKPVFNPJDQUMJM6GFBU6IJSZH6CHPM5COJTBMWO64A4XVCXNV",
  },
} as const;

export type ClientDataKey =
  | { tag: "HumaConfig"; values: void }
  | { tag: "PoolStorage"; values: void }
  | { tag: "Pool"; values: void };

export interface PoolManagerAddressesChangedEvent {
  pool: string;
  pool_storage: string;
}

export interface PoolStorageAddressesChangedEvent {
  pool: string;
  pool_credit: string;
  pool_manager: string;
}

export interface PoolOperatorAddedEvent {
  operator: string;
}

export interface PoolOperatorRemovedEvent {
  operator: string;
}

export interface HumaConfigChangedEvent {
  huma_config: string;
  huma_owner: string;
  is_protocol_on: boolean;
  sentinel: string;
}

export interface TrancheAddressesChangedEvent {
  junior_addr: string;
  senior_addr: string;
}

/**
 * Event indicating that a new epoch has started.
 * # Fields:
 * * `epoch_id` - The ID of the epoch that just started.
 * * `end_time` - The time when the current epoch should end.
 */
export interface NewEpochStartedEvent {
  end_time: u64;
  epoch_id: u64;
}

/**
 * Event indicating that the current epoch has closed.
 * # Fields:
 * * `epoch_id` - The ID of the epoch that just closed.
 */
export interface EpochClosedEvent {
  epoch_id: u64;
}

/**
 * Event indicating that the epoch has been processed after the pool is closed.
 * # Fields:
 * * `epoch_id` - The ID of the epoch that has been processed.
 */
export interface EpochProcessedAfterPoolClosureEvent {
  epoch_id: u64;
}

/**
 * Event indicating that pending redemption requests have been processed.
 * # Fields:
 * * `senior_tranche_assets` - The total amount of assets in the senior tranche.
 * * `senior_tranche_price` - The LP token price of the senior tranche.
 * * `junior_tranche_assets` - The total amount of assets in the junior tranche.
 * * `junior_tranche_price` - The LP token price of the junior tranche.
 * * `unprocessed_amount` - The amount of assets requested for redemption but not fulfilled.
 */
export interface RedemptionRequestsProcessedEvent {
  junior_tranche_assets: u128;
  junior_tranche_price: u128;
  senior_tranche_assets: u128;
  senior_tranche_price: u128;
  unprocessed_amount: u128;
}

export const Errors = {
  301: { message: "" },
  302: { message: "" },
  303: { message: "" },
  304: { message: "" },
  305: { message: "" },
  306: { message: "" },
  307: { message: "" },
  308: { message: "" },
  309: { message: "" },
  101: { message: "" },
  1: { message: "" },
  2: { message: "" },
  3: { message: "" },
  4: { message: "" },
  5: { message: "" },
};

/**
 * Event indicating that the pool has been enabled.
 * # Fields:
 * * `by` - The address that enabled the pool.
 */
export interface PoolEnabledEvent {
  by: string;
}

/**
 * Event indicating that the pool has been disabled.
 * # Fields:
 * * `by` - The address that disabled the pool.
 */
export interface PoolDisabledEvent {
  by: string;
}

/**
 * Event indicating that the pool has been closed.
 * # Fields:
 * * `by` - The address that closed the pool.
 */
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

export interface EvaluationAgentRewardsWithdrawnEvent {
  amount: u128;
  receiver: string;
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
    { pool_storage, pool }: { pool_storage: string; pool: string },
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
      pool,
      pool_manager,
      pool_credit,
    }: { pool: string; pool_manager: string; pool_credit: string },
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
    }: {
      caller: string;
      liquidity_cap: u128;
      max_senior_junior_ratio: u32;
      fixed_senior_yield_bps: u32;
      tranches_risk_adjustment_bps: u32;
      withdrawal_lockout_period_days: u32;
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
        "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAADAAAAAAAAAAAAAAAKSHVtYUNvbmZpZwAAAAAAAAAAAAAAAAALUG9vbFN0b3JhZ2UAAAAAAAAAAAAAAAAEUG9vbA==",
        "AAAAAQAAAAAAAAAAAAAAIFBvb2xNYW5hZ2VyQWRkcmVzc2VzQ2hhbmdlZEV2ZW50AAAAAgAAAAAAAAAEcG9vbAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABM=",
        "AAAAAQAAAAAAAAAAAAAAIFBvb2xTdG9yYWdlQWRkcmVzc2VzQ2hhbmdlZEV2ZW50AAAAAwAAAAAAAAAEcG9vbAAAABMAAAAAAAAAC3Bvb2xfY3JlZGl0AAAAABMAAAAAAAAADHBvb2xfbWFuYWdlcgAAABM=",
        "AAAAAQAAAAAAAAAAAAAAFlBvb2xPcGVyYXRvckFkZGVkRXZlbnQAAAAAAAEAAAAAAAAACG9wZXJhdG9yAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAGFBvb2xPcGVyYXRvclJlbW92ZWRFdmVudAAAAAEAAAAAAAAACG9wZXJhdG9yAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAFkh1bWFDb25maWdDaGFuZ2VkRXZlbnQAAAAAAAQAAAAAAAAAC2h1bWFfY29uZmlnAAAAABMAAAAAAAAACmh1bWFfb3duZXIAAAAAABMAAAAAAAAADmlzX3Byb3RvY29sX29uAAAAAAABAAAAAAAAAAhzZW50aW5lbAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAHFRyYW5jaGVBZGRyZXNzZXNDaGFuZ2VkRXZlbnQAAAACAAAAAAAAAAtqdW5pb3JfYWRkcgAAAAATAAAAAAAAAAtzZW5pb3JfYWRkcgAAAAAT",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAJcG9vbF9uYW1lAAAAAAAAEAAAAAAAAAALaHVtYV9jb25maWcAAAAAEwAAAAAAAAAMcG9vbF9zdG9yYWdlAAAAEwAAAAAAAAAEcG9vbAAAABMAAAAA",
        "AAAAAAAAAAAAAAAPc2V0X2h1bWFfY29uZmlnAAAAAAEAAAAAAAAAC2h1bWFfY29uZmlnAAAAABMAAAAA",
        "AAAAAAAAAAAAAAASc2V0X2NvbnRyYWN0X2FkZHJzAAAAAAACAAAAAAAAAAxwb29sX3N0b3JhZ2UAAAATAAAAAAAAAARwb29sAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAac2V0X3N0b3JhZ2VfY29udHJhY3RfYWRkcnMAAAAAAAMAAAAAAAAABHBvb2wAAAATAAAAAAAAAAxwb29sX21hbmFnZXIAAAATAAAAAAAAAAtwb29sX2NyZWRpdAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAANc2V0X3Bvb2xfbmFtZQAAAAAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEbmFtZQAAABAAAAAA",
        "AAAAAAAAAAAAAAAOc2V0X3Bvb2xfb3duZXIAAAAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEYWRkcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAXc2V0X3Bvb2xfb3duZXJfdHJlYXN1cnkAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAARhZGRyAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAUc2V0X2V2YWx1YXRpb25fYWdlbnQAAAACAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABGFkZHIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAVc2V0X3RyYW5jaGVfYWRkcmVzc2VzAAAAAAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAtqdW5pb3JfYWRkcgAAAAATAAAAAAAAAAtzZW5pb3JfYWRkcgAAAAPoAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAANc2V0X2FkbWluX3JucgAAAAAAAAUAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAWcG9vbF9vd25lcl9yZXdhcmRfcmF0ZQAAAAAABAAAAAAAAAAZcG9vbF9vd25lcl9saXF1aWRpdHlfcmF0ZQAAAAAAAAQAAAAAAAAADmVhX3Jld2FyZF9yYXRlAAAAAAAEAAAAAAAAABFlYV9saXF1aWRpdHlfcmF0ZQAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAARc2V0X3Bvb2xfc2V0dGluZ3MAAAAAAAAHAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAebGF0ZV9wYXltZW50X2dyYWNlX3BlcmlvZF9kYXlzAAAAAAAEAAAAAAAAABlkZWZhdWx0X2dyYWNlX3BlcmlvZF9kYXlzAAAAAAAABAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAABAAAAAA==",
        "AAAAAAAAAAAAAAANc2V0X2xwX2NvbmZpZwAAAAAAAAYAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAFmZpeGVkX3Nlbmlvcl95aWVsZF9icHMAAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQAAAAA",
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
        "AAAAAQAAAKlFdmVudCBpbmRpY2F0aW5nIHRoYXQgYSBuZXcgZXBvY2ggaGFzIHN0YXJ0ZWQuCiMgRmllbGRzOgoqIGBlcG9jaF9pZGAgLSBUaGUgSUQgb2YgdGhlIGVwb2NoIHRoYXQganVzdCBzdGFydGVkLgoqIGBlbmRfdGltZWAgLSBUaGUgdGltZSB3aGVuIHRoZSBjdXJyZW50IGVwb2NoIHNob3VsZCBlbmQuAAAAAAAAAAAAABROZXdFcG9jaFN0YXJ0ZWRFdmVudAAAAAIAAAAAAAAACGVuZF90aW1lAAAABgAAAAAAAAAIZXBvY2hfaWQAAAAG",
        "AAAAAQAAAHJFdmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIGN1cnJlbnQgZXBvY2ggaGFzIGNsb3NlZC4KIyBGaWVsZHM6CiogYGVwb2NoX2lkYCAtIFRoZSBJRCBvZiB0aGUgZXBvY2ggdGhhdCBqdXN0IGNsb3NlZC4AAAAAAAAAAAAQRXBvY2hDbG9zZWRFdmVudAAAAAEAAAAAAAAACGVwb2NoX2lkAAAABg==",
        "AAAAAQAAAJJFdmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIGVwb2NoIGhhcyBiZWVuIHByb2Nlc3NlZCBhZnRlciB0aGUgcG9vbCBpcyBjbG9zZWQuCiMgRmllbGRzOgoqIGBlcG9jaF9pZGAgLSBUaGUgSUQgb2YgdGhlIGVwb2NoIHRoYXQgaGFzIGJlZW4gcHJvY2Vzc2VkLgAAAAAAAAAAACNFcG9jaFByb2Nlc3NlZEFmdGVyUG9vbENsb3N1cmVFdmVudAAAAAABAAAAAAAAAAhlcG9jaF9pZAAAAAY=",
        "AAAAAQAAAdBFdmVudCBpbmRpY2F0aW5nIHRoYXQgcGVuZGluZyByZWRlbXB0aW9uIHJlcXVlc3RzIGhhdmUgYmVlbiBwcm9jZXNzZWQuCiMgRmllbGRzOgoqIGBzZW5pb3JfdHJhbmNoZV9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBhc3NldHMgaW4gdGhlIHNlbmlvciB0cmFuY2hlLgoqIGBzZW5pb3JfdHJhbmNoZV9wcmljZWAgLSBUaGUgTFAgdG9rZW4gcHJpY2Ugb2YgdGhlIHNlbmlvciB0cmFuY2hlLgoqIGBqdW5pb3JfdHJhbmNoZV9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBhc3NldHMgaW4gdGhlIGp1bmlvciB0cmFuY2hlLgoqIGBqdW5pb3JfdHJhbmNoZV9wcmljZWAgLSBUaGUgTFAgdG9rZW4gcHJpY2Ugb2YgdGhlIGp1bmlvciB0cmFuY2hlLgoqIGB1bnByb2Nlc3NlZF9hbW91bnRgIC0gVGhlIGFtb3VudCBvZiBhc3NldHMgcmVxdWVzdGVkIGZvciByZWRlbXB0aW9uIGJ1dCBub3QgZnVsZmlsbGVkLgAAAAAAAAAgUmVkZW1wdGlvblJlcXVlc3RzUHJvY2Vzc2VkRXZlbnQAAAAFAAAAAAAAABVqdW5pb3JfdHJhbmNoZV9hc3NldHMAAAAAAAAKAAAAAAAAABRqdW5pb3JfdHJhbmNoZV9wcmljZQAAAAoAAAAAAAAAFXNlbmlvcl90cmFuY2hlX2Fzc2V0cwAAAAAAAAoAAAAAAAAAFHNlbmlvcl90cmFuY2hlX3ByaWNlAAAACgAAAAAAAAASdW5wcm9jZXNzZWRfYW1vdW50AAAAAAAK",
        "AAAABAAAAAAAAAAAAAAAEFBvb2xNYW5hZ2VyRXJyb3IAAAAJAAAAAAAAABxQb29sT3duZXJPckh1bWFPd25lclJlcXVpcmVkAAABLQAAAAAAAAAUUG9vbE9wZXJhdG9yUmVxdWlyZWQAAAEuAAAAAAAAABVQb29sT3duZXJPckVBUmVxdWlyZWQAAAAAAAEvAAAAAAAAABZBZG1pblJld2FyZFJhdGVUb29IaWdoAAAAAAEwAAAAAAAAABZNaW5EZXBvc2l0QW1vdW50VG9vTG93AAAAAAExAAAAAAAAAB1MYXRlUGF5bWVudEdyYWNlUGVyaW9kVG9vTG9uZwAAAAAAATIAAAAAAAAAHEluc3VmZmljaWVudEFtb3VudEZvclJlcXVlc3QAAAEzAAAAAAAAACBJbnZhbGlkQmFzaXNQb2ludEhpZ2hlclRoYW4xMDAwMAAAATQAAAAAAAAAE0Vwb2NoQ2xvc2VkVG9vRWFybHkAAAABNQ==",
        "AAAAAQAAAGZFdmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIHBvb2wgaGFzIGJlZW4gZW5hYmxlZC4KIyBGaWVsZHM6CiogYGJ5YCAtIFRoZSBhZGRyZXNzIHRoYXQgZW5hYmxlZCB0aGUgcG9vbC4AAAAAAAAAAAAQUG9vbEVuYWJsZWRFdmVudAAAAAEAAAAAAAAAAmJ5AAAAAAAT",
        "AAAAAQAAAGhFdmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIHBvb2wgaGFzIGJlZW4gZGlzYWJsZWQuCiMgRmllbGRzOgoqIGBieWAgLSBUaGUgYWRkcmVzcyB0aGF0IGRpc2FibGVkIHRoZSBwb29sLgAAAAAAAAARUG9vbERpc2FibGVkRXZlbnQAAAAAAAABAAAAAAAAAAJieQAAAAAAEw==",
        "AAAAAQAAAGRFdmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIHBvb2wgaGFzIGJlZW4gY2xvc2VkLgojIEZpZWxkczoKKiBgYnlgIC0gVGhlIGFkZHJlc3MgdGhhdCBjbG9zZWQgdGhlIHBvb2wuAAAAAAAAAA9Qb29sQ2xvc2VkRXZlbnQAAAAAAQAAAAAAAAACYnkAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAFVBvb2xPd25lckNoYW5nZWRFdmVudAAAAAAAAAEAAAAAAAAACnBvb2xfb3duZXIAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAHVBvb2xPd25lclRyZWFzdXJ5Q2hhbmdlZEV2ZW50AAAAAAAAAQAAAAAAAAAIdHJlYXN1cnkAAAAT",
        "AAAAAQAAAAAAAAAAAAAAG0V2YWx1YXRpb25BZ2VudENoYW5nZWRFdmVudAAAAAABAAAAAAAAAAJlYQAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAHlRyYW5jaGVzUG9saWN5VHlwZUNoYW5nZWRFdmVudAAAAAAAAQAAAAAAAAALcG9saWN5X3R5cGUAAAAH0AAAABJUcmFuY2hlc1BvbGljeVR5cGUAAA==",
        "AAAAAQAAAAAAAAAAAAAAGFBvb2xTZXR0aW5nc0NoYW5nZWRFdmVudAAAAAYAAAAAAAAAGWRlZmF1bHRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAAEAAAAAAAAAB5sYXRlX3BheW1lbnRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAAFExQQ29uZmlnQ2hhbmdlZEV2ZW50AAAABQAAAAAAAAAWZml4ZWRfc2VuaW9yX3lpZWxkX2JwcwAAAAAABAAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAGEZlZVN0cnVjdHVyZUNoYW5nZWRFdmVudAAAAAQAAAAAAAAAFWZyb250X2xvYWRpbmdfZmVlX2JwcwAAAAAAAAQAAAAAAAAAFmZyb250X2xvYWRpbmdfZmVlX2ZsYXQAAAAAAAoAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAFEFkbWluUm5SQ2hhbmdlZEV2ZW50AAAABAAAAAAAAAARZWFfbGlxdWlkaXR5X3JhdGUAAAAAAAAEAAAAAAAAAA5lYV9yZXdhcmRfcmF0ZQAAAAAABAAAAAAAAAAZcG9vbF9vd25lcl9saXF1aWRpdHlfcmF0ZQAAAAAAAAQAAAAAAAAAFnBvb2xfb3duZXJfcmV3YXJkX3JhdGUAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAAFFBvb2xOYW1lQ2hhbmdlZEV2ZW50AAAAAQAAAAAAAAAEbmFtZQAAABA=",
        "AAAAAQAAAAAAAAAAAAAAHVByb3RvY29sUmV3YXJkc1dpdGhkcmF3bkV2ZW50AAAAAAAAAgAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAAAAAAhyZWNlaXZlcgAAABM=",
        "AAAAAQAAAAAAAAAAAAAAGVBvb2xSZXdhcmRzV2l0aGRyYXduRXZlbnQAAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAoAAAAAAAAACHJlY2VpdmVyAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAJEV2YWx1YXRpb25BZ2VudFJld2FyZHNXaXRoZHJhd25FdmVudAAAAAIAAAAAAAAABmFtb3VudAAAAAAACgAAAAAAAAAIcmVjZWl2ZXIAAAAT",
        "AAAAAgAAAAAAAAAAAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAwAAAAAAAAAAAAAAB01vbnRobHkAAAAAAAAAAAAAAAAJUXVhcnRlcmx5AAAAAAAAAAAAAAAAAAAMU2VtaUFubnVhbGx5",
        "AAAABAAAAAAAAAAAAAAADUNhbGVuZGFyRXJyb3IAAAAAAAABAAAAAAAAABlTdGFydERhdGVMYXRlclRoYW5FbmREYXRlAAAAAAAAZQ==",
        "AAAABAAAAAAAAAAAAAAAC0NvbW1vbkVycm9yAAAAAAUAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAdUHJvdG9jb2xJc1BhdXNlZE9yUG9vbElzTm90T24AAAAAAAACAAAAAAAAACBBdXRob3JpemVkQ29udHJhY3RDYWxsZXJSZXF1aXJlZAAAAAMAAAAAAAAAE1Vuc3VwcG9ydGVkRnVuY3Rpb24AAAAABAAAAAAAAAASWmVyb0Ftb3VudFByb3ZpZGVkAAAAAAAF",
        "AAAAAgAAAAAAAAAAAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAgAAAAAAAAAAAAAAEEZpeGVkU2VuaW9yWWllbGQAAAAAAAAAAAAAAAxSaXNrQWRqdXN0ZWQ=",
        "AAAAAQAAAAAAAAAAAAAADFBvb2xTZXR0aW5ncwAAAAYAAAAAAAAAGWRlZmF1bHRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAAEAAAAAAAAAB5sYXRlX3BheW1lbnRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAACExQQ29uZmlnAAAABQAAAAAAAAAWZml4ZWRfc2VuaW9yX3lpZWxkX2JwcwAAAAAABAAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQ=",
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
