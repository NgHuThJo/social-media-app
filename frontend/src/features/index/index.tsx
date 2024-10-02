import { Navigate } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { FriendButton } from "../shared/friend/button/button";
import { Follow } from "../shared/follow/follow";
import { UsersData } from "@frontend/types/api";
import styles from "./index.module.css";
import { avatar_placeholder } from "@frontend/assets/images";

type IndexProps = {
  data: UsersData;
};

export function Index({ data }: IndexProps) {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div>
      <ul className={styles.list}>
        {data?.map((otherUser) => (
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
