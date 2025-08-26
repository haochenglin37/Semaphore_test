import path from "path";
import fs from "fs";
import { verifyProof, FullProof } from "@semaphore-protocol/proof";
import { prisma } from "../db/prismaClient";

const vkeyPath = path.join(__dirname, "../../../client/public/artifacts/semaphore.vkey.json");
const vkey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"));

export async function verifySemaphoreProof(proof: FullProof): Promise<boolean> {
  return verifyProof(vkey, proof);
}

export async function isNullifierUsed(boardId: string, externalNullifier: string, nullifierHash: string) {
  const existing = await prisma.nullifier.findUnique({
    where: { boardId_externalNullifier_nullifierHash: { boardId, externalNullifier, nullifierHash } }
  });
  return !!existing;
}

export async function saveNullifier(boardId: string, externalNullifier: string, nullifierHash: string) {
  await prisma.nullifier.create({ data: { boardId, externalNullifier, nullifierHash } });
}
