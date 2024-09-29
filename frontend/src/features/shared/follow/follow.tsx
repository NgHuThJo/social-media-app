import { useState } from "react";
import { z } from "zod";
import { useFetch } from "@frontend/hooks/use-fetch";
import { client } from "@frontend/lib/trpc";
import { validateInput } from "@frontend/utils/input-validation";
import { numericStringSchema, numberToStringSchema } from "@frontend/types/zod";
import styles from "./follow.module.css";

type FollowProps = {
  isFollowed: boolean;
  userId: string;
  followingId: number;
};

const followSchema = z.object({
  followingId: numberToStringSchema,
  userId: numericStringSchema,
});

export function Follow({ followingId, userId, isFollowed }: FollowProps) {
  const [isFollowing, setIsFollowing] = useState(isFollowed);
  const { isLoading, error, fetchData } = useFetch<typeof followSchema>();

  const followUser = () => {
    fetchData(async (controller, setError) => {
      const payload = {
        followingId,
        userId,
      };

      const { data, errors, isValid } = validateInput(followSchema, payload);

      if (!isValid) {
        return setError({ errors });
      }

      const response = await client.user.followUser.mutate(data, {
        signal: controller.signal,
      });

      setIsFollowing(response);
    });
  };

  return (
    <button
      type="button"
      onClick={followUser}
      className={isFollowing ? styles.active : ""}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
