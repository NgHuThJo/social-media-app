import { useEffect, useState } from "react";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useFetch } from "@frontend/hooks/useFetch";
import { Image } from "@frontend/components/ui/image/image";
import { client } from "@frontend/lib/trpc";
import { ProfileData } from "@frontend/types/api";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";

export function UserDisplay() {
  const [user, setUser] = useState<ProfileData>();
  const { userId } = useAuthContext();
  const { abortControllerRef, error, loading, fetchData } = useFetch();

  useEffect(() => {
    const fetchFn = async (abortController: AbortController) => {
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <button type="button" onClick={() => {}}>
        <Image src={user?.url}></Image>
      </button>
    </div>
  );
}
