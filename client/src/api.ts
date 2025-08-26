const API_URL = (import.meta as any).env.VITE_SERVER_URL || "http://localhost:3001";

export interface Board {
  id: string;
  name: string;
  depth: number;
  merkleRoot: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
}

async function handle(res: Response) {
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || res.statusText);
  }
  return res.json();
}

export async function getBoards(): Promise<Board[]> {
  const res = await fetch(`${API_URL}/boards`);
  return handle(res);
}

export async function createBoard(name: string, depth = 20): Promise<Board> {
  const res = await fetch(`${API_URL}/boards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, depth })
  });
  return handle(res);
}

export async function addMember(boardId: string, identityCommitment: string) {
  const res = await fetch(`${API_URL}/boards/${boardId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identityCommitment })
  });
  return handle(res);
}

export async function getBoardRoot(boardId: string): Promise<{ merkleRoot: string }> {
  const res = await fetch(`${API_URL}/boards/${boardId}/root`);
  return handle(res);
}

export async function getPosts(boardId: string): Promise<Post[]> {
  const res = await fetch(`${API_URL}/boards/${boardId}/posts`);
  return handle(res);
}

export interface PostRequest {
  boardId: string;
  content: string;
  signalHash: string;
  merkleTreeRoot: string;
  nullifierHash: string;
  externalNullifier: string;
  proof: any;
}

export async function sendPost(body: PostRequest) {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return handle(res);
}
