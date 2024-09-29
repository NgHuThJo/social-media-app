import { useState } from "react";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useFetch } from "@frontend/hooks/use-fetch";
import { Image } from "@frontend/components/ui/image/image";
import { client } from "@frontend/lib/trpc";
import { validateInput } from "@frontend/utils/input-validation";
import { numberToStringSchema, numericStringSchema } from "@frontend/types/zod";
import styles from "./like.module.css";
import { thumbs_up_icon } from "@frontend/assets/images";

type CommentLikeProps = {
  likes: number;
  commentId: number;
};

const postLikeSchema = z.object({
  commentId: numberToStringSchema,
  userId: numericStringSchema,
});

export function CommentLike({ commentId, likes }: CommentLikeProps) {
  const [likeCount, setLikeCount] = useState<number>(likes);
  const { user } = useAuthContext();
  const { isLoading, error, fetchData } = useFetch<typeof postLikeSchema>();

  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  const userId = user.id.toLocaleString();

  const likePost = () => {
    fetchData(async (controller, setError) => {
      const payload = {
        commentId,
        userId,
      };
      const { data, errors, isValid } = validateInput(postLikeSchema, payload);

      if (!isValid) {
        return setError({ errors });
      }

      const response = await client.post.getLikesOfComment.query(data, {
        signal: controller.signal,
      });

      setLikeCount(response);
    });
  };

  return (
    <button type="button" className={styles.button} onClick={likePost}>
      <Image src={thumbs_up_icon} />
      <span>{likeCount}</span>
    </button>
  );
}
