import { Router } from "express";
import { prisma } from "../db/prismaClient";
import { verifySemaphoreProof, isNullifierUsed, saveNullifier } from "../services/proofService";

const router = Router();

router.post("/", async (req, res) => {
  const { boardId, content, signalHash, merkleTreeRoot, nullifierHash, externalNullifier, proof } = req.body;

  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) return res.status(400).send("board not found");
  if (board.merkleRoot !== merkleTreeRoot) return res.status(400).send("invalid merkle root");

  const fullProof = { proof, publicSignals: { merkleTreeRoot, nullifierHash, signalHash, externalNullifier } };
  const ok = await verifySemaphoreProof(fullProof as any);
  if (!ok) return res.status(400).send("invalid proof");

  if (await isNullifierUsed(boardId, externalNullifier, nullifierHash)) {
    return res.status(409).send("duplicate nullifier");
  }

  const post = await prisma.post.create({ data: { boardId, content, signalHash, merkleRootSnapshot: merkleTreeRoot, nullifierHash, externalNullifier } });
  await saveNullifier(boardId, externalNullifier, nullifierHash);
  res.json({ id: post.id });
});

export default router;
