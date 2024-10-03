import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useFetch } from "@frontend/hooks/use-fetch";
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
  const [pageData, setPageData] = useState(() => {
    return { page: 1, totalPages: data?.totalPages ?? 1 };
  });
  const limit = 10;
  const parentNodeRef = useRef<HTMLUListElement>(null);
  const { user } = useAuthContext();
  const { isLoading, error, fetchData } = useFetch();
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

  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  const userId = user.id.toLocaleString();

  const goToNextPage = () => {
    fetchData(async (controller) => {
      const payload = {
        userId,
        page: pageData.page + 1,
        limit,
      };
      await processPageTransition(payload, controller);
    });
  };

  const goToPreviousPage = () => {
    fetchData(async (controller) => {
      const payload = {
        userId,
        page: pageData.page - 1,
        limit,
      };
      await processPageTransition(payload, controller);
    });
  };

  const processPageTransition = async (
    payload: any,
    controller: AbortController,
  ) => {
    const parsedData = paginatedPostSchema.safeParse(payload);

    if (!parsedData.success) {
      throw new Error("Invalid data format");
    }

    const response = await client.post.getAllPosts.query(parsedData.data, {
      signal: controller.signal,
    });

    if (response) {
      setPostData(response.posts);
      setPageData({ page: response.page, totalPages: response.totalPages });
    }
  };

  console.log(pageData.totalPages);

  return (
    <>
      <div className={styles["button-layout"]}>
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={pageData.page === 1}
        >
          Go to previous page
        </button>
        <button
          type="button"
          onClick={goToNextPage}
          disabled={pageData.page === pageData.totalPages}
        >
          Go to next page
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
