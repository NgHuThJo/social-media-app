import { Suspense } from "react";
import {
  Await,
  defer,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { ContentLayout } from "@frontend/components/layouts/content/content";
import { FriendList } from "@frontend/features/friend/components/list/list";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handler";
import { LoaderData } from "@frontend/types";
import { userIdSchema } from "@frontend/types/zod";

type FriendLoaderData = LoaderData<typeof friendLoader>;

export const friendLoader = ({ params }: LoaderFunctionArgs) => {
  const { userId } = params;
  const payload = {
    userId,
  };
  const validatedData = userIdSchema.safeParse(payload);

  if (!validatedData.success) {
    throw new Response(
      JSON.stringify({ errors: validatedData.error.flatten().fieldErrors }),
      { status: 400, statusText: "Invalid userId" },
    );
  }

  try {
    const response = client.friend.getAllFriends.query(validatedData.data);
    // When using defer, pass response as unawaited promise
    return defer({
      data: response,
    });
  } catch (error) {
    throw new Response(
      JSON.stringify(handleError(error, "Could not fetch friend data")),
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
};

export function FriendRoute() {
  const loaderData = useLoaderData() as FriendLoaderData;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={loaderData.data}>
        {(friends) => (
          <ContentLayout>
            <h2>Friends</h2>
            <FriendList data={friends} />
          </ContentLayout>
        )}
      </Await>
    </Suspense>
  );
}
