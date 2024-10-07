import { useState } from "react";
import { z } from "zod";
import { useFetch } from "@frontend/hooks/use-fetch";
import { client } from "@frontend/lib/trpc";
import { numericStringSchema, numberToStringSchema } from "@frontend/types/zod";
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

export function Follow({ followsId, userId, isFollowed }: FollowProps) {
  const [isfollows, setIsfollows] = useState(isFollowed);
  const { isLoading, error, fetchData } = useFetch();

  const followUser = () => {
    fetchData(async (controller) => {
      const payload = {
        followsId,
        userId,
      };
      const parsedData = followSchema.safeParse(payload);

      if (!parsedData.success) {
        throw new Error("Invalid data format");
      }

      const response = await client.user.followUser.mutate(parsedData.data, {
        signal: controller.signal,
      });

      setIsfollows(response);
    });
  };

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
    <button
      type="button"
      onClick={followUser}
      className={[styles.button, isfollows ? styles.active : ""].join(" ")}
    >
      {isfollows ? "Unfollow" : "Follow"}
    </button>
  );
}
