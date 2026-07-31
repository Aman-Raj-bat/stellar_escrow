import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
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
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export type DataKey = {tag: "Escrow", values: readonly [u64]};


export interface Escrow {
  amount: i128;
  client: string;
  freelancer: string;
  id: u64;
  status: EscrowStatus;
  token: string;
}

export type EscrowStatus = {tag: "Created", values: void} | {tag: "Funded", values: void} | {tag: "Accepted", values: void} | {tag: "Released", values: void} | {tag: "Refunded", values: void};

export const Errors = {
  1: {message:"NotAuthorized"},
  2: {message:"EscrowNotFound"},
  3: {message:"InvalidStatus"},
  4: {message:"AmountTooLow"},
  5: {message:"TransferFailed"}
}

export interface Client {
  /**
   * Construct and simulate a accept transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Freelancer accepts the escrow, agreeing to start work.
   */
  accept: ({escrow_id}: {escrow_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a refund transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Freelancer refunds the client, returning funds to the client.
   */
  refund: ({escrow_id}: {escrow_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deposits funds into the escrow contract, moving it from `Created` to `Funded`.
   */
  deposit: ({escrow_id}: {escrow_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a release transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Client releases funds to the freelancer after work is completed.
   */
  release: ({escrow_id}: {escrow_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_escrow transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Queries the status and details of an escrow
   */
  get_escrow: ({escrow_id}: {escrow_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Escrow>>>

  /**
   * Construct and simulate a init_escrow transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initializes a new escrow agreement.
   */
  init_escrow: ({id, client, freelancer, amount, token}: {id: u64, client: string, freelancer: string, amount: i128, token: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAABkVzY3JvdwAAAAAAAQAAAAY=",
        "AAAAAAAAADZGcmVlbGFuY2VyIGFjY2VwdHMgdGhlIGVzY3JvdywgYWdyZWVpbmcgdG8gc3RhcnQgd29yay4AAAAAAAZhY2NlcHQAAAAAAAEAAAAAAAAACWVzY3Jvd19pZAAAAAAAAAYAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAD1GcmVlbGFuY2VyIHJlZnVuZHMgdGhlIGNsaWVudCwgcmV0dXJuaW5nIGZ1bmRzIHRvIHRoZSBjbGllbnQuAAAAAAAABnJlZnVuZAAAAAAAAQAAAAAAAAAJZXNjcm93X2lkAAAAAAAABgAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAAE5EZXBvc2l0cyBmdW5kcyBpbnRvIHRoZSBlc2Nyb3cgY29udHJhY3QsIG1vdmluZyBpdCBmcm9tIGBDcmVhdGVkYCB0byBgRnVuZGVkYC4AAAAAAAdkZXBvc2l0AAAAAAEAAAAAAAAACWVzY3Jvd19pZAAAAAAAAAYAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAAEBDbGllbnQgcmVsZWFzZXMgZnVuZHMgdG8gdGhlIGZyZWVsYW5jZXIgYWZ0ZXIgd29yayBpcyBjb21wbGV0ZWQuAAAAB3JlbGVhc2UAAAAAAQAAAAAAAAAJZXNjcm93X2lkAAAAAAAABgAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAACtRdWVyaWVzIHRoZSBzdGF0dXMgYW5kIGRldGFpbHMgb2YgYW4gZXNjcm93AAAAAApnZXRfZXNjcm93AAAAAAABAAAAAAAAAAllc2Nyb3dfaWQAAAAAAAAGAAAAAQAAA+kAAAfQAAAABkVzY3JvdwAAAAAAAw==",
        "AAAAAAAAACNJbml0aWFsaXplcyBhIG5ldyBlc2Nyb3cgYWdyZWVtZW50LgAAAAALaW5pdF9lc2Nyb3cAAAAABQAAAAAAAAACaWQAAAAAAAYAAAAAAAAABmNsaWVudAAAAAAAEwAAAAAAAAAKZnJlZWxhbmNlcgAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAD6QAAAAIAAAAD",
        "AAAAAQAAAAAAAAAAAAAABkVzY3JvdwAAAAAABgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAZjbGllbnQAAAAAABMAAAAAAAAACmZyZWVsYW5jZXIAAAAAABMAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAAMRXNjcm93U3RhdHVzAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAgAAAAAAAAAAAAAADEVzY3Jvd1N0YXR1cwAAAAUAAAAAAAAAAAAAAAdDcmVhdGVkAAAAAAAAAAAAAAAABkZ1bmRlZAAAAAAAAAAAAAAAAAAIQWNjZXB0ZWQAAAAAAAAAAAAAAAhSZWxlYXNlZAAAAAAAAAAAAAAACFJlZnVuZGVk",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABQAAAAAAAAANTm90QXV0aG9yaXplZAAAAAAAAAEAAAAAAAAADkVzY3Jvd05vdEZvdW5kAAAAAAACAAAAAAAAAA1JbnZhbGlkU3RhdHVzAAAAAAAAAwAAAAAAAAAMQW1vdW50VG9vTG93AAAABAAAAAAAAAAOVHJhbnNmZXJGYWlsZWQAAAAAAAU=" ]),
      options
    )
  }
  public readonly fromJSON = {
    accept: this.txFromJSON<Result<void>>,
        refund: this.txFromJSON<Result<void>>,
        deposit: this.txFromJSON<Result<void>>,
        release: this.txFromJSON<Result<void>>,
        get_escrow: this.txFromJSON<Result<Escrow>>,
        init_escrow: this.txFromJSON<Result<void>>
  }
}