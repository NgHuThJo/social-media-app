import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useFetch } from "@frontend/hooks/useFetch";
import { client } from "@frontend/lib/trpc";
import { ProfileData } from "@frontend/types/api";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";
import styles from "./display.module.css";
import { avatar_placeholder } from "@frontend/assets/images";

export function UserDisplay() {
  const [user, setUser] = useState<ProfileData>();
  const { userId } = useAuthContext();
  const navigate = useNavigate();
  const { abortControllerRef, error, loading, fetchData } = useFetch();

  useEffect(() => {
    const fetchFn = async (abortController: AbortController) => {
      console.log(typeof userId);
      const response = await client.user.getUser.query(
        { userId },
        {
          signal: abortController.signal,
        },
      );

      setUser(response);
    };

    fetchData(fetchFn);

    return () => {
      abortControllerRef.current?.abort;
    };
  }, [userId]);

  const handleClick = () => {
    navigate(`/${userId}/settings`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    throw new Error("Could not fetch user");
  }

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleClick} className={styles.avatar}>
        <img src={user?.avatar?.url ?? avatar_placeholder} alt="User avatar" />
      </button>
      <p className={styles.name}>{user?.name}</p>
      <p className={styles.email}>{user?.email}</p>
    </div>
  );
}
