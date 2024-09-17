import { Suspense } from "react";
import {
  ActionFunctionArgs,
  Await,
  defer,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { useToggle } from "@frontend/hooks/useToggle";
import { Button } from "@frontend/components/ui/button/button";
import { ContentLayout } from "@frontend/components/layouts/content/content";
import { FeedList } from "@frontend/features/feed/components/list/list";
import { FeedForm } from "@frontend/features/feed/components/form/form";
import { Spinner } from "@frontend/components/ui/spinner/spinner";
import { client } from "@frontend/lib/trpc";
import {
  createComment,
  createPostComment,
} from "@frontend/features/shared/comment/form/form";
import { createFeed } from "@frontend/features/feed/components/form/form";
import { LoaderData } from "@frontend/types";
import { userIdSchema } from "@frontend/types/zod-schema";
import { handleError } from "@frontend/utils/error-handling";

type FeedLoaderData = {
  data: LoaderData<typeof feedLoader>;
};

export type FeedData = Awaited<
  ReturnType<typeof client.post.getAllFeeds.query>
>;

export const feedLoader = ({ params }: LoaderFunctionArgs) => {
  console.count("feedLoader");
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
    const response = client.post.getAllFeeds.query(validatedData.data);
    // When using defer, pass response as unawaited promise
    return defer({
      data: response,
    });
  } catch (error) {
    throw new Response(
      JSON.stringify(handleError(error, "Could not fetch feed data")),
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
};

export const feedAction = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  // Delete intent from FormData to prevent issues with Zod
  formData.delete("intent");

  switch (intent) {
    case "feed":
      return createFeed(request, params, formData);
    case "postComment":
      return createPostComment(request, params, formData);
    case "comment":
      return createComment(request, params, formData);
    default:
      throw new Error("Unknown intent");
  }
};

export function FeedRoute() {
  const { isOpen, open, close } = useToggle();
  const loaderData = useLoaderData() as FeedLoaderData;

  return (
    <ContentLayout>
      <h2>Feeds</h2>
      <Suspense fallback={<Spinner />}>
        <Await resolve={loaderData.data}>
          {(feeds: FeedData) => (
            <>
              <FeedList data={feeds} />
              <Button type="button" className="submit" onClick={open}>
                Create Feed
              </Button>
            </>
          )}
        </Await>
      </Suspense>
      {isOpen && <FeedForm onClose={close} />}
    </ContentLayout>
  );
}
