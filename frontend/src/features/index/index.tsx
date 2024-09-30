import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useFetch } from "@frontend/hooks/use-fetch";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";
import { client } from "@frontend/lib/trpc";
import { numericStringSchema } from "@frontend/types/zod";
import { UsersData } from "@frontend/types/api";

export function Index() {
  const [userList, setUserList] = useState<UsersData>();
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
  }, []);

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
      <ul>{userList?.map((user) => <li>Hello, world!</li>)}</ul>
    </div>
  );
}
