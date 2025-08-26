import { Group } from "@semaphore-protocol/group";
import { prisma } from "../db/prismaClient";

export async function addMember(boardId: string, identityCommitment: string) {
  await prisma.member.create({ data: { boardId, identityCommitment } });
  const members = await prisma.member.findMany({ where: { boardId }, orderBy: { createdAt: "asc" } });
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) throw new Error("board not found");
  const group = new Group(board.depth);
  members.forEach(m => group.addMember(BigInt(m.identityCommitment)));
  await prisma.board.update({ where: { id: boardId }, data: { merkleRoot: group.root.toString() } });
  return group.root.toString();
}

export async function getRoot(boardId: string): Promise<string> {
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) throw new Error("board not found");
  return board.merkleRoot;
}
