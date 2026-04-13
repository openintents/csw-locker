import { sha512_256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { minidenticonSvg } from "minidenticons";
import { getClientConfig } from "@/utils/chain-config";

// Reference implementation for SIP-XXX (Contract identicons).
// See sips/sip-xxx-contract-identicons.md for the full specification.
//
// Pipeline:
//   fetch source -> sha512/256 -> hex seed -> minidenticonSvg
//
// Canonicalization via `clarinet fmt` is not performed here; we assume
// the contract author deployed canonical source. See §1 of the SIP.

export type ContractId = `${string}.${string}`;

export async function fetchContractSource(
  contractId: ContractId
): Promise<string> {
  const [address, name] = contractId.split(".") as [string, string];
  const { api } = getClientConfig(address);
  const res = await fetch(`${api}/v2/contracts/source/${address}/${name}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch source for ${contractId}: ${res.status} ${res.statusText}`
    );
  }
  const data: { source: string } = await res.json();
  return data.source;
}

export function identiconHash(source: string): string {
  return bytesToHex(sha512_256(new TextEncoder().encode(source)));
}

export function identiconSvg(seedHex: string): string {
  return minidenticonSvg(seedHex);
}

export async function contractIdenticonSvg(
  contractId: ContractId
): Promise<{ svg: string; hash: string }> {
  const source = await fetchContractSource(contractId);
  const hash = identiconHash(source);
  return { svg: identiconSvg(hash), hash };
}
