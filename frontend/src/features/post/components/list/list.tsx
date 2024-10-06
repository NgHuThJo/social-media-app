import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useOffsetPagination } from "@frontend/hooks/use-offset-pagination";
import { useIntersectionObserver } from "@frontend/hooks/use-intersection-observer";
import { client } from "@frontend/lib/trpc";
import { Post } from "@frontend/features/post/components/post";
import { PostData } from "@frontend/types/api";
import { paginatedPostSchema } from "@frontend/types/zod";
import styles from "./list.module.css";

type PostListProps = {
  data: PostData;
};

export function PostList({ data }: PostListProps) {
  const [postData, setPostData] = useState(data?.posts ?? []);
  const parentNodeRef = useRef<HTMLUListElement>(null);
  const { user } = useAuthContext();
  const { observeChildNodes } = useIntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      } else {
        entry.target.classList.remove("fade-in");
      }
    }
  });
  const {
    isLoading,
    error,
    pageData,
    goToNextPage,
    goToPreviousPage,
    goToSpecificPage,
  } = useOffsetPagination(
    async (payload, controller, setPageData) => {
      const parsedData = paginatedPostSchema.safeParse(payload);

      if (!parsedData.success) {
        throw new Error(JSON.stringify(parsedData.error));
      }

      const response = await client.post.getAllPosts.query(parsedData.data, {
        signal: controller.signal,
      });

      if (response) {
        setPostData(response.posts);
        setPageData({ page: response.page, totalPages: response.totalPages });
      }
    },
    { userId: user?.id.toLocaleString() },
    data?.totalPages,
  );

  useEffect(() => {
    if (parentNodeRef.current) {
      observeChildNodes(parentNodeRef.current);
    }
  }, [observeChildNodes]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <p>
        {error.name}: {error.message}
      </p>
    );
  }

  return (
    <>
      <div className={styles["button-layout"]}>
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={pageData.page === 1}
        >
          {pageData.page === 1
            ? "Already at first page"
            : "Go to previous page"}
        </button>
        <form method="POST" onSubmit={goToSpecificPage}>
          <input
            type="number"
            name="page"
            id="page"
            min={1}
            max={pageData.totalPages}
            placeholder={String(pageData.page)}
          />
        </form>
        <span>
          {pageData.page} of {pageData.totalPages}
        </span>
        <button
          type="button"
          onClick={goToNextPage}
          disabled={pageData.page === pageData.totalPages}
        >
          {pageData.page === pageData.totalPages
            ? "Already at last page"
            : "Go to next page"}
        </button>
      </div>
      <ul className={styles.list} ref={parentNodeRef}>
        {postData.map((post) => (
          <Post data={post} key={post.id} />
        ))}
      </ul>
    </>
  );
}
