import { Router } from "express";
import { prisma } from "../db/prismaClient";
import { Group } from "@semaphore-protocol/group";
import { addMember, getRoot } from "../services/groupService";

const router = Router();

router.get("/", async (_req, res) => {
  const boards = await prisma.board.findMany();
  res.json(boards);
});

router.post("/", async (req, res) => {
  const { name, depth = 20 } = req.body;
  const group = new Group(depth);
  const board = await prisma.board.create({ data: { name, depth, merkleRoot: group.root.toString() } });
  res.json(board);
});

router.post("/:id/members", async (req, res) => {
  try {
    const root = await addMember(req.params.id, req.body.identityCommitment);
    res.json({ merkleRoot: root });
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

router.get("/:id/root", async (req, res) => {
  try {
    const merkleRoot = await getRoot(req.params.id);
    res.json({ merkleRoot });
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

router.get("/:id/posts", async (req, res) => {
  const posts = await prisma.post.findMany({ where: { boardId: req.params.id }, orderBy: { createdAt: "desc" } });
  res.json(posts);
});

export default router;
