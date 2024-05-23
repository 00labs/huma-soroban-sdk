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
    contractId: "CAKPKH2G3ALGKW2E5BJFUJ6WR3RXJVGIXEAPVI5S6Q4HKSDCMKEYJSBR",
  }
} as const

export const Errors = {
  8: {message:""},
  1: {message:""},
  96: {message:""},
  97: {message:""},
  79: {message:""}
}
export type PayPeriodDuration = {tag: "Monthly", values: void} | {tag: "Quarterly", values: void} | {tag: "SemiAnnually", values: void};

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

export type PoolStatus = {tag: "Off", values: void} | {tag: "On", values: void} | {tag: "Closed", values: void};


export interface CurrentEpoch {
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
  initialize: ({addrs, protocol_on, pool_status, tranche_addrs}: {addrs: Array<string>, protocol_on: boolean, pool_status: PoolStatus, tranche_addrs: Array<Option<string>>}, options?: {
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
   * Construct and simulate a set_pool_manager transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_manager: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a set_huma_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_huma_config: ({huma_config, huma_owner, sentinel, protocol_on}: {huma_config: string, huma_owner: string, sentinel: string, protocol_on: boolean}, options?: {
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
   * Construct and simulate a set_admins transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admins: ({pool_owner, pool_owner_treasury, ea}: {pool_owner: string, pool_owner_treasury: string, ea: string}, options?: {
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
   * Construct and simulate a set_tranche_addresses transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_tranche_addresses: ({junior_addr, senior_addr}: {junior_addr: string, senior_addr: Option<string>}, options?: {
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
   * Construct and simulate a set_pool_operator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_operator: ({addr, is_operator}: {addr: string, is_operator: boolean}, options?: {
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
   * Construct and simulate a set_pool_status transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_status: ({status}: {status: PoolStatus}, options?: {
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
   * Construct and simulate a set_epoch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_epoch: ({epoch}: {epoch: CurrentEpoch}, options?: {
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
   * Construct and simulate a set_admin_rnr transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin_rnr: ({pool_owner_reward_rate, pool_owner_liquidity_rate, ea_reward_rate, ea_liquidity_rate}: {pool_owner_reward_rate: u32, pool_owner_liquidity_rate: u32, ea_reward_rate: u32, ea_liquidity_rate: u32}, options?: {
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
   * Construct and simulate a set_pool_settings transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_settings: ({max_credit_line, min_deposit_amount, pay_period_duration, late_payment_grace_period_days, default_grace_period_days, principal_only_payment_allowed}: {max_credit_line: u128, min_deposit_amount: u128, pay_period_duration: PayPeriodDuration, late_payment_grace_period_days: u32, default_grace_period_days: u32, principal_only_payment_allowed: boolean}, options?: {
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
   * Construct and simulate a set_lp_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_lp_config: ({liquidity_cap, max_senior_junior_ratio, fixed_senior_yield_bps, tranches_risk_adjustment_bps, withdrawal_lockout_period_days}: {liquidity_cap: u128, max_senior_junior_ratio: u32, fixed_senior_yield_bps: u32, tranches_risk_adjustment_bps: u32, withdrawal_lockout_period_days: u32}, options?: {
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
   * Construct and simulate a set_fee_structure transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_fee_structure: ({yield_bps, late_fee_bps, front_loading_fee_flat, front_loading_fee_bps}: {yield_bps: u32, late_fee_bps: u32, front_loading_fee_flat: u128, front_loading_fee_bps: u32}, options?: {
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
   * Construct and simulate a send_tokens transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  send_tokens: ({to, amount, caller}: {to: string, amount: u128, caller: string}, options?: {
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
   * Construct and simulate a add_tranche_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_tranche_assets: ({addr, amount}: {addr: string, amount: u128}, options?: {
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
   * Construct and simulate a reduce_tranche_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  reduce_tranche_assets: ({addr, amount}: {addr: string, amount: u128}, options?: {
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
   * Construct and simulate a update_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_assets: ({junior_assets, senior_assets}: {junior_assets: u128, senior_assets: u128}, options?: {
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
   * Construct and simulate a get_pool_settings transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pool_settings: (options?: {
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
  }) => Promise<AssembledTransaction<PoolSettings>>

  /**
   * Construct and simulate a get_lp_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_lp_config: (options?: {
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
  }) => Promise<AssembledTransaction<LPConfig>>

  /**
   * Construct and simulate a get_fee_structure transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_fee_structure: (options?: {
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
  }) => Promise<AssembledTransaction<FeeStructure>>

  /**
   * Construct and simulate a get_admin_rnr transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin_rnr: (options?: {
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
  }) => Promise<AssembledTransaction<AdminRnR>>

  /**
   * Construct and simulate a pool_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pool_owner: (options?: {
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
   * Construct and simulate a is_pool_owner_or_huma_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_pool_owner_or_huma_owner: ({addr}: {addr: string}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a is_pool_operator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_pool_operator: ({addr}: {addr: string}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a is_protocol_and_pool_on transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_protocol_and_pool_on: (options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_evaluation_agent transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_evaluation_agent: (options?: {
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
   * Construct and simulate a get_sentinel transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_sentinel: (options?: {
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
   * Construct and simulate a pool_owner_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pool_owner_treasury: (options?: {
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
   * Construct and simulate a get_pool_status transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pool_status: (options?: {
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
  }) => Promise<AssembledTransaction<PoolStatus>>

  /**
   * Construct and simulate a get_current_epoch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_current_epoch: (options?: {
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
  }) => Promise<AssembledTransaction<CurrentEpoch>>

  /**
   * Construct and simulate a get_tranche_assets_by_addr transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_assets_by_addr: ({addr}: {addr: string}, options?: {
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
  }) => Promise<AssembledTransaction<u128>>

  /**
   * Construct and simulate a get_tranche_assets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_assets: (options?: {
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
  }) => Promise<AssembledTransaction<TrancheAssets>>

  /**
   * Construct and simulate a get_tranche_addresses transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tranche_addresses: (options?: {
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
  }) => Promise<AssembledTransaction<TrancheAddresses>>

  /**
   * Construct and simulate a check_liquidity_requirements transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  check_liquidity_requirements: ({lender, tranche_vault, balance}: {lender: string, tranche_vault: string, balance: u128}, options?: {
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
   * Construct and simulate a get_underlying_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_underlying_token: (options?: {
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
   * Construct and simulate a get_available_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_available_balance: (options?: {
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
  }) => Promise<AssembledTransaction<u128>>

  /**
   * Construct and simulate a reduce_admin_fees_reserve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  reduce_admin_fees_reserve: ({caller, amount, increase}: {caller: string, amount: u128, increase: boolean}, options?: {
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

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAFYWRkcnMAAAAAAAPqAAAAEwAAAAAAAAALcHJvdG9jb2xfb24AAAAAAQAAAAAAAAALcG9vbF9zdGF0dXMAAAAH0AAAAApQb29sU3RhdHVzAAAAAAAAAAAADXRyYW5jaGVfYWRkcnMAAAAAAAPqAAAD6AAAABMAAAAA",
        "AAAAAAAAAAAAAAAQc2V0X3Bvb2xfbWFuYWdlcgAAAAEAAAAAAAAABGFkZHIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAPc2V0X2h1bWFfY29uZmlnAAAAAAQAAAAAAAAAC2h1bWFfY29uZmlnAAAAABMAAAAAAAAACmh1bWFfb3duZXIAAAAAABMAAAAAAAAACHNlbnRpbmVsAAAAEwAAAAAAAAALcHJvdG9jb2xfb24AAAAAAQAAAAA=",
        "AAAAAAAAAAAAAAAKc2V0X2FkbWlucwAAAAAAAwAAAAAAAAAKcG9vbF9vd25lcgAAAAAAEwAAAAAAAAATcG9vbF9vd25lcl90cmVhc3VyeQAAAAATAAAAAAAAAAJlYQAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAVc2V0X3RyYW5jaGVfYWRkcmVzc2VzAAAAAAAAAgAAAAAAAAALanVuaW9yX2FkZHIAAAAAEwAAAAAAAAALc2VuaW9yX2FkZHIAAAAD6AAAABMAAAAA",
        "AAAAAAAAAAAAAAARc2V0X3Bvb2xfb3BlcmF0b3IAAAAAAAACAAAAAAAAAARhZGRyAAAAEwAAAAAAAAALaXNfb3BlcmF0b3IAAAAAAQAAAAA=",
        "AAAAAAAAAAAAAAAPc2V0X3Bvb2xfc3RhdHVzAAAAAAEAAAAAAAAABnN0YXR1cwAAAAAH0AAAAApQb29sU3RhdHVzAAAAAAAA",
        "AAAAAAAAAAAAAAAJc2V0X2Vwb2NoAAAAAAAAAQAAAAAAAAAFZXBvY2gAAAAAAAfQAAAADEN1cnJlbnRFcG9jaAAAAAA=",
        "AAAAAAAAAAAAAAANc2V0X2FkbWluX3JucgAAAAAAAAQAAAAAAAAAFnBvb2xfb3duZXJfcmV3YXJkX3JhdGUAAAAAAAQAAAAAAAAAGXBvb2xfb3duZXJfbGlxdWlkaXR5X3JhdGUAAAAAAAAEAAAAAAAAAA5lYV9yZXdhcmRfcmF0ZQAAAAAABAAAAAAAAAARZWFfbGlxdWlkaXR5X3JhdGUAAAAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAARc2V0X3Bvb2xfc2V0dGluZ3MAAAAAAAAGAAAAAAAAAA9tYXhfY3JlZGl0X2xpbmUAAAAACgAAAAAAAAASbWluX2RlcG9zaXRfYW1vdW50AAAAAAAKAAAAAAAAABNwYXlfcGVyaW9kX2R1cmF0aW9uAAAAB9AAAAARUGF5UGVyaW9kRHVyYXRpb24AAAAAAAAAAAAAHmxhdGVfcGF5bWVudF9ncmFjZV9wZXJpb2RfZGF5cwAAAAAABAAAAAAAAAAZZGVmYXVsdF9ncmFjZV9wZXJpb2RfZGF5cwAAAAAAAAQAAAAAAAAAHnByaW5jaXBhbF9vbmx5X3BheW1lbnRfYWxsb3dlZAAAAAAAAQAAAAA=",
        "AAAAAAAAAAAAAAANc2V0X2xwX2NvbmZpZwAAAAAAAAUAAAAAAAAADWxpcXVpZGl0eV9jYXAAAAAAAAAKAAAAAAAAABdtYXhfc2VuaW9yX2p1bmlvcl9yYXRpbwAAAAAEAAAAAAAAABZmaXhlZF9zZW5pb3JfeWllbGRfYnBzAAAAAAAEAAAAAAAAABx0cmFuY2hlc19yaXNrX2FkanVzdG1lbnRfYnBzAAAABAAAAAAAAAAed2l0aGRyYXdhbF9sb2Nrb3V0X3BlcmlvZF9kYXlzAAAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAARc2V0X2ZlZV9zdHJ1Y3R1cmUAAAAAAAAEAAAAAAAAAAl5aWVsZF9icHMAAAAAAAAEAAAAAAAAAAxsYXRlX2ZlZV9icHMAAAAEAAAAAAAAABZmcm9udF9sb2FkaW5nX2ZlZV9mbGF0AAAAAAAKAAAAAAAAABVmcm9udF9sb2FkaW5nX2ZlZV9icHMAAAAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAALc2VuZF90b2tlbnMAAAAAAwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAASYWRkX3RyYW5jaGVfYXNzZXRzAAAAAAACAAAAAAAAAARhZGRyAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAA==",
        "AAAAAAAAAAAAAAAVcmVkdWNlX3RyYW5jaGVfYXNzZXRzAAAAAAAAAgAAAAAAAAAEYWRkcgAAABMAAAAAAAAABmFtb3VudAAAAAAACgAAAAA=",
        "AAAAAAAAAAAAAAANdXBkYXRlX2Fzc2V0cwAAAAAAAAIAAAAAAAAADWp1bmlvcl9hc3NldHMAAAAAAAAKAAAAAAAAAA1zZW5pb3JfYXNzZXRzAAAAAAAACgAAAAA=",
        "AAAAAAAAAAAAAAARZ2V0X3Bvb2xfc2V0dGluZ3MAAAAAAAAAAAAAAQAAB9AAAAAMUG9vbFNldHRpbmdz",
        "AAAAAAAAAAAAAAANZ2V0X2xwX2NvbmZpZwAAAAAAAAAAAAABAAAH0AAAAAhMUENvbmZpZw==",
        "AAAAAAAAAAAAAAARZ2V0X2ZlZV9zdHJ1Y3R1cmUAAAAAAAAAAAAAAQAAB9AAAAAMRmVlU3RydWN0dXJl",
        "AAAAAAAAAAAAAAANZ2V0X2FkbWluX3JucgAAAAAAAAAAAAABAAAH0AAAAAhBZG1pblJuUg==",
        "AAAAAAAAAAAAAAAKcG9vbF9vd25lcgAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAbaXNfcG9vbF9vd25lcl9vcl9odW1hX293bmVyAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAQaXNfcG9vbF9vcGVyYXRvcgAAAAEAAAAAAAAABGFkZHIAAAATAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAXaXNfcHJvdG9jb2xfYW5kX3Bvb2xfb24AAAAAAAAAAAEAAAAB",
        "AAAAAAAAAAAAAAAUZ2V0X2V2YWx1YXRpb25fYWdlbnQAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAMZ2V0X3NlbnRpbmVsAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAATcG9vbF9vd25lcl90cmVhc3VyeQAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAPZ2V0X3Bvb2xfc3RhdHVzAAAAAAAAAAABAAAH0AAAAApQb29sU3RhdHVzAAA=",
        "AAAAAAAAAAAAAAARZ2V0X2N1cnJlbnRfZXBvY2gAAAAAAAAAAAAAAQAAB9AAAAAMQ3VycmVudEVwb2No",
        "AAAAAAAAAAAAAAAaZ2V0X3RyYW5jaGVfYXNzZXRzX2J5X2FkZHIAAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAQAAAAo=",
        "AAAAAAAAAAAAAAASZ2V0X3RyYW5jaGVfYXNzZXRzAAAAAAAAAAAAAQAAB9AAAAANVHJhbmNoZUFzc2V0cwAAAA==",
        "AAAAAAAAAAAAAAAVZ2V0X3RyYW5jaGVfYWRkcmVzc2VzAAAAAAAAAAAAAAEAAAfQAAAAEFRyYW5jaGVBZGRyZXNzZXM=",
        "AAAAAAAAAAAAAAAcY2hlY2tfbGlxdWlkaXR5X3JlcXVpcmVtZW50cwAAAAMAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAAAAAANdHJhbmNoZV92YXVsdAAAAAAAABMAAAAAAAAAB2JhbGFuY2UAAAAACgAAAAA=",
        "AAAAAAAAAAAAAAAUZ2V0X3VuZGVybHlpbmdfdG9rZW4AAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAVZ2V0X2F2YWlsYWJsZV9iYWxhbmNlAAAAAAAAAAAAAAEAAAAK",
        "AAAAAAAAAAAAAAAZcmVkdWNlX2FkbWluX2ZlZXNfcmVzZXJ2ZQAAAAAAAAMAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAAAAAAhpbmNyZWFzZQAAAAEAAAAA",
        "AAAABAAAAAAAAAAAAAAAEFBvb2xTdG9yYWdlRXJyb3IAAAAFAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAgAAAAAAAAAFUludmFsaWRUcmFuY2hlQWRkcmVzcwAAAAAAAAEAAAAAAAAAHlBvb2xPd25lckluc3VmZmljaWVudExpcXVpZGl0eQAAAAAAYAAAAAAAAAAkRXZhbHVhdGlvbkFnZW50SW5zdWZmaWNpZW50TGlxdWlkaXR5AAAAYQAAAAAAAAAgQXV0aG9yaXplZENvbnRyYWN0Q2FsbGVyUmVxdWlyZWQAAABP",
        "AAAAAgAAAAAAAAAAAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAwAAAAAAAAAAAAAAB01vbnRobHkAAAAAAAAAAAAAAAAJUXVhcnRlcmx5AAAAAAAAAAAAAAAAAAAMU2VtaUFubnVhbGx5",
        "AAAABAAAAAAAAAAAAAAADUNhbGVuZGFyRXJyb3IAAAAAAAABAAAAAAAAABlTdGFydERhdGVMYXRlclRoYW5FbmREYXRlAAAAAAAAZQ==",
        "AAAABAAAAAAAAAAAAAAAC0NvbW1vbkVycm9yAAAAAAIAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAgQXV0aG9yaXplZENvbnRyYWN0Q2FsbGVyUmVxdWlyZWQAAABP",
        "AAAAAQAAAAAAAAAAAAAADFBvb2xTZXR0aW5ncwAAAAYAAAAAAAAAGWRlZmF1bHRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAAEAAAAAAAAAB5sYXRlX3BheW1lbnRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAACExQQ29uZmlnAAAABQAAAAAAAAAWZml4ZWRfc2VuaW9yX3lpZWxkX2JwcwAAAAAABAAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAADEZlZVN0cnVjdHVyZQAAAAQAAAAAAAAAFWZyb250X2xvYWRpbmdfZmVlX2JwcwAAAAAAAAQAAAAAAAAAFmZyb250X2xvYWRpbmdfZmVlX2ZsYXQAAAAAAAoAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=",
        "AAAAAgAAAAAAAAAAAAAAClBvb2xTdGF0dXMAAAAAAAMAAAAAAAAAAAAAAANPZmYAAAAAAAAAAAAAAAACT24AAAAAAAAAAAAAAAAABkNsb3NlZAAA",
        "AAAAAQAAAAAAAAAAAAAADEN1cnJlbnRFcG9jaAAAAAIAAAAAAAAACGVuZF90aW1lAAAABgAAAAAAAAACaWQAAAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAACEFkbWluUm5SAAAABAAAAAAAAAAVbGlxdWlkaXR5X3JhdGVfYnBzX2VhAAAAAAAABAAAAAAAAAAdbGlxdWlkaXR5X3JhdGVfYnBzX3Bvb2xfb3duZXIAAAAAAAAEAAAAAAAAABJyZXdhcmRfcmF0ZV9icHNfZWEAAAAAAAQAAAAAAAAAGnJld2FyZF9yYXRlX2Jwc19wb29sX293bmVyAAAAAAAE",
        "AAAAAQAAAAAAAAAAAAAAEFRyYW5jaGVBZGRyZXNzZXMAAAABAAAAAAAAAAVhZGRycwAAAAAAA+oAAAPoAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAADVRyYW5jaGVBc3NldHMAAAAAAAABAAAAAAAAAAZhc3NldHMAAAAAA+oAAAAK" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        set_pool_manager: this.txFromJSON<null>,
        set_huma_config: this.txFromJSON<null>,
        set_admins: this.txFromJSON<null>,
        set_tranche_addresses: this.txFromJSON<null>,
        set_pool_operator: this.txFromJSON<null>,
        set_pool_status: this.txFromJSON<null>,
        set_epoch: this.txFromJSON<null>,
        set_admin_rnr: this.txFromJSON<null>,
        set_pool_settings: this.txFromJSON<null>,
        set_lp_config: this.txFromJSON<null>,
        set_fee_structure: this.txFromJSON<null>,
        send_tokens: this.txFromJSON<null>,
        add_tranche_assets: this.txFromJSON<null>,
        reduce_tranche_assets: this.txFromJSON<null>,
        update_assets: this.txFromJSON<null>,
        get_pool_settings: this.txFromJSON<PoolSettings>,
        get_lp_config: this.txFromJSON<LPConfig>,
        get_fee_structure: this.txFromJSON<FeeStructure>,
        get_admin_rnr: this.txFromJSON<AdminRnR>,
        pool_owner: this.txFromJSON<string>,
        is_pool_owner_or_huma_owner: this.txFromJSON<boolean>,
        is_pool_operator: this.txFromJSON<boolean>,
        is_protocol_and_pool_on: this.txFromJSON<boolean>,
        get_evaluation_agent: this.txFromJSON<string>,
        get_sentinel: this.txFromJSON<string>,
        pool_owner_treasury: this.txFromJSON<string>,
        get_pool_status: this.txFromJSON<PoolStatus>,
        get_current_epoch: this.txFromJSON<CurrentEpoch>,
        get_tranche_assets_by_addr: this.txFromJSON<u128>,
        get_tranche_assets: this.txFromJSON<TrancheAssets>,
        get_tranche_addresses: this.txFromJSON<TrancheAddresses>,
        check_liquidity_requirements: this.txFromJSON<null>,
        get_underlying_token: this.txFromJSON<string>,
        get_available_balance: this.txFromJSON<u128>,
        reduce_admin_fees_reserve: this.txFromJSON<null>
  }
}