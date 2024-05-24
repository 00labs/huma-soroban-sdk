import { ContractSpec, Address } from '@stellar/stellar-sdk'
import { Buffer } from 'buffer'
import {
  AssembledTransaction,
  ContractClient,
  ContractClientOptions,
} from '@stellar/stellar-sdk/lib/contract_client/index.js'
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
} from '@stellar/stellar-sdk/lib/contract_client'
import { Result } from '@stellar/stellar-sdk/lib/rust_types/index.js'
export * from '@stellar/stellar-sdk'
export * from '@stellar/stellar-sdk/lib/contract_client/index.js'
export * from '@stellar/stellar-sdk/lib/rust_types/index.js'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer
}

export const networks = {
  testnet: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractId: 'CC7TGDDRSA2R7F6RIW3POEZSH22RG7DYNZX6GY2YGQ2O33E5BZWSMPDT',
  },
} as const

export type ClientDataKey =
  | { tag: 'HumaConfig'; values: void }
  | { tag: 'PoolStorage'; values: void }
  | { tag: 'Pool'; values: void }

/**
 * Event indicating that a new epoch has started.
 * # Fields:
 * * `epoch_id` - The ID of the epoch that just started.
 * * `end_time` - The time when the current epoch should end.
 */
export interface NewEpochStartedEvent {
  end_time: u64
  epoch_id: u64
}

/**
 * Event indicating that the current epoch has closed.
 * # Fields:
 * * `epoch_id` - The ID of the epoch that just closed.
 */
export interface EpochClosedEvent {
  epoch_id: u64
}

/**
 * Event indicating that the epoch has been processed after the pool is closed.
 * # Fields:
 * * `epoch_id` - The ID of the epoch that has been processed.
 */
export interface EpochProcessedAfterPoolClosureEvent {
  epoch_id: u64
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
  junior_tranche_assets: u128
  junior_tranche_price: u128
  senior_tranche_assets: u128
  senior_tranche_price: u128
  unprocessed_amount: u128
}

export const Errors = {
  1: { message: '' },
  72: { message: '' },
  21: { message: '' },
  101: { message: '' },
  301: { message: '' },
  54: { message: '' },
  302: { message: '' },
  91: { message: '' },
  92: { message: '' },
  93: { message: '' },
  53: { message: '' },
}

/**
 * Event indicating that the pool has been enabled.
 * # Fields:
 * * `by` - The address that enabled the pool.
 */
export interface PoolEnabledEvent {
  by: string
}

/**
 * Event indicating that the pool has been disabled.
 * # Fields:
 * * `by` - The address that disabled the pool.
 */
export interface PoolDisabledEvent {
  by: string
}

/**
 * Event indicating that the pool has been closed.
 * # Fields:
 * * `by` - The address that closed the pool.
 */
export interface PoolClosedEvent {
  by: string
}

export type PayPeriodDuration =
  | { tag: 'Monthly'; values: void }
  | { tag: 'Quarterly'; values: void }
  | { tag: 'SemiAnnually'; values: void }

export interface PoolSettings {
  default_grace_period_days: u32
  late_payment_grace_period_days: u32
  max_credit_line: u128
  min_deposit_amount: u128
  pay_period_duration: PayPeriodDuration
  principal_only_payment_allowed: boolean
}

export interface LPConfig {
  fixed_senior_yield_bps: u32
  liquidity_cap: u128
  max_senior_junior_ratio: u32
  tranches_risk_adjustment_bps: u32
  withdrawal_lockout_period_days: u32
}

export interface FeeStructure {
  front_loading_fee_bps: u32
  front_loading_fee_flat: u128
  late_fee_bps: u32
  yield_bps: u32
}

export type PoolStatus =
  | { tag: 'Off'; values: void }
  | { tag: 'On'; values: void }
  | { tag: 'Closed'; values: void }

export interface CurrentEpoch {
  end_time: u64
  id: u64
}

export interface AdminRnR {
  liquidity_rate_bps_ea: u32
  liquidity_rate_bps_pool_owner: u32
  reward_rate_bps_ea: u32
  reward_rate_bps_pool_owner: u32
}

export interface TrancheAddresses {
  addrs: Array<Option<string>>
}

export interface TrancheAssets {
  assets: Array<u128>
}

export interface EpochRedemptionSummary {
  epoch_id: u64
  total_amount_processed: u128
  total_shares_processed: u128
  total_shares_requested: u128
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
      pool_name: string
      huma_config: string
      pool_storage: string
      pool: string
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool: (
    { caller, pool }: { caller: string; pool: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_pool_storage transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_storage: (
    { caller, addr }: { caller: string; addr: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_huma_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_huma_config: (
    { huma_config }: { huma_config: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_pool_name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_name: (
    { caller, name }: { caller: string; name: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_admins transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admins: (
    {
      caller,
      pool_owner,
      pool_owner_treasury,
      ea,
    }: {
      caller: string
      pool_owner: string
      pool_owner_treasury: string
      ea: string
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

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
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

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
      caller: string
      pool_owner_reward_rate: u32
      pool_owner_liquidity_rate: u32
      ea_reward_rate: u32
      ea_liquidity_rate: u32
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

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
      caller: string
      max_credit_line: u128
      min_deposit_amount: u128
      pay_period_duration: PayPeriodDuration
      late_payment_grace_period_days: u32
      default_grace_period_days: u32
      principal_only_payment_allowed: boolean
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

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
      caller: string
      liquidity_cap: u128
      max_senior_junior_ratio: u32
      fixed_senior_yield_bps: u32
      tranches_risk_adjustment_bps: u32
      withdrawal_lockout_period_days: u32
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

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
      caller: string
      yield_bps: u32
      late_fee_bps: u32
      front_loading_fee_flat: u128
      front_loading_fee_bps: u32
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a add_pool_operator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_pool_operator: (
    { addr }: { addr: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a remove_pool_operator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_pool_operator: (
    { addr }: { addr: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a enable_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  enable_pool: (
    { caller }: { caller: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a disable_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  disable_pool: (
    { caller }: { caller: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a close_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  close_pool: (
    { caller }: { caller: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a close_epoch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  close_epoch: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a withdraw_protocol_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_protocol_fees: (
    { amount }: { amount: u128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a withdraw_pool_owner_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_pool_owner_fees: (
    { amount }: { amount: u128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a withdraw_ea_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_ea_fees: (
    { caller, amount }: { caller: string; amount: u128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<null>>
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        'AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAADAAAAAAAAAAAAAAAKSHVtYUNvbmZpZwAAAAAAAAAAAAAAAAALUG9vbFN0b3JhZ2UAAAAAAAAAAAAAAAAEUG9vbA==',
        'AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAJcG9vbF9uYW1lAAAAAAAAEAAAAAAAAAALaHVtYV9jb25maWcAAAAAEwAAAAAAAAAMcG9vbF9zdG9yYWdlAAAAEwAAAAAAAAAEcG9vbAAAABMAAAAA',
        'AAAAAAAAAAAAAAAIc2V0X3Bvb2wAAAACAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABHBvb2wAAAATAAAAAA==',
        'AAAAAAAAAAAAAAAQc2V0X3Bvb2xfc3RvcmFnZQAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEYWRkcgAAABMAAAAA',
        'AAAAAAAAAAAAAAAPc2V0X2h1bWFfY29uZmlnAAAAAAEAAAAAAAAAC2h1bWFfY29uZmlnAAAAABMAAAAA',
        'AAAAAAAAAAAAAAANc2V0X3Bvb2xfbmFtZQAAAAAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEbmFtZQAAABAAAAAA',
        'AAAAAAAAAAAAAAAKc2V0X2FkbWlucwAAAAAABAAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAApwb29sX293bmVyAAAAAAATAAAAAAAAABNwb29sX293bmVyX3RyZWFzdXJ5AAAAABMAAAAAAAAAAmVhAAAAAAATAAAAAA==',
        'AAAAAAAAAAAAAAAVc2V0X3RyYW5jaGVfYWRkcmVzc2VzAAAAAAAAAwAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAtqdW5pb3JfYWRkcgAAAAATAAAAAAAAAAtzZW5pb3JfYWRkcgAAAAPoAAAAEwAAAAA=',
        'AAAAAAAAAAAAAAANc2V0X2FkbWluX3JucgAAAAAAAAUAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAWcG9vbF9vd25lcl9yZXdhcmRfcmF0ZQAAAAAABAAAAAAAAAAZcG9vbF9vd25lcl9saXF1aWRpdHlfcmF0ZQAAAAAAAAQAAAAAAAAADmVhX3Jld2FyZF9yYXRlAAAAAAAEAAAAAAAAABFlYV9saXF1aWRpdHlfcmF0ZQAAAAAAAAQAAAAA',
        'AAAAAAAAAAAAAAARc2V0X3Bvb2xfc2V0dGluZ3MAAAAAAAAHAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAebGF0ZV9wYXltZW50X2dyYWNlX3BlcmlvZF9kYXlzAAAAAAAEAAAAAAAAABlkZWZhdWx0X2dyYWNlX3BlcmlvZF9kYXlzAAAAAAAABAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAABAAAAAA==',
        'AAAAAAAAAAAAAAANc2V0X2xwX2NvbmZpZwAAAAAAAAYAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAFmZpeGVkX3Nlbmlvcl95aWVsZF9icHMAAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQAAAAA',
        'AAAAAAAAAAAAAAARc2V0X2ZlZV9zdHJ1Y3R1cmUAAAAAAAAFAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAAAAAAFmZyb250X2xvYWRpbmdfZmVlX2ZsYXQAAAAAAAoAAAAAAAAAFWZyb250X2xvYWRpbmdfZmVlX2JwcwAAAAAAAAQAAAAA',
        'AAAAAAAAAAAAAAARYWRkX3Bvb2xfb3BlcmF0b3IAAAAAAAABAAAAAAAAAARhZGRyAAAAEwAAAAA=',
        'AAAAAAAAAAAAAAAUcmVtb3ZlX3Bvb2xfb3BlcmF0b3IAAAABAAAAAAAAAARhZGRyAAAAEwAAAAA=',
        'AAAAAAAAAAAAAAALZW5hYmxlX3Bvb2wAAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==',
        'AAAAAAAAAAAAAAAMZGlzYWJsZV9wb29sAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==',
        'AAAAAAAAAAAAAAAKY2xvc2VfcG9vbAAAAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==',
        'AAAAAAAAAAAAAAALY2xvc2VfZXBvY2gAAAAAAAAAAAA=',
        'AAAAAAAAAAAAAAAWd2l0aGRyYXdfcHJvdG9jb2xfZmVlcwAAAAAAAQAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAA==',
        'AAAAAAAAAAAAAAAYd2l0aGRyYXdfcG9vbF9vd25lcl9mZWVzAAAAAQAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAA==',
        'AAAAAAAAAAAAAAAQd2l0aGRyYXdfZWFfZmVlcwAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAA==',
        'AAAAAQAAAKlFdmVudCBpbmRpY2F0aW5nIHRoYXQgYSBuZXcgZXBvY2ggaGFzIHN0YXJ0ZWQuCiMgRmllbGRzOgoqIGBlcG9jaF9pZGAgLSBUaGUgSUQgb2YgdGhlIGVwb2NoIHRoYXQganVzdCBzdGFydGVkLgoqIGBlbmRfdGltZWAgLSBUaGUgdGltZSB3aGVuIHRoZSBjdXJyZW50IGVwb2NoIHNob3VsZCBlbmQuAAAAAAAAAAAAABROZXdFcG9jaFN0YXJ0ZWRFdmVudAAAAAIAAAAAAAAACGVuZF90aW1lAAAABgAAAAAAAAAIZXBvY2hfaWQAAAAG',
        'AAAAAQAAAHJFdmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIGN1cnJlbnQgZXBvY2ggaGFzIGNsb3NlZC4KIyBGaWVsZHM6CiogYGVwb2NoX2lkYCAtIFRoZSBJRCBvZiB0aGUgZXBvY2ggdGhhdCBqdXN0IGNsb3NlZC4AAAAAAAAAAAAQRXBvY2hDbG9zZWRFdmVudAAAAAEAAAAAAAAACGVwb2NoX2lkAAAABg==',
        'AAAAAQAAAJJFdmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIGVwb2NoIGhhcyBiZWVuIHByb2Nlc3NlZCBhZnRlciB0aGUgcG9vbCBpcyBjbG9zZWQuCiMgRmllbGRzOgoqIGBlcG9jaF9pZGAgLSBUaGUgSUQgb2YgdGhlIGVwb2NoIHRoYXQgaGFzIGJlZW4gcHJvY2Vzc2VkLgAAAAAAAAAAACNFcG9jaFByb2Nlc3NlZEFmdGVyUG9vbENsb3N1cmVFdmVudAAAAAABAAAAAAAAAAhlcG9jaF9pZAAAAAY=',
        'AAAAAQAAAdBFdmVudCBpbmRpY2F0aW5nIHRoYXQgcGVuZGluZyByZWRlbXB0aW9uIHJlcXVlc3RzIGhhdmUgYmVlbiBwcm9jZXNzZWQuCiMgRmllbGRzOgoqIGBzZW5pb3JfdHJhbmNoZV9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBhc3NldHMgaW4gdGhlIHNlbmlvciB0cmFuY2hlLgoqIGBzZW5pb3JfdHJhbmNoZV9wcmljZWAgLSBUaGUgTFAgdG9rZW4gcHJpY2Ugb2YgdGhlIHNlbmlvciB0cmFuY2hlLgoqIGBqdW5pb3JfdHJhbmNoZV9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBhc3NldHMgaW4gdGhlIGp1bmlvciB0cmFuY2hlLgoqIGBqdW5pb3JfdHJhbmNoZV9wcmljZWAgLSBUaGUgTFAgdG9rZW4gcHJpY2Ugb2YgdGhlIGp1bmlvciB0cmFuY2hlLgoqIGB1bnByb2Nlc3NlZF9hbW91bnRgIC0gVGhlIGFtb3VudCBvZiBhc3NldHMgcmVxdWVzdGVkIGZvciByZWRlbXB0aW9uIGJ1dCBub3QgZnVsZmlsbGVkLgAAAAAAAAAgUmVkZW1wdGlvblJlcXVlc3RzUHJvY2Vzc2VkRXZlbnQAAAAFAAAAAAAAABVqdW5pb3JfdHJhbmNoZV9hc3NldHMAAAAAAAAKAAAAAAAAABRqdW5pb3JfdHJhbmNoZV9wcmljZQAAAAoAAAAAAAAAFXNlbmlvcl90cmFuY2hlX2Fzc2V0cwAAAAAAAAoAAAAAAAAAFHNlbmlvcl90cmFuY2hlX3ByaWNlAAAACgAAAAAAAAASdW5wcm9jZXNzZWRfYW1vdW50AAAAAAAK',
        'AAAABAAAAAAAAAAAAAAAEFBvb2xNYW5hZ2VyRXJyb3IAAAALAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAHFBvb2xPd25lck9ySHVtYU93bmVyUmVxdWlyZWQAAABIAAAAAAAAABRQb29sT3BlcmF0b3JSZXF1aXJlZAAAABUAAAAAAAAAHVByb3RvY29sSXNQYXVzZWRPclBvb2xJc05vdE9uAAAAAAAAZQAAAAAAAAATRXBvY2hDbG9zZWRUb29FYXJseQAAAAEtAAAAAAAAABxJbnN1ZmZpY2llbnRBbW91bnRGb3JSZXF1ZXN0AAAANgAAAAAAAAAVUG9vbE93bmVyT3JFQVJlcXVpcmVkAAAAAAABLgAAAAAAAAAWQWRtaW5SZXdhcmRSYXRlVG9vSGlnaAAAAAAAWwAAAAAAAAAWTWluRGVwb3NpdEFtb3VudFRvb0xvdwAAAAAAXAAAAAAAAAAdTGF0ZVBheW1lbnRHcmFjZVBlcmlvZFRvb0xvbmcAAAAAAABdAAAAAAAAACBJbnZhbGlkQmFzaXNQb2ludEhpZ2hlclRoYW4xMDAwMAAAADU=',
        'AAAAAQAAAGZFdmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIHBvb2wgaGFzIGJlZW4gZW5hYmxlZC4KIyBGaWVsZHM6CiogYGJ5YCAtIFRoZSBhZGRyZXNzIHRoYXQgZW5hYmxlZCB0aGUgcG9vbC4AAAAAAAAAAAAQUG9vbEVuYWJsZWRFdmVudAAAAAEAAAAAAAAAAmJ5AAAAAAAT',
        'AAAAAQAAAGhFdmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIHBvb2wgaGFzIGJlZW4gZGlzYWJsZWQuCiMgRmllbGRzOgoqIGBieWAgLSBUaGUgYWRkcmVzcyB0aGF0IGRpc2FibGVkIHRoZSBwb29sLgAAAAAAAAARUG9vbERpc2FibGVkRXZlbnQAAAAAAAABAAAAAAAAAAJieQAAAAAAEw==',
        'AAAAAQAAAGRFdmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIHBvb2wgaGFzIGJlZW4gY2xvc2VkLgojIEZpZWxkczoKKiBgYnlgIC0gVGhlIGFkZHJlc3MgdGhhdCBjbG9zZWQgdGhlIHBvb2wuAAAAAAAAAA9Qb29sQ2xvc2VkRXZlbnQAAAAAAQAAAAAAAAACYnkAAAAAABM=',
        'AAAAAgAAAAAAAAAAAAAAEVBheVBlcmlvZER1cmF0aW9uAAAAAAAAAwAAAAAAAAAAAAAAB01vbnRobHkAAAAAAAAAAAAAAAAJUXVhcnRlcmx5AAAAAAAAAAAAAAAAAAAMU2VtaUFubnVhbGx5',
        'AAAABAAAAAAAAAAAAAAADUNhbGVuZGFyRXJyb3IAAAAAAAABAAAAAAAAABlTdGFydERhdGVMYXRlclRoYW5FbmREYXRlAAAAAAAAZQ==',
        'AAAABAAAAAAAAAAAAAAAC0NvbW1vbkVycm9yAAAAAAIAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAgQXV0aG9yaXplZENvbnRyYWN0Q2FsbGVyUmVxdWlyZWQAAABP',
        'AAAAAQAAAAAAAAAAAAAADFBvb2xTZXR0aW5ncwAAAAYAAAAAAAAAGWRlZmF1bHRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAAEAAAAAAAAAB5sYXRlX3BheW1lbnRfZ3JhY2VfcGVyaW9kX2RheXMAAAAAAAQAAAAAAAAAD21heF9jcmVkaXRfbGluZQAAAAAKAAAAAAAAABJtaW5fZGVwb3NpdF9hbW91bnQAAAAAAAoAAAAAAAAAE3BheV9wZXJpb2RfZHVyYXRpb24AAAAH0AAAABFQYXlQZXJpb2REdXJhdGlvbgAAAAAAAAAAAAAecHJpbmNpcGFsX29ubHlfcGF5bWVudF9hbGxvd2VkAAAAAAAB',
        'AAAAAQAAAAAAAAAAAAAACExQQ29uZmlnAAAABQAAAAAAAAAWZml4ZWRfc2VuaW9yX3lpZWxkX2JwcwAAAAAABAAAAAAAAAANbGlxdWlkaXR5X2NhcAAAAAAAAAoAAAAAAAAAF21heF9zZW5pb3JfanVuaW9yX3JhdGlvAAAAAAQAAAAAAAAAHHRyYW5jaGVzX3Jpc2tfYWRqdXN0bWVudF9icHMAAAAEAAAAAAAAAB53aXRoZHJhd2FsX2xvY2tvdXRfcGVyaW9kX2RheXMAAAAAAAQ=',
        'AAAAAQAAAAAAAAAAAAAADEZlZVN0cnVjdHVyZQAAAAQAAAAAAAAAFWZyb250X2xvYWRpbmdfZmVlX2JwcwAAAAAAAAQAAAAAAAAAFmZyb250X2xvYWRpbmdfZmVlX2ZsYXQAAAAAAAoAAAAAAAAADGxhdGVfZmVlX2JwcwAAAAQAAAAAAAAACXlpZWxkX2JwcwAAAAAAAAQ=',
        'AAAAAgAAAAAAAAAAAAAAClBvb2xTdGF0dXMAAAAAAAMAAAAAAAAAAAAAAANPZmYAAAAAAAAAAAAAAAACT24AAAAAAAAAAAAAAAAABkNsb3NlZAAA',
        'AAAAAQAAAAAAAAAAAAAADEN1cnJlbnRFcG9jaAAAAAIAAAAAAAAACGVuZF90aW1lAAAABgAAAAAAAAACaWQAAAAAAAY=',
        'AAAAAQAAAAAAAAAAAAAACEFkbWluUm5SAAAABAAAAAAAAAAVbGlxdWlkaXR5X3JhdGVfYnBzX2VhAAAAAAAABAAAAAAAAAAdbGlxdWlkaXR5X3JhdGVfYnBzX3Bvb2xfb3duZXIAAAAAAAAEAAAAAAAAABJyZXdhcmRfcmF0ZV9icHNfZWEAAAAAAAQAAAAAAAAAGnJld2FyZF9yYXRlX2Jwc19wb29sX293bmVyAAAAAAAE',
        'AAAAAQAAAAAAAAAAAAAAEFRyYW5jaGVBZGRyZXNzZXMAAAABAAAAAAAAAAVhZGRycwAAAAAAA+oAAAPoAAAAEw==',
        'AAAAAQAAAAAAAAAAAAAADVRyYW5jaGVBc3NldHMAAAAAAAABAAAAAAAAAAZhc3NldHMAAAAAA+oAAAAK',
        'AAAAAQAAAAAAAAAAAAAAFkVwb2NoUmVkZW1wdGlvblN1bW1hcnkAAAAAAAQAAAAAAAAACGVwb2NoX2lkAAAABgAAAAAAAAAWdG90YWxfYW1vdW50X3Byb2Nlc3NlZAAAAAAACgAAAAAAAAAWdG90YWxfc2hhcmVzX3Byb2Nlc3NlZAAAAAAACgAAAAAAAAAWdG90YWxfc2hhcmVzX3JlcXVlc3RlZAAAAAAACg==',
      ]),
      options,
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    set_pool: this.txFromJSON<null>,
    set_pool_storage: this.txFromJSON<null>,
    set_huma_config: this.txFromJSON<null>,
    set_pool_name: this.txFromJSON<null>,
    set_admins: this.txFromJSON<null>,
    set_tranche_addresses: this.txFromJSON<null>,
    set_admin_rnr: this.txFromJSON<null>,
    set_pool_settings: this.txFromJSON<null>,
    set_lp_config: this.txFromJSON<null>,
    set_fee_structure: this.txFromJSON<null>,
    add_pool_operator: this.txFromJSON<null>,
    remove_pool_operator: this.txFromJSON<null>,
    enable_pool: this.txFromJSON<null>,
    disable_pool: this.txFromJSON<null>,
    close_pool: this.txFromJSON<null>,
    close_epoch: this.txFromJSON<null>,
    withdraw_protocol_fees: this.txFromJSON<null>,
    withdraw_pool_owner_fees: this.txFromJSON<null>,
    withdraw_ea_fees: this.txFromJSON<null>,
  }
}
