import { useState, useEffect } from "react";
import { posts as staticPosts } from "./posts";
import { getLocalPosts, UPDATED_EVENT } from "./localPosts";
import type { Post } from "./types";

export function useAllPosts(): Post[] {
  const [local, setLocal] = useState<Post[]>(() => getLocalPosts());

  useEffect(() => {
    const refresh = () => setLocal(getLocalPosts());
    window.addEventListener(UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return [...local, ...staticPosts];
}
