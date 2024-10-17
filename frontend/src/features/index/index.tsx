import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useInfiniteScroll } from "@frontend/hooks/use-infinite-scroll";
import { useLatest } from "@frontend/hooks/use-latest";
import { FriendButton } from "../shared/friend/button/button";
import { Follow } from "../shared/follow/follow";
import { client } from "@frontend/lib/trpc";
import { UsersData } from "@frontend/types/api";
import { indexSchema } from "@frontend/types/zod";
import styles from "./index.module.css";
import { avatar_placeholder } from "@frontend/assets/resources/icons";

type IndexProps = {
  data: UsersData;
};

export function Index({ data }: IndexProps) {
  const [indexData, setIndexData] = useState(data?.index ?? []);
  const { user } = useAuthContext();
  const { isLoading, error, observeLastItem } = useInfiniteScroll(
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
        setIndexData((prev) => [...prev, ...response.index]);
        setCursor(response.cursor);
      }
    },
    { userId: user?.id.toLocaleString() },
    data?.cursor,
  );
  const latestRef = useLatest({ observeLastItem });

  useEffect(() => {
    const { observeLastItem } = latestRef.current;

    const lastChild = document.querySelector(
      `.${styles.list}`,
    )?.lastElementChild;

    if (lastChild) {
      observeLastItem(lastChild);
    }
  }, [indexData, latestRef]);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (error) {
    return (
      <p>
        {error.name}: {error.message}
      </p>
    );
  }

  return (
    <div>
      <ul className={styles.list}>
        {indexData?.map((otherUser) => (
          <li className={styles.item} key={otherUser.id}>
            <img src={otherUser?.avatar?.url ?? avatar_placeholder} alt="" />
            <Link to={`../profile/${String(otherUser.id)}`}>
              <p className={styles.name}>{otherUser.displayName}</p>
            </Link>
            <p className={styles.email}>{otherUser.email}</p>
            <Follow
              followsId={otherUser.id}
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
      {isLoading && <p>Loading more users...</p>}
    </div>
  );
}
