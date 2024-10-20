import { useState } from "react";
import { z } from "zod";
import { useFetch } from "#frontend/hooks/use-fetch";
import { useDebounce } from "#frontend/hooks/use-debounce";
import { client } from "#frontend/lib/trpc";
import { numberToStringSchema } from "#frontend/types/zod";
import styles from "./follow.module.css";

type FollowProps = {
  isFollowed: boolean;
  userId: number;
  followsId: number;
};

const followSchema = z.object({
  followsId: numberToStringSchema,
  userId: numberToStringSchema,
});

export function Follow({
  followsId,
  userId,
  isFollowed: isUserFollowed,
}: FollowProps) {
  const [isFollowed, setIsFollowed] = useState(isUserFollowed);
  const { error, fetchData } = useFetch();

  const followUser = useDebounce(() => {
    fetchData(async (controller) => {
      const payload = {
        followsId,
        userId,
      };
      const parsedData = followSchema.safeParse(payload);

      if (!parsedData.success) {
        throw new Error(JSON.stringify(parsedData.error.flatten()));
      }

      const response = await client.user.followUser.mutate(parsedData.data, {
        signal: controller.signal,
      });
      console.log("isfollowed", response);

      setIsFollowed(response);
    });
  }, 100);

  if (error) {
    return (
      <p>
        {error.name}: {error.message}
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={followUser}
      className={[styles.button, isFollowed ? styles.active : ""].join(" ")}
    >
      {isFollowed ? "Unfollow" : "Follow"}
    </button>
  );
}
