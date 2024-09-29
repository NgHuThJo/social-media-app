import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { useFetch } from "@frontend/hooks/use-fetch";
import { Comment } from "../comment";
import { client } from "@frontend/lib/trpc";
import { validateInput } from "@frontend/utils/input-validation";
import { numberToStringSchema } from "@frontend/types/zod";
import styles from "./list.module.css";

export type CommentListData = Awaited<
  ReturnType<typeof client.post.getChildComments.query>
>;

type PostCommentProps = {
  parentId: number;
  commentType: "post" | "comment";
};

export function CommentList({ parentId, commentType }: PostCommentProps) {
  const [comments, setComments] = useState<CommentListData>();
  const { isLoading, error, fetchData } = useFetch();
  const location = useLocation();

  useEffect(() => {
    fetchData(async (controller, setError) => {
      const { data, errors, isValid } = validateInput(
        z.object({ parentId: numberToStringSchema }),
        { parentId },
      );

      if (!isValid) {
        return setError({ errors });
      }

      const response =
        commentType === "post"
          ? await client.post.getParentComments.query(
              { postId: data.parentId },
              {
                signal: controller.signal,
              },
            )
          : await client.post.getChildComments.query(
              { commentId: data.parentId },
              {
                signal: controller.signal,
              },
            );

      setComments(response);
    });
  }, [parentId, commentType, location]);

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  // if (error) {
  //   console.log(error);
  //   return <div>There was an error.</div>;
  // }

  if (!comments || comments.length === 0) {
    return <div>No comments available.</div>;
  }
  return (
    <ul className={styles.list}>
      {comments?.map((comment) => (
        <Comment intent="comment" data={comment} key={comment.id} />
      ))}
    </ul>
  );
}
