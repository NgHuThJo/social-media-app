import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "@frontend/hooks/useIntersectionObserver";
import { Post } from "@frontend/features/shared/post/post/post";
import { PostData } from "@frontend/types/api";
import styles from "./list.module.css";

type PostListProps = {
  data: PostData;
};

export function PostList({ data }: PostListProps) {
  const parentNodeRef = useRef<HTMLUListElement>(null);
  const { observeChildNodes } = useIntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      } else {
        entry.target.classList.remove("fade-in");
      }
    }
  });

  useEffect(() => {
    if (parentNodeRef.current) {
      observeChildNodes(parentNodeRef.current);
    }
  }, [observeChildNodes]);

  return (
    <ul className={styles.list} ref={parentNodeRef}>
      {data?.map((post) => <Post data={post} key={post.id} />)}
    </ul>
  );
}
