import { Suspense } from "react";
import {
  ActionFunctionArgs,
  Await,
  defer,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { useToggle } from "@frontend/hooks/useToggle";
import { client } from "@frontend/lib/trpc";
import { Button } from "@frontend/components/ui/button/button";
import { ContentLayout } from "@frontend/components/layouts/content/content";
import {
  PostForm,
  createPost,
} from "@frontend/features/post/components/form/form";
import { PostList } from "@frontend/features/post/components/list/list";
import {
  createComment,
  createPostComment,
} from "@frontend/features/shared/comment/form/form";
import { handleError } from "@frontend/utils/error-handler";
import { LoaderData } from "@frontend/types";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";

type PostLoaderData = LoaderData<typeof postLoader>;

export const postLoader = () => {
  try {
    const response = client.post.getAllPosts.query();
    // When using defer, pass response as unawaited promise
    return defer({
      data: response,
    });
  } catch (error) {
    throw new Response(
      JSON.stringify(handleError(error, "Could not fetch post data")),
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
};

export const postAction = async ({ request, params }: ActionFunctionArgs) => {
  const currentUrl = new URL(request.url);
  const formData = await request.formData();
  const intent = formData.get("intent");
  // Delete intent from FormData to prevent issues with Zod
  formData.delete("intent");

  switch (intent) {
    case "comment": {
      await createComment(request, params, formData);
      break;
    }
    case "post": {
      await createPost(request, params, formData);
      break;
    }
    case "postComment": {
      await createPostComment(request, params, formData);
      break;
    }
    default:
      throw new Error("Unknown intent");
  }

  return redirect(currentUrl.pathname + currentUrl.search);
};

export function PostRoute() {
  const loaderData = useLoaderData() as PostLoaderData;
  const { isOpen, open, close } = useToggle();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={loaderData.data}>
        {(posts) => (
          <ContentLayout>
            <h2>Posts</h2>
            <PostList data={posts} />
            <Button type="button" className="submit" onClick={open}>
              Create post
            </Button>
            {isOpen && <PostForm onClose={close} />}
          </ContentLayout>
        )}
      </Await>
    </Suspense>
  );
}
