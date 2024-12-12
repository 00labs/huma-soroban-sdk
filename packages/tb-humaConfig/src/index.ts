import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
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
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAMYYWFQOTFGWVGPT5R4TIGS56SDQPXJ6K37KLKOBA4G3ZLPMPPBW67K",
  }
} as const

export const Errors = {
  101: {message:"PauserRequired"},

  102: {message:"ProtocolFeeHigherThanUpperLimit"},

  103: {message:"InvalidNumberOfDecimalsForLiquidityAsset"},

  1: {message:"AlreadyInitialized"},

  2: {message:"ProtocolIsPausedOrPoolIsNotOn"},

  3: {message:"PoolOwnerOrHumaOwnerRequired"},

  4: {message:"PoolOperatorRequired"},

  5: {message:"AuthorizedContractCallerRequired"},

  6: {message:"UnsupportedFunction"},

  7: {message:"ZeroAmountProvided"}
}
export type HumaConfigDataKey = {tag: "HumaOwner", values: void} | {tag: "HumaTreasury", values: void} | {tag: "Sentinel", values: void} | {tag: "ProtocolFeeBps", values: void} | {tag: "IsPaused", values: void} | {tag: "Pauser", values: readonly [string]} | {tag: "ValidLiquidityAsset", values: readonly [string]};


export interface ProtocolInitializedEvent {
  huma_owner: string;
  huma_treasury: string;
  sentinel: string;
}


export interface HumaOwnerChangedEvent {
  huma_owner: string;
}


export interface ProtocolPausedEvent {
  paused: boolean;
}


export interface ProtocolUnpausedEvent {
  paused: boolean;
}


export interface HumaTreasuryChangedEvent {
  treasury: string;
}


export interface PauserAddedEvent {
  pauser: string;
}


export interface PauserRemovedEvent {
  pauser: string;
}


export interface LiquidityAssetAddedEvent {
  asset: string;
}


export interface LiquidityAssetRemovedEvent {
  asset: string;
}


export interface SentinelServiceAccountChangedEvent {
  account: string;
}


export interface ProtocolFeeChangedEvent {
  new_fee_bps: u32;
  old_fee_bps: u32;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({huma_owner, huma_treasury, sentinel}: {huma_owner: string, huma_treasury: string, sentinel: string}, options?: {
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
   * Construct and simulate a set_huma_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_huma_owner: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a set_huma_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_huma_treasury: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a set_sentinel transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_sentinel: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a set_liquidity_asset transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_liquidity_asset: ({addr, valid}: {addr: string, valid: boolean}, options?: {
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
   * Construct and simulate a set_protocol_fee_bps transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_protocol_fee_bps: ({fee_bps}: {fee_bps: u32}, options?: {
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
   * Construct and simulate a pause_protocol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pause_protocol: ({caller}: {caller: string}, options?: {
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
   * Construct and simulate a unpause_protocol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unpause_protocol: (options?: {
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
   * Construct and simulate a add_pauser transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_pauser: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a remove_pauser transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_pauser: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: ({new_wasm_hash}: {new_wasm_hash: Buffer}, options?: {
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
   * Construct and simulate a get_huma_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_huma_owner: (options?: {
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
   * Construct and simulate a get_huma_treasury transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_huma_treasury: (options?: {
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
   * Construct and simulate a get_protocol_fee_bps transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_protocol_fee_bps: (options?: {
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
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a is_pauser transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_pauser: ({addr}: {addr: string}, options?: {
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
   * Construct and simulate a is_protocol_paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_protocol_paused: (options?: {
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
   * Construct and simulate a is_asset_valid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_asset_valid: ({addr}: {addr: string}, options?: {
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

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAKaHVtYV9vd25lcgAAAAAAEwAAAAAAAAANaHVtYV90cmVhc3VyeQAAAAAAABMAAAAAAAAACHNlbnRpbmVsAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAOc2V0X2h1bWFfb3duZXIAAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAARc2V0X2h1bWFfdHJlYXN1cnkAAAAAAAABAAAAAAAAAARhZGRyAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAMc2V0X3NlbnRpbmVsAAAAAQAAAAAAAAAEYWRkcgAAABMAAAAA",
        "AAAAAAAAAAAAAAATc2V0X2xpcXVpZGl0eV9hc3NldAAAAAACAAAAAAAAAARhZGRyAAAAEwAAAAAAAAAFdmFsaWQAAAAAAAABAAAAAA==",
        "AAAAAAAAAAAAAAAUc2V0X3Byb3RvY29sX2ZlZV9icHMAAAABAAAAAAAAAAdmZWVfYnBzAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAOcGF1c2VfcHJvdG9jb2wAAAAAAAEAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAQdW5wYXVzZV9wcm90b2NvbAAAAAAAAAAA",
        "AAAAAAAAAAAAAAAKYWRkX3BhdXNlcgAAAAAAAQAAAAAAAAAEYWRkcgAAABMAAAAA",
        "AAAAAAAAAAAAAAANcmVtb3ZlX3BhdXNlcgAAAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAOZ2V0X2h1bWFfb3duZXIAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAARZ2V0X2h1bWFfdHJlYXN1cnkAAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAMZ2V0X3NlbnRpbmVsAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAUZ2V0X3Byb3RvY29sX2ZlZV9icHMAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAAJaXNfcGF1c2VyAAAAAAAAAQAAAAAAAAAEYWRkcgAAABMAAAABAAAAAQ==",
        "AAAAAAAAAAAAAAASaXNfcHJvdG9jb2xfcGF1c2VkAAAAAAAAAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAOaXNfYXNzZXRfdmFsaWQAAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAQAAAAE=",
        "AAAABAAAAAAAAAAAAAAAD0h1bWFDb25maWdFcnJvcgAAAAADAAAAAAAAAA5QYXVzZXJSZXF1aXJlZAAAAAAAZQAAAAAAAAAfUHJvdG9jb2xGZWVIaWdoZXJUaGFuVXBwZXJMaW1pdAAAAABmAAAAAAAAAChJbnZhbGlkTnVtYmVyT2ZEZWNpbWFsc0ZvckxpcXVpZGl0eUFzc2V0AAAAZw==",
        "AAAAAgAAAAAAAAAAAAAAEUh1bWFDb25maWdEYXRhS2V5AAAAAAAABwAAAAAAAAAAAAAACUh1bWFPd25lcgAAAAAAAAAAAAAAAAAADEh1bWFUcmVhc3VyeQAAAAAAAAAAAAAACFNlbnRpbmVsAAAAAAAAAAAAAAAOUHJvdG9jb2xGZWVCcHMAAAAAAAAAAAAAAAAACElzUGF1c2VkAAAAAQAAAAAAAAAGUGF1c2VyAAAAAAABAAAAEwAAAAEAAAAAAAAAE1ZhbGlkTGlxdWlkaXR5QXNzZXQAAAAAAQAAABM=",
        "AAAAAQAAAAAAAAAAAAAAGFByb3RvY29sSW5pdGlhbGl6ZWRFdmVudAAAAAMAAAAAAAAACmh1bWFfb3duZXIAAAAAABMAAAAAAAAADWh1bWFfdHJlYXN1cnkAAAAAAAATAAAAAAAAAAhzZW50aW5lbAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAFUh1bWFPd25lckNoYW5nZWRFdmVudAAAAAAAAAEAAAAAAAAACmh1bWFfb3duZXIAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAE1Byb3RvY29sUGF1c2VkRXZlbnQAAAAAAQAAAAAAAAAGcGF1c2VkAAAAAAAB",
        "AAAAAQAAAAAAAAAAAAAAFVByb3RvY29sVW5wYXVzZWRFdmVudAAAAAAAAAEAAAAAAAAABnBhdXNlZAAAAAAAAQ==",
        "AAAAAQAAAAAAAAAAAAAAGEh1bWFUcmVhc3VyeUNoYW5nZWRFdmVudAAAAAEAAAAAAAAACHRyZWFzdXJ5AAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAEFBhdXNlckFkZGVkRXZlbnQAAAABAAAAAAAAAAZwYXVzZXIAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAElBhdXNlclJlbW92ZWRFdmVudAAAAAAAAQAAAAAAAAAGcGF1c2VyAAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAAGExpcXVpZGl0eUFzc2V0QWRkZWRFdmVudAAAAAEAAAAAAAAABWFzc2V0AAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAGkxpcXVpZGl0eUFzc2V0UmVtb3ZlZEV2ZW50AAAAAAABAAAAAAAAAAVhc3NldAAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAIlNlbnRpbmVsU2VydmljZUFjY291bnRDaGFuZ2VkRXZlbnQAAAAAAAEAAAAAAAAAB2FjY291bnQAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAF1Byb3RvY29sRmVlQ2hhbmdlZEV2ZW50AAAAAAIAAAAAAAAAC25ld19mZWVfYnBzAAAAAAQAAAAAAAAAC29sZF9mZWVfYnBzAAAAAAQ=",
        "AAAABAAAAAAAAAAAAAAAC0NvbW1vbkVycm9yAAAAAAcAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAAdUHJvdG9jb2xJc1BhdXNlZE9yUG9vbElzTm90T24AAAAAAAACAAAAAAAAABxQb29sT3duZXJPckh1bWFPd25lclJlcXVpcmVkAAAAAwAAAAAAAAAUUG9vbE9wZXJhdG9yUmVxdWlyZWQAAAAEAAAAAAAAACBBdXRob3JpemVkQ29udHJhY3RDYWxsZXJSZXF1aXJlZAAAAAUAAAAAAAAAE1Vuc3VwcG9ydGVkRnVuY3Rpb24AAAAABgAAAAAAAAASWmVyb0Ftb3VudFByb3ZpZGVkAAAAAAAH" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        set_huma_owner: this.txFromJSON<null>,
        set_huma_treasury: this.txFromJSON<null>,
        set_sentinel: this.txFromJSON<null>,
        set_liquidity_asset: this.txFromJSON<null>,
        set_protocol_fee_bps: this.txFromJSON<null>,
        pause_protocol: this.txFromJSON<null>,
        unpause_protocol: this.txFromJSON<null>,
        add_pauser: this.txFromJSON<null>,
        remove_pauser: this.txFromJSON<null>,
        upgrade: this.txFromJSON<null>,
        get_huma_owner: this.txFromJSON<string>,
        get_huma_treasury: this.txFromJSON<string>,
        get_sentinel: this.txFromJSON<string>,
        get_protocol_fee_bps: this.txFromJSON<u32>,
        is_pauser: this.txFromJSON<boolean>,
        is_protocol_paused: this.txFromJSON<boolean>,
        is_asset_valid: this.txFromJSON<boolean>
  }
}
