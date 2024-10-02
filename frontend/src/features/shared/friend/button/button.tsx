import { useState } from "react";
import { z } from "zod";
import { useFetch } from "@frontend/hooks/use-fetch";
import { client } from "@frontend/lib/trpc";
import { friendRequestSchema, numberToStringSchema } from "@frontend/types/zod";
import styles from "./button.module.css";

type FriendButtonProps = {
  currentStatus: "ACCEPTED" | "DECLINED" | "PENDING" | null;
  isCurrentUserSender: boolean | null;
  friendId: number;
  userId: number;
};

const friendButtonSchema = z.object({
  userId: numberToStringSchema,
  friendId: numberToStringSchema,
  action: friendRequestSchema,
});

export function FriendButton({
  currentStatus,
  isCurrentUserSender,
  userId,
  friendId,
}: FriendButtonProps) {
  const [status, setStatus] = useState({
    friendshipStatus: currentStatus,
    isCurrentUserSender,
  });
  const { error, isLoading, fetchData } = useFetch();

  const sendFriendRequest = () => {
    fetchData(async (controller) => {
      const payload = { userId, friendId, action: "SEND_REQUEST" };
      await processFriendRequest(payload, controller);
    });
  };
  const acceptFriendRequest = () => {
    fetchData(async (controller) => {
      const payload = { userId, friendId, action: "ACCEPT_REQUEST" };
      await processFriendRequest(payload, controller);
    });
  };
  const declineFriendRequest = () => {
    fetchData(async (controller) => {
      const payload = { userId, friendId, action: "DECLINE_REQUEST" };
      await processFriendRequest(payload, controller);
    });
  };
  const removeFriend = () => {
    fetchData(async (controller) => {
      const payload = { userId, friendId, action: "REMOVE_FRIEND" };
      await processFriendRequest(payload, controller);
    });
  };
  const processFriendRequest = async (
    payload: any,
    controller: AbortController,
  ) => {
    const parsedData = friendButtonSchema.safeParse(payload);

    if (!parsedData.success) {
      throw new Error("Invalid data format");
    }

    const response = await client.friend.updateFriendshipStatus.mutate(
      parsedData.data,
      {
        signal: controller.signal,
      },
    );

    if (response) {
      setStatus(response);
    }
  };

  if (isLoading) {
    return <p>Is loading...</p>;
  }

  if (error) {
    return (
      <p>
        {error.name}: {error.message}
      </p>
    );
  }

  const renderButton = () => {
    if (status.friendshipStatus === "PENDING") {
      return status.isCurrentUserSender ? (
        <p>Friend request pending</p>
      ) : (
        <>
          <button type="button" onClick={acceptFriendRequest}>
            Accept
          </button>
          <button type="button" onClick={declineFriendRequest}>
            Decline
          </button>
        </>
      );
    }
    if (status.friendshipStatus === "ACCEPTED") {
      return (
        <button type="button" onClick={removeFriend}>
          Remove friend
        </button>
      );
    }
    return (
      <button type="button" onClick={sendFriendRequest}>
        Send friend request
      </button>
    );
  };

  return <div className={styles.container}>{renderButton()}</div>;
}
