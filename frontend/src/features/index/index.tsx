import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useFetch } from "@frontend/hooks/use-fetch";
import { Button } from "@frontend/components/ui/button/button";
import { Follow } from "../shared/follow/follow";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";
import { client } from "@frontend/lib/trpc";
import { numericStringSchema } from "@frontend/types/zod";
import { UsersData } from "@frontend/types/api";
import styles from "./index.module.css";
import { avatar_placeholder } from "@frontend/assets/images";

type IndexProps = {
  data: UsersData;
};

export function Index({ data }: IndexProps) {
  const [userList, setUserList] = useState(data);
  const { user } = useAuthContext();
  const { error, isLoading, fetchData } = useFetch();

  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  const userId = user.id.toLocaleString();

  useEffect(() => {
    fetchData(async (controller) => {
      const parsedData = numericStringSchema.safeParse(userId);

      if (!parsedData.success) {
        throw new Error("Invalid data format");
      }

      const response = await client.user.getAllOtherUsers.query(
        { userId },
        {
          signal: controller.signal,
        },
      );

      setUserList(response);
    });
  }, [userId]);

  if (isLoading) {
    return <LoadingSpinner />;
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
        {userList?.map((user) => (
          <li className={styles.item} key={user.id}>
            <img src={user?.avatar?.url ?? avatar_placeholder} alt="" />
            <p>{user.name}</p>
            <p>{user.email}</p>
            <Follow
              followingId={user.id}
              userId={userId}
              isFollowed={user.isFollowed}
            />
            <Button type="button">
              {user.isFriend ? "Unfriend" : "Befriend"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
