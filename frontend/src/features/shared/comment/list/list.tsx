import { useEffect, useState } from "react";
import { useFetch } from "@frontend/hooks/use-fetch";
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
  const [comments, setComments] = useState<CommentListData>();
  const { isLoading, error, fetchData } = useFetch();

  useEffect(() => {
    const fetchFn: (controller: AbortController) => Promise<void> = async (
      controller,
    ) => {
      const response = isPostId
        ? await client.post.getParentComments.query(
            { postId: String(parentId) },
            {
              signal: controller.signal,
            },
          )
        : await client.post.getChildComments.query(
            { commentId: String(parentId) },
            {
              signal: controller.signal,
            },
          );

      setComments(response);
    };

    fetchData(fetchFn);
  }, [parentId, isPostId]);

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  if (!comments || comments.length === 0) {
    return <div>No comments available</div>;
  }
  return (
    <ul className={styles.list}>
      {comments?.map((comment) => (
        <Comment intent="comment" data={comment} key={comment.id} />
      ))}
    </ul>
  );
}
