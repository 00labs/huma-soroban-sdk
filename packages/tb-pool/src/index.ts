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
    contractId: "CAOYBU6OQWAF3OZBHW5N6ID7TPAKZBJ27XR63IGTXMWEI3NSNTCYI6SH",
  },
} as const;

export interface HumaConfigChangedEvent {
  huma_config: string;
}

export interface PoolAddressesChangedEvent {
  credit: string;
  credit_manager: string;
  pool_storage: string;
}

export type ClientDataKey =
  | { tag: "HumaConfig"; values: void }
  | { tag: "PoolStorage"; values: void }
  | { tag: "Credit"; values: void }
  | { tag: "CreditManager"; values: void };

export interface ProfitDistributedEvent {
  junior_total_assets: u128;
  profit: u128;
  senior_total_assets: u128;
}

export interface LossDistributedEvent {
  junior_total_assets: u128;
  junior_total_loss: u128;
  loss: u128;
  senior_total_assets: u128;
  senior_total_loss: u128;
}

export interface LossRecoveryDistributedEvent {
  junior_total_assets: u128;
  junior_total_loss: u128;
  loss_recovery: u128;
  senior_total_assets: u128;
  senior_total_loss: u128;
}

export interface TrancheLosses {
  losses: Array<u128>;
}

export interface AccruedIncomes {
  ea_income: u128;
  pool_owner_income: u128;
  protocol_income: u128;
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

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    {
      huma_config,
      pool_storage,
      credit_manager,
      credit,
    }: {
      huma_config: string;
      pool_storage: string;
      credit_manager: string;
      credit: string;
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
      credit,
      credit_manager,
    }: {
      caller: string;
      pool_storage: string;
      credit: string;
      credit_manager: string;
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
   * Construct and simulate a distribute_profit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distribute_profit: (
    { caller, profit }: { caller: string; profit: u128 },
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
   * Construct and simulate a distribute_loss transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distribute_loss: (
    { caller, loss }: { caller: string; loss: u128 },
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
   * Construct and simulate a distribute_loss_recovery transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  distribute_loss_recovery: (
    { caller, loss_recovery }: { caller: string; loss_recovery: u128 },
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
   * Construct and simulate a get_protocol_income_accrued transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_protocol_income_accrued: (options?: {
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
   * Construct and simulate a get_pool_owner_income_accrued transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_pool_owner_income_accrued: (options?: {
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
   * Construct and simulate a get_ea_income_accrued transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_ea_income_accrued: (options?: {
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
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAQAAAAAAAAAAAAAAFkh1bWFDb25maWdDaGFuZ2VkRXZlbnQAAAAAAAEAAAAAAAAAC2h1bWFfY29uZmlnAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAGVBvb2xBZGRyZXNzZXNDaGFuZ2VkRXZlbnQAAAAAAAADAAAAAAAAAAZjcmVkaXQAAAAAABMAAAAAAAAADmNyZWRpdF9tYW5hZ2VyAAAAAAATAAAAAAAAAAxwb29sX3N0b3JhZ2UAAAAT",
        "AAAAAgAAAAAAAAAAAAAADUNsaWVudERhdGFLZXkAAAAAAAAEAAAAAAAAAAAAAAAKSHVtYUNvbmZpZwAAAAAAAAAAAAAAAAALUG9vbFN0b3JhZ2UAAAAAAAAAAAAAAAAGQ3JlZGl0AAAAAAAAAAAAAAAAAA1DcmVkaXRNYW5hZ2VyAAAA",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAALaHVtYV9jb25maWcAAAAAEwAAAAAAAAAMcG9vbF9zdG9yYWdlAAAAEwAAAAAAAAAOY3JlZGl0X21hbmFnZXIAAAAAABMAAAAAAAAABmNyZWRpdAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAPc2V0X2h1bWFfY29uZmlnAAAAAAEAAAAAAAAAC2h1bWFfY29uZmlnAAAAABMAAAAA",
        "AAAAAAAAAAAAAAASc2V0X2NvbnRyYWN0X2FkZHJzAAAAAAAEAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAADHBvb2xfc3RvcmFnZQAAABMAAAAAAAAABmNyZWRpdAAAAAAAEwAAAAAAAAAOY3JlZGl0X21hbmFnZXIAAAAAABMAAAAA",
        "AAAAAAAAAAAAAAARZGlzdHJpYnV0ZV9wcm9maXQAAAAAAAACAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABnByb2ZpdAAAAAAACgAAAAA=",
        "AAAAAAAAAAAAAAAPZGlzdHJpYnV0ZV9sb3NzAAAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAEbG9zcwAAAAoAAAAA",
        "AAAAAAAAAAAAAAAYZGlzdHJpYnV0ZV9sb3NzX3JlY292ZXJ5AAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAA1sb3NzX3JlY292ZXJ5AAAAAAAACgAAAAA=",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAbZ2V0X3Byb3RvY29sX2luY29tZV9hY2NydWVkAAAAAAAAAAABAAAACg==",
        "AAAAAAAAAAAAAAAdZ2V0X3Bvb2xfb3duZXJfaW5jb21lX2FjY3J1ZWQAAAAAAAAAAAAAAQAAAAo=",
        "AAAAAAAAAAAAAAAVZ2V0X2VhX2luY29tZV9hY2NydWVkAAAAAAAAAAAAAAEAAAAK",
        "AAAAAQAAAAAAAAAAAAAAFlByb2ZpdERpc3RyaWJ1dGVkRXZlbnQAAAAAAAMAAAAAAAAAE2p1bmlvcl90b3RhbF9hc3NldHMAAAAACgAAAAAAAAAGcHJvZml0AAAAAAAKAAAAAAAAABNzZW5pb3JfdG90YWxfYXNzZXRzAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAAFExvc3NEaXN0cmlidXRlZEV2ZW50AAAABQAAAAAAAAATanVuaW9yX3RvdGFsX2Fzc2V0cwAAAAAKAAAAAAAAABFqdW5pb3JfdG90YWxfbG9zcwAAAAAAAAoAAAAAAAAABGxvc3MAAAAKAAAAAAAAABNzZW5pb3JfdG90YWxfYXNzZXRzAAAAAAoAAAAAAAAAEXNlbmlvcl90b3RhbF9sb3NzAAAAAAAACg==",
        "AAAAAQAAAAAAAAAAAAAAHExvc3NSZWNvdmVyeURpc3RyaWJ1dGVkRXZlbnQAAAAFAAAAAAAAABNqdW5pb3JfdG90YWxfYXNzZXRzAAAAAAoAAAAAAAAAEWp1bmlvcl90b3RhbF9sb3NzAAAAAAAACgAAAAAAAAANbG9zc19yZWNvdmVyeQAAAAAAAAoAAAAAAAAAE3Nlbmlvcl90b3RhbF9hc3NldHMAAAAACgAAAAAAAAARc2VuaW9yX3RvdGFsX2xvc3MAAAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAADVRyYW5jaGVMb3NzZXMAAAAAAAABAAAAAAAAAAZsb3NzZXMAAAAAA+oAAAAK",
        "AAAAAQAAAAAAAAAAAAAADkFjY3J1ZWRJbmNvbWVzAAAAAAADAAAAAAAAAAllYV9pbmNvbWUAAAAAAAAKAAAAAAAAABFwb29sX293bmVyX2luY29tZQAAAAAAAAoAAAAAAAAAD3Byb3RvY29sX2luY29tZQAAAAAK",
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
      ]),
      options
    );
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
    set_huma_config: this.txFromJSON<null>,
    set_contract_addrs: this.txFromJSON<null>,
    distribute_profit: this.txFromJSON<null>,
    distribute_loss: this.txFromJSON<null>,
    distribute_loss_recovery: this.txFromJSON<null>,
    upgrade: this.txFromJSON<null>,
    get_protocol_income_accrued: this.txFromJSON<u128>,
    get_pool_owner_income_accrued: this.txFromJSON<u128>,
    get_ea_income_accrued: this.txFromJSON<u128>,
  };
}
