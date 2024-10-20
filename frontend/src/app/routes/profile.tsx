import { Suspense } from "react";
import {
  Await,
  defer,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { ContentLayout } from "#frontend/components/layouts/content/content";
import { Profile } from "#frontend/features/profile/components/profile";
import { LoadingSpinner } from "#frontend/components/ui/loading/spinner/spinner";
import { client } from "#frontend/lib/trpc";
import { handleError } from "#frontend/utils/error-handler";
import { validateInput } from "#frontend/utils/input-validation";
import { LoaderData } from "#frontend/types";
import { userIdSchema } from "#frontend/types/zod";

type ProfileLoaderData = LoaderData<typeof profileLoader>;

export const profileLoader = ({ params }: LoaderFunctionArgs) => {
  const { userId } = params;
  const payload = {
    userId,
  };
  const { data, errors, isValid } = validateInput(userIdSchema, payload);

  if (!isValid) {
    throw new Response(JSON.stringify({ errors }), {
      status: 400,
      statusText: "Invalid userId",
    });
  }

  try {
    const response = client.user.getUser.query(data);
    // When using defer, pass response as unawaited promise
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
//
export function ProfileRoute() {
  const loaderData = useLoaderData() as ProfileLoaderData;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={loaderData.data}>
        {(profile) => (
          <ContentLayout>
            <h2>Profile Info</h2>
            <Profile data={profile} />
          </ContentLayout>
        )}
      </Await>
    </Suspense>
  );
}
