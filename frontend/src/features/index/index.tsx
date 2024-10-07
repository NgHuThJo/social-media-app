import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useInfiniteScroll } from "@frontend/hooks/use-infinite-scroll";
import { FriendButton } from "../shared/friend/button/button";
import { Follow } from "../shared/follow/follow";
import { client } from "@frontend/lib/trpc";
import { UsersData } from "@frontend/types/api";
import { indexSchema } from "@frontend/types/zod";
import styles from "./index.module.css";
import { avatar_placeholder } from "@frontend/assets/images";

type IndexProps = {
  data: UsersData;
};

export function Index({ data }: IndexProps) {
  const [indexData, setIndexData] = useState(data?.index ?? []);
  const { user } = useAuthContext();
  const { isLoading, error, fetchData, cursor, observeLastItem } =
    useInfiniteScroll(
      async (payload, controller, setCursor) => {
        const parsedData = indexSchema.safeParse(payload);

        if (!parsedData.success) {
          throw new Error(JSON.stringify(parsedData.error.flatten()));
        }

        const response = await client.user.getAllOtherUsers.query(
          parsedData.data,
          {
            signal: controller.signal,
          },
        );

        if (response) {
          setIndexData(response.index);
          setCursor(response.cursor);
        }
      },
      { userId: user?.id.toLocaleString() },
    );

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div>
      <ul className={styles.list}>
        {indexData?.map((otherUser) => (
          <li className={styles.item} key={otherUser.id}>
            <img src={otherUser?.avatar?.url ?? avatar_placeholder} alt="" />
            <p>{otherUser.name}</p>
            <p>{otherUser.email}</p>
            <Follow
              followingId={otherUser.id}
              userId={user.id}
              isFollowed={otherUser.isFollowed}
            />
            <FriendButton
              currentStatus={otherUser.friendshipStatus}
              isCurrentUserSender={otherUser.isCurrentUserSender}
              friendId={otherUser.id}
              userId={user.id}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
