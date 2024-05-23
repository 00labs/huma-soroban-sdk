import { ContractSpec, Address } from '@stellar/stellar-sdk'
import { Buffer } from 'buffer'
import {
  AssembledTransaction,
  ContractClient,
  ContractClientOptions,
} from '@stellar/stellar-sdk/lib/contract_client'
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
import { Result } from '@stellar/stellar-sdk/lib/rust_types'
export * from '@stellar/stellar-sdk'
export * from '@stellar/stellar-sdk/lib/contract_client'
export * from '@stellar/stellar-sdk/lib/rust_types'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer
}

export const networks = {
  testnet: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractId: 'CC2GGLIHX5E75QIXB7G27EOC47V74PXA33KGYDQH4DFISIVZPWQRBVJV',
  },
} as const

export type ClientDataKey =
  | { tag: 'HumaConfig'; values: void }
  | { tag: 'PoolStorage'; values: void }
  | { tag: 'Credit'; values: void }
  | { tag: 'PoolManager'; values: void }

/**
 * Event for the distribution of profit in the pool.
 * # Fields:
 * * `profit` - The amount of profit distributed.
 * * `senior_total_assets` - The total amount of senior assets post profit distribution.
 * * `junior_total_assets` - The total amount of junior assets post profit distribution.
 */
export interface ProfitDistributedEvent {
  junior_total_assets: u128
  profit: u128
  senior_total_assets: u128
}

/**
 * Event for the distribution of loss in the pool.
 * # Fields:
 * * `loss` - The amount of loss distributed.
 * * `senior_total_assets` - The total amount of senior assets post loss distribution.
 * * `junior_total_assets` - The total amount of junior assets post loss distribution.
 * * `senior_total_loss` - The total amount of loss the senior tranche suffered post loss distribution.
 * * `junior_total_loss` - The total amount of loss the junior tranche suffered post loss distribution.
 */
export interface LossDistributedEvent {
  junior_total_assets: u128
  junior_total_loss: u128
  loss: u128
  senior_total_assets: u128
  senior_total_loss: u128
}

/**
 * Event for the distribution of loss recovery in the pool.
 * # Fields:
 * * `loss_recovery` - The amount of loss recovery distributed.
 * * `senior_total_assets` - The total amount of senior assets post loss recovery distribution.
 * * `junior_total_assets` - The total amount of junior assets post loss recovery distribution.
 * * `senior_total_loss` - The remaining amount of loss the senior tranche suffered post loss recovery distribution.
 * * `junior_total_loss` - The remaining amount of loss the junior tranche suffered post loss recovery distribution.
 */
export interface LossRecoveryDistributedEvent {
  junior_total_assets: u128
  junior_total_loss: u128
  loss_recovery: u128
  senior_total_assets: u128
  senior_total_loss: u128
}

export interface TranchesPolicyTypeChangedEvent {
  policy_type: TranchesPolicyType
}

/**
 * The senior yield tracker has been refreshed.
 * # Fields:
 * * `total_assets` - The total assets in the senior tranche after the refresh.
 * * `unpaid_yield` - The amount of unpaid yield to the senior tranche after the refresh.
 * * `last_updated_date` - The last time the tracker was updated after the refresh.
 */
export interface YieldTrackerRefreshedEvent {
  last_updated_date: u64
  total_assets: u128
  unpaid_yield: u128
}

export type FixedSeniorYieldTranchesPolicyDataKey = {
  tag: 'SeniorYieldTracker'
  values: void
}

export interface SeniorYieldTracker {
  last_updated_date: u64
  total_assets: u128
  unpaid_yield: u128
}

export interface FixedSeniorYieldTranchesPolicy {
  placeholder: boolean
}

export interface RiskAdjustedTranchesPolicy {
  placeholder: boolean
}

export type TranchesPolicyType =
  | { tag: 'FixedSeniorYield'; values: void }
  | { tag: 'RiskAdjusted'; values: void }

export interface TrancheLosses {
  losses: Array<u128>
}

export interface AccruedIncomes {
  ea_income: u128
  pool_owner_income: u128
  protocol_income: u128
}

export type PayPeriodDuration =
  | { tag: 'Monthly'; values: void }
  | { tag: 'Quarterly'; values: void }
  | { tag: 'SemiAnnually'; values: void }

export const Errors = {
  101: { message: '' },
}

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

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    {
      huma_config,
      pool_manager,
      pool_storage,
      credit,
      tranches_policy,
    }: {
      huma_config: string
      pool_manager: string
      pool_storage: string
      credit: string
      tranches_policy: TranchesPolicyType
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
   * Construct and simulate a set_huma_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_huma_config: (
    { addr, caller }: { addr: string; caller: string },
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
    { addr, caller }: { addr: string; caller: string },
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
   * Construct and simulate a set_credit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_credit: (
    { addr, caller }: { addr: string; caller: string },
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
   * Construct and simulate a set_pool_manager transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_pool_manager: (
    { addr, caller }: { addr: string; caller: string },
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
   * Construct and simulate a distribute_profit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distribute_profit: (
    { profit }: { profit: u128 },
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
   * Construct and simulate a distribute_loss transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distribute_loss: (
    { loss }: { loss: u128 },
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
   * Construct and simulate a distribute_loss_recovery transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distribute_loss_recovery: (
    { loss_recovery }: { loss_recovery: u128 },
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
   * Construct and simulate a get_protocol_income_accrued transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_protocol_income_accrued: (options?: {
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
  }) => Promise<AssembledTransaction<u128>>

  /**
   * Construct and simulate a get_pool_owner_income_accrued transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pool_owner_income_accrued: (options?: {
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
  }) => Promise<AssembledTransaction<u128>>

  /**
   * Construct and simulate a get_ea_income_accrued transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_ea_income_accrued: (options?: {
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
  }) => Promise<AssembledTransaction<u128>>
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        'AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAAEAAAAAAAAAAAAAAAKSHVtYUNvbmZpZwAAAAAAAAAAAAAAAAALUG9vbFN0b3JhZ2UAAAAAAAAAAAAAAAAGQ3JlZGl0AAAAAAAAAAAAAAAAAAtQb29sTWFuYWdlcgA=',
        'AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABQAAAAAAAAALaHVtYV9jb25maWcAAAAAEwAAAAAAAAAMcG9vbF9tYW5hZ2VyAAAAEwAAAAAAAAAMcG9vbF9zdG9yYWdlAAAAEwAAAAAAAAAGY3JlZGl0AAAAAAATAAAAAAAAAA90cmFuY2hlc19wb2xpY3kAAAAH0AAAABJUcmFuY2hlc1BvbGljeVR5cGUAAAAAAAA=',
        'AAAAAAAAAAAAAAAPc2V0X2h1bWFfY29uZmlnAAAAAAIAAAAAAAAABGFkZHIAAAATAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAA',
        'AAAAAAAAAAAAAAAQc2V0X3Bvb2xfc3RvcmFnZQAAAAIAAAAAAAAABGFkZHIAAAATAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAA',
        'AAAAAAAAAAAAAAAKc2V0X2NyZWRpdAAAAAAAAgAAAAAAAAAEYWRkcgAAABMAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAA=',
        'AAAAAAAAAAAAAAAQc2V0X3Bvb2xfbWFuYWdlcgAAAAIAAAAAAAAABGFkZHIAAAATAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAA',
        'AAAAAAAAAAAAAAAYc2V0X3RyYW5jaGVzX3BvbGljeV90eXBlAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAtwb2xpY3lfdHlwZQAAAAfQAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAA==',
        'AAAAAAAAAAAAAAARZGlzdHJpYnV0ZV9wcm9maXQAAAAAAAABAAAAAAAAAAZwcm9maXQAAAAAAAoAAAAA',
        'AAAAAAAAAAAAAAAPZGlzdHJpYnV0ZV9sb3NzAAAAAAEAAAAAAAAABGxvc3MAAAAKAAAAAA==',
        'AAAAAAAAAAAAAAAYZGlzdHJpYnV0ZV9sb3NzX3JlY292ZXJ5AAAAAQAAAAAAAAANbG9zc19yZWNvdmVyeQAAAAAAAAoAAAAA',
        'AAAAAAAAAAAAAAAbZ2V0X3Byb3RvY29sX2luY29tZV9hY2NydWVkAAAAAAAAAAABAAAACg==',
        'AAAAAAAAAAAAAAAdZ2V0X3Bvb2xfb3duZXJfaW5jb21lX2FjY3J1ZWQAAAAAAAAAAAAAAQAAAAo=',
        'AAAAAAAAAAAAAAAVZ2V0X2VhX2luY29tZV9hY2NydWVkAAAAAAAAAAAAAAEAAAAK',
        'AAAAAQAAARZFdmVudCBmb3IgdGhlIGRpc3RyaWJ1dGlvbiBvZiBwcm9maXQgaW4gdGhlIHBvb2wuCiMgRmllbGRzOgoqIGBwcm9maXRgIC0gVGhlIGFtb3VudCBvZiBwcm9maXQgZGlzdHJpYnV0ZWQuCiogYHNlbmlvcl90b3RhbF9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBzZW5pb3IgYXNzZXRzIHBvc3QgcHJvZml0IGRpc3RyaWJ1dGlvbi4KKiBganVuaW9yX3RvdGFsX2Fzc2V0c2AgLSBUaGUgdG90YWwgYW1vdW50IG9mIGp1bmlvciBhc3NldHMgcG9zdCBwcm9maXQgZGlzdHJpYnV0aW9uLgAAAAAAAAAAABZQcm9maXREaXN0cmlidXRlZEV2ZW50AAAAAAADAAAAAAAAABNqdW5pb3JfdG90YWxfYXNzZXRzAAAAAAoAAAAAAAAABnByb2ZpdAAAAAAACgAAAAAAAAATc2VuaW9yX3RvdGFsX2Fzc2V0cwAAAAAK',
        'AAAAAQAAAdZFdmVudCBmb3IgdGhlIGRpc3RyaWJ1dGlvbiBvZiBsb3NzIGluIHRoZSBwb29sLgojIEZpZWxkczoKKiBgbG9zc2AgLSBUaGUgYW1vdW50IG9mIGxvc3MgZGlzdHJpYnV0ZWQuCiogYHNlbmlvcl90b3RhbF9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBzZW5pb3IgYXNzZXRzIHBvc3QgbG9zcyBkaXN0cmlidXRpb24uCiogYGp1bmlvcl90b3RhbF9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBqdW5pb3IgYXNzZXRzIHBvc3QgbG9zcyBkaXN0cmlidXRpb24uCiogYHNlbmlvcl90b3RhbF9sb3NzYCAtIFRoZSB0b3RhbCBhbW91bnQgb2YgbG9zcyB0aGUgc2VuaW9yIHRyYW5jaGUgc3VmZmVyZWQgcG9zdCBsb3NzIGRpc3RyaWJ1dGlvbi4KKiBganVuaW9yX3RvdGFsX2xvc3NgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBsb3NzIHRoZSBqdW5pb3IgdHJhbmNoZSBzdWZmZXJlZCBwb3N0IGxvc3MgZGlzdHJpYnV0aW9uLgAAAAAAAAAAABRMb3NzRGlzdHJpYnV0ZWRFdmVudAAAAAUAAAAAAAAAE2p1bmlvcl90b3RhbF9hc3NldHMAAAAACgAAAAAAAAARanVuaW9yX3RvdGFsX2xvc3MAAAAAAAAKAAAAAAAAAARsb3NzAAAACgAAAAAAAAATc2VuaW9yX3RvdGFsX2Fzc2V0cwAAAAAKAAAAAAAAABFzZW5pb3JfdG90YWxfbG9zcwAAAAAAAAo=',
        'AAAAAQAAAh1FdmVudCBmb3IgdGhlIGRpc3RyaWJ1dGlvbiBvZiBsb3NzIHJlY292ZXJ5IGluIHRoZSBwb29sLgojIEZpZWxkczoKKiBgbG9zc19yZWNvdmVyeWAgLSBUaGUgYW1vdW50IG9mIGxvc3MgcmVjb3ZlcnkgZGlzdHJpYnV0ZWQuCiogYHNlbmlvcl90b3RhbF9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBzZW5pb3IgYXNzZXRzIHBvc3QgbG9zcyByZWNvdmVyeSBkaXN0cmlidXRpb24uCiogYGp1bmlvcl90b3RhbF9hc3NldHNgIC0gVGhlIHRvdGFsIGFtb3VudCBvZiBqdW5pb3IgYXNzZXRzIHBvc3QgbG9zcyByZWNvdmVyeSBkaXN0cmlidXRpb24uCiogYHNlbmlvcl90b3RhbF9sb3NzYCAtIFRoZSByZW1haW5pbmcgYW1vdW50IG9mIGxvc3MgdGhlIHNlbmlvciB0cmFuY2hlIHN1ZmZlcmVkIHBvc3QgbG9zcyByZWNvdmVyeSBkaXN0cmlidXRpb24uCiogYGp1bmlvcl90b3RhbF9sb3NzYCAtIFRoZSByZW1haW5pbmcgYW1vdW50IG9mIGxvc3MgdGhlIGp1bmlvciB0cmFuY2hlIHN1ZmZlcmVkIHBvc3QgbG9zcyByZWNvdmVyeSBkaXN0cmlidXRpb24uAAAAAAAAAAAAABxMb3NzUmVjb3ZlcnlEaXN0cmlidXRlZEV2ZW50AAAABQAAAAAAAAATanVuaW9yX3RvdGFsX2Fzc2V0cwAAAAAKAAAAAAAAABFqdW5pb3JfdG90YWxfbG9zcwAAAAAAAAoAAAAAAAAADWxvc3NfcmVjb3ZlcnkAAAAAAAAKAAAAAAAAABNzZW5pb3JfdG90YWxfYXNzZXRzAAAAAAoAAAAAAAAAEXNlbmlvcl90b3RhbF9sb3NzAAAAAAAACg==',
        'AAAAAQAAAAAAAAAAAAAAHlRyYW5jaGVzUG9saWN5VHlwZUNoYW5nZWRFdmVudAAAAAAAAQAAAAAAAAALcG9saWN5X3R5cGUAAAAH0AAAABJUcmFuY2hlc1BvbGljeVR5cGUAAA==',
        'AAAAAQAAAStUaGUgc2VuaW9yIHlpZWxkIHRyYWNrZXIgaGFzIGJlZW4gcmVmcmVzaGVkLgojIEZpZWxkczoKKiBgdG90YWxfYXNzZXRzYCAtIFRoZSB0b3RhbCBhc3NldHMgaW4gdGhlIHNlbmlvciB0cmFuY2hlIGFmdGVyIHRoZSByZWZyZXNoLgoqIGB1bnBhaWRfeWllbGRgIC0gVGhlIGFtb3VudCBvZiB1bnBhaWQgeWllbGQgdG8gdGhlIHNlbmlvciB0cmFuY2hlIGFmdGVyIHRoZSByZWZyZXNoLgoqIGBsYXN0X3VwZGF0ZWRfZGF0ZWAgLSBUaGUgbGFzdCB0aW1lIHRoZSB0cmFja2VyIHdhcyB1cGRhdGVkIGFmdGVyIHRoZSByZWZyZXNoLgAAAAAAAAAAGllpZWxkVHJhY2tlclJlZnJlc2hlZEV2ZW50AAAAAAADAAAAAAAAABFsYXN0X3VwZGF0ZWRfZGF0ZQAAAAAAAAYAAAAAAAAADHRvdGFsX2Fzc2V0cwAAAAoAAAAAAAAADHVucGFpZF95aWVsZAAAAAo=',
        'AAAAAgAAAAAAAAAAAAAAJUZpeGVkU2VuaW9yWWllbGRUcmFuY2hlc1BvbGljeURhdGFLZXkAAAAAAAABAAAAAAAAAAAAAAASU2VuaW9yWWllbGRUcmFja2VyAAA=',
        'AAAAAQAAAAAAAAAAAAAAElNlbmlvcllpZWxkVHJhY2tlcgAAAAAAAwAAAAAAAAARbGFzdF91cGRhdGVkX2RhdGUAAAAAAAAGAAAAAAAAAAx0b3RhbF9hc3NldHMAAAAKAAAAAAAAAAx1bnBhaWRfeWllbGQAAAAK',
        'AAAAAQAAAAAAAAAAAAAAHkZpeGVkU2VuaW9yWWllbGRUcmFuY2hlc1BvbGljeQAAAAAAAQAAAAAAAAALcGxhY2Vob2xkZXIAAAAAAQ==',
        'AAAAAQAAAAAAAAAAAAAAGlJpc2tBZGp1c3RlZFRyYW5jaGVzUG9saWN5AAAAAAABAAAAAAAAAAtwbGFjZWhvbGRlcgAAAAAB',
        'AAAAAgAAAAAAAAAAAAAAElRyYW5jaGVzUG9saWN5VHlwZQAAAAAAAgAAAAAAAAAAAAAAEEZpeGVkU2VuaW9yWWllbGQAAAAAAAAAAAAAAAxSaXNrQWRqdXN0ZWQ=',
        'AAAAAQAAAAAAAAAAAAAADVRyYW5jaGVMb3NzZXMAAAAAAAABAAAAAAAAAAZsb3NzZXMAAAAAA+oAAAAK',
        'AAAAAQAAAAAAAAAAAAAADkFjY3J1ZWRJbmNvbWVzAAAAAAADAAAAAAAAAAllYV9pbmNvbWUAAAAAAAAKAAAAAAAAABFwb29sX293bmVyX2luY29tZQAAAAAAAAoAAAAAAAAAD3Byb3RvY29sX2luY29tZQAAAAAK',
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
      ]),
      options,
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    set_huma_config: this.txFromJSON<null>,
    set_pool_storage: this.txFromJSON<null>,
    set_credit: this.txFromJSON<null>,
    set_pool_manager: this.txFromJSON<null>,
    set_tranches_policy_type: this.txFromJSON<null>,
    distribute_profit: this.txFromJSON<null>,
    distribute_loss: this.txFromJSON<null>,
    distribute_loss_recovery: this.txFromJSON<null>,
    get_protocol_income_accrued: this.txFromJSON<u128>,
    get_pool_owner_income_accrued: this.txFromJSON<u128>,
    get_ea_income_accrued: this.txFromJSON<u128>,
  }
}
