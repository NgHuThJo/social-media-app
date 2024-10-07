import { Suspense } from "react";
import {
  Await,
  defer,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { ContentLayout } from "@frontend/components/layouts/content/content";
import { Index } from "@frontend/features/index";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handler";
import { indexSchema } from "@frontend/types/zod";
import { LoaderData } from "@frontend/types";

type IndexLoaderData = LoaderData<typeof indexLoader>;

export const indexLoader = async ({ params }: LoaderFunctionArgs) => {
  const { userId } = params;
  const payload = {
    userId,
    cursor: null,
    limit: 5,
  };
  const parsedData = indexSchema.safeParse(payload);

  if (!parsedData.success) {
    throw new Response(JSON.stringify(parsedData.error.flatten()), {
      status: 400,
      statusText: "Invalid userId",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const response = client.user.getAllOtherUsers.query(parsedData.data);

    return defer({
      data: response,
    });
  } catch (error) {
    throw new Response(JSON.stringify(handleError(error)), {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

export function IndexRoute() {
  const loaderData = useLoaderData() as IndexLoaderData;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={loaderData.data}>
        {(users) => (
          <ContentLayout>
            <h2>Userlist</h2>
            <Index data={users} />
          </ContentLayout>
        )}
      </Await>
    </Suspense>
  );
}
