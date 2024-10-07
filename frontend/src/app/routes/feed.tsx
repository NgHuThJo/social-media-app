import { Suspense } from "react";
import {
  ActionFunctionArgs,
  Await,
  defer,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { useToggle } from "@frontend/hooks/use-toggle";
import { Button } from "@frontend/components/ui/button/button";
import { ContentLayout } from "@frontend/components/layouts/content/content";
import { FeedList } from "@frontend/features/feed/components/list/list";
import { FeedForm } from "@frontend/features/feed/components/form/form";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";
import { client } from "@frontend/lib/trpc";
import {
  createComment,
  createPostComment,
} from "@frontend/features/shared/comment/form/form";
import { createFeed } from "@frontend/features/feed/components/form/form";
import { handleError } from "@frontend/utils/error-handler";
import { validateInput } from "@frontend/utils/input-validation";
import { LoaderData } from "@frontend/types";
import { cursorFeedSchema } from "@frontend/types/zod";

type FeedLoaderData = LoaderData<typeof feedLoader>;

export const feedLoader = ({ params }: LoaderFunctionArgs) => {
  const { userId } = params;
  const payload = {
    userId,
    cursors: {
      next: null,
      back: null,
    },
    isForward: true,
    limit: 5,
  };
  const { data, errors, isValid } = validateInput(cursorFeedSchema, payload);

  if (!isValid) {
    throw new Response(JSON.stringify({ errors }), {
      status: 400,
      statusText: "Invalid userId",
    });
  }

  try {
    const response = client.post.getAllFeeds.query(data);
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

export const feedAction = async ({ request, params }: ActionFunctionArgs) => {
  const currentUrl = new URL(request.url);
  const formData = await request.formData();
  const intent = formData.get("intent");
  // Delete intent from FormData to prevent issues with Zod
  formData.delete("intent");

  switch (intent) {
    case "feed": {
      await createFeed(request, params, formData);
      break;
    }
    case "postComment": {
      await createPostComment(request, params, formData);
      break;
    }
    case "comment": {
      await createComment(request, params, formData);
      break;
    }
    default: {
      throw new Error("Unknown intent");
    }
  }

  return redirect(currentUrl.pathname + currentUrl.search);
};

export function FeedRoute() {
  const { isOpen, open, close } = useToggle();
  const loaderData = useLoaderData() as FeedLoaderData;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={loaderData.data}>
        {(feeds) => (
          <ContentLayout>
            <h2>Feeds</h2>
            <FeedList data={feeds} />
            {isOpen ? (
              <FeedForm onClose={close} />
            ) : (
              <Button type="button" className="submit" onClick={open}>
                Create Feed
              </Button>
            )}
          </ContentLayout>
        )}
      </Await>
    </Suspense>
  );
}
