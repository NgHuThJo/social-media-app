import { Suspense } from "react";
import {
  ActionFunctionArgs,
  Await,
  defer,
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
import { handleError } from "@frontend/utils/error-handling";
import { LoaderData } from "@frontend/types";
import { Spinner } from "@frontend/components/ui/spinner/spinner";

type PostLoaderData = LoaderData<typeof postLoader>;

export type PostData = Awaited<
  ReturnType<typeof client.post.getAllPosts.query>
>;

export const postLoader = () => {
  try {
    const response = client.post.getAllPosts.query();
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

export const postAction = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  // Delete intent from FormData to prevent issues with Zod
  formData.delete("intent");

  switch (intent) {
    case "comment": {
      return createComment(request, params, formData);
    }
    case "post": {
      return createPost(request, params, formData);
    }
    case "postComment": {
      return createPostComment(request, params, formData);
    }
    default:
      throw new Error("Unknown intent");
  }
};

export function PostRoute() {
  const loaderData = useLoaderData() as PostLoaderData;
  const { isOpen, open, close } = useToggle();

  return (
    <ContentLayout>
      <h2>Posts</h2>
      <Suspense fallback={<Spinner />}>
        <Await resolve={loaderData.data}>
          {(posts: PostData) => (
            <>
              <PostList data={posts} />
              <Button type="button" className="submit" onClick={open}>
                Create post
              </Button>
            </>
          )}
        </Await>
      </Suspense>
      {isOpen && <PostForm onClose={close} />}
    </ContentLayout>
  );
}
