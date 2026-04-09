import type { Post } from "./types";

const KEY = "jt_local_posts";
export const UPDATED_EVENT = "jt-posts-updated";

export function getLocalPosts(): Post[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveLocalPost(post: Post): void {
  const current = getLocalPosts().filter((p) => p.id !== post.id);
  localStorage.setItem(KEY, JSON.stringify([post, ...current]));
  window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function deleteLocalPost(id: string): void {
  const current = getLocalPosts().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(current));
  window.dispatchEvent(new Event(UPDATED_EVENT));
}
