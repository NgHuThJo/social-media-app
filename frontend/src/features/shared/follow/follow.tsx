import { useState } from "react";
import { useFetch } from "@frontend/hooks/use-fetch";
import { client } from "@frontend/lib/trpc";
import { validateInput } from "@frontend/utils/input-validation";
import { numericStringSchema, numberToStringSchema } from "@frontend/types/zod";
import { z } from "zod";

type FollowProps = {
  userId: string;
  followingId: number;
};

const followSchema = z.object({
  followingId: numberToStringSchema,
  userId: numericStringSchema,
});

export function Follow({ followingId, userId }: FollowProps) {
  const [isFollowing, setIsFollowing] = useState();
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
    <button type="button" onClick={followUser}>
      Follow
    </button>
  );
}
