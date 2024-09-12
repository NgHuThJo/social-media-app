import { useEffect, useState } from "react";
import { useFetch } from "@frontend/hooks/useFetch";
import { Comment } from "../comment/comment";
import { client } from "@frontend/lib/trpc";
import styles from "./list.module.css";

export type CommentListData = Awaited<
  ReturnType<typeof client.post.getChildComments.query>
>;

type PostCommentProps = {
  parentId: number;
  isPostId: boolean;
};

export function CommentList({ parentId, isPostId }: PostCommentProps) {
  const [data, setData] = useState<CommentListData>();
  const { loading, error, abortControllerRef, fetchData } = useFetch();

  useEffect(() => {
    const fetchFn: (controller: AbortController) => Promise<void> = async (
      controller,
    ) => {
      const response = isPostId
        ? await client.post.getParentComments.query(parentId, {
            signal: controller.signal,
          })
        : await client.post.getChildComments.query(parentId, {
            signal: controller.signal,
          });

      setData(response);
    };

    fetchData(fetchFn);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [parentId, isPostId]);

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  if (!data || data.length === 0) {
    return <div>No comments available</div>;
  }
  return (
    <ul className={styles.list}>
      {data?.map((comment) => (
        <Comment intent="comment" data={comment} key={comment.id} />
      ))}
    </ul>
  );
}
