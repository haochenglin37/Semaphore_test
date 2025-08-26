import { Identity } from "@semaphore-protocol/identity";
import { generateProof, verifyProof, FullProof } from "@semaphore-protocol/proof";

export async function createProof(
  identity: Identity,
  merkleTreeRoot: string,
  signalHash: string,
  externalNullifier: string,
  wasmFilePath: string,
  zkeyFilePath: string
): Promise<FullProof> {
  return generateProof(identity, "0", {
    merkleTreeRoot,
    signalHash,
    externalNullifier
  }, {
    wasmFilePath,
    zkeyFilePath
  });
}

export async function verifySemaphoreProof(
  proof: FullProof,
  vkeyFilePath: string
): Promise<boolean> {
  return verifyProof(vkeyFilePath, proof);
}
