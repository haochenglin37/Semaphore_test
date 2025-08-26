import { Identity } from "@semaphore-protocol/identity";

const KEY = "semaphore_identity";

export function saveIdentity(identity: Identity): void {
  localStorage.setItem(KEY, identity.toString());
}

export function getIdentity(): Identity | null {
  const s = localStorage.getItem(KEY);
  if (!s) return null;
  return new Identity(s);
}
