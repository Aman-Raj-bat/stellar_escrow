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




export type DataKey = {tag: "Nonce", values: void} | {tag: "EscrowContract", values: void};


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
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the factory with the address of the escrow manager contract
   */
  init: ({escrow_contract}: {escrow_contract: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create_escrow transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_escrow: ({client, freelancer, amount, token}: {client: string, freelancer: string, amount: i128, token: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<u64>>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAABU5vbmNlAAAAAAAAAAAAAAAAAAAORXNjcm93Q29udHJhY3QAAA==",
        "AAAAAAAAAEZJbml0aWFsaXplIHRoZSBmYWN0b3J5IHdpdGggdGhlIGFkZHJlc3Mgb2YgdGhlIGVzY3JvdyBtYW5hZ2VyIGNvbnRyYWN0AAAAAAAEaW5pdAAAAAEAAAAAAAAAD2VzY3Jvd19jb250cmFjdAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAANY3JlYXRlX2VzY3JvdwAAAAAAAAQAAAAAAAAABmNsaWVudAAAAAAAEwAAAAAAAAAKZnJlZWxhbmNlcgAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAD6QAAAAYAAAAD",
        "AAAAAQAAAAAAAAAAAAAABkVzY3JvdwAAAAAABgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAZjbGllbnQAAAAAABMAAAAAAAAACmZyZWVsYW5jZXIAAAAAABMAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAAMRXNjcm93U3RhdHVzAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAgAAAAAAAAAAAAAADEVzY3Jvd1N0YXR1cwAAAAUAAAAAAAAAAAAAAAdDcmVhdGVkAAAAAAAAAAAAAAAABkZ1bmRlZAAAAAAAAAAAAAAAAAAIQWNjZXB0ZWQAAAAAAAAAAAAAAAhSZWxlYXNlZAAAAAAAAAAAAAAACFJlZnVuZGVk",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABQAAAAAAAAANTm90QXV0aG9yaXplZAAAAAAAAAEAAAAAAAAADkVzY3Jvd05vdEZvdW5kAAAAAAACAAAAAAAAAA1JbnZhbGlkU3RhdHVzAAAAAAAAAwAAAAAAAAAMQW1vdW50VG9vTG93AAAABAAAAAAAAAAOVHJhbnNmZXJGYWlsZWQAAAAAAAU=" ]),
      options
    )
  }
  public readonly fromJSON = {
    init: this.txFromJSON<null>,
        create_escrow: this.txFromJSON<Result<u64>>
  }
}