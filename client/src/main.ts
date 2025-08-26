import { Identity } from "@semaphore-protocol/identity";
import { keccak256 } from "js-sha3";
import { getIdentity, saveIdentity } from "./storage";
import * as api from "./api";
import { createProof } from "./semaphore";

const wasmPath = "/public/artifacts/semaphore.wasm";
const zkeyPath = "/public/artifacts/semaphore.zkey";

let identity: Identity | null = getIdentity();
let currentBoard: api.Board | null = null;

async function refreshBoards() {
  const boards = await api.getBoards();
  const list = document.getElementById("boards-list")!;
  list.innerHTML = "";
  boards.forEach(b => {
    const li = document.createElement("li");
    li.textContent = `${b.name} (#${b.id})`;
    li.onclick = () => selectBoard(b);
    list.appendChild(li);
  });
}

function ensureIdentity() {
  if (!identity) {
    alert("Generate identity first");
    throw new Error("no identity");
  }
}

async function selectBoard(board: api.Board) {
  ensureIdentity();
  await api.addMember(board.id, identity!.commitment.toString());
  currentBoard = board;
  document.getElementById("posts-section")!.style.display = "block";
  document.getElementById("current-board")!.textContent = board.name;
  await loadPosts();
}

async function loadPosts() {
  if (!currentBoard) return;
  const posts = await api.getPosts(currentBoard.id);
  const ul = document.getElementById("posts-list")!;
  ul.innerHTML = "";
  posts.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.content;
    ul.appendChild(li);
  });
}

document.getElementById("gen-identity")!.onclick = () => {
  identity = new Identity();
  saveIdentity(identity);
  (document.getElementById("identity-commitment") as HTMLElement).textContent = identity.commitment.toString();
};

(document.getElementById("create-board") as HTMLButtonElement).onclick = async () => {
  const name = (document.getElementById("new-board-name") as HTMLInputElement).value;
  await api.createBoard(name, 20);
  await refreshBoards();
};

(document.getElementById("send-post") as HTMLButtonElement).onclick = async () => {
  ensureIdentity();
  if (!currentBoard) return;
  const content = (document.getElementById("post-content") as HTMLTextAreaElement).value;
  const signalHash = "0x" + keccak256(content);
  const timeBucket = Math.floor(Date.now() / 1000 / 300);
  const externalNullifier = "0x" + keccak256(currentBoard.id + String(timeBucket));
  const { merkleRoot } = await api.getBoardRoot(currentBoard.id);
  const proof = await createProof(
    identity!,
    merkleRoot,
    signalHash,
    externalNullifier,
    wasmPath,
    zkeyPath
  );
  await api.sendPost({
    boardId: currentBoard.id,
    content,
    signalHash,
    merkleTreeRoot: merkleRoot,
    nullifierHash: proof.publicSignals.nullifierHash,
    externalNullifier,
    proof: proof.proof
  });
  (document.getElementById("post-content") as HTMLTextAreaElement).value = "";
  await loadPosts();
};

refreshBoards();
if (identity) {
  (document.getElementById("identity-commitment") as HTMLElement).textContent = identity.commitment.toString();
}
