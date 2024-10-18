import { Suspense } from "react";
import {
  ActionFunctionArgs,
  Await,
  defer,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { useToggle } from "@frontend/hooks/use-toggle";
import { Button } from "@frontend/components/ui/button/button";
import { ContentLayout } from "@frontend/components/layouts/content/content";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";
import {
  PostForm,
  createPost,
} from "@frontend/features/post/components/form/form";
import { PostList } from "@frontend/features/post/components/list/list";
import { client } from "@frontend/lib/trpc";
import {
  createComment,
  createPostComment,
} from "@frontend/features/shared/comment/form/form";
import { handleError } from "@frontend/utils/error-handler";
import { validateInput } from "@frontend/utils/input-validation";
import { LoaderData } from "@frontend/types";
import { paginatedPostSchema } from "@frontend/types/zod";

type PostLoaderData = LoaderData<typeof postLoader>;

export const postLoader = ({ params }: LoaderFunctionArgs) => {
  const { userId } = params;
  const payload = {
    userId,
    page: 1,
    limit: 5,
  };
  const { data, errors, isValid } = validateInput(paginatedPostSchema, payload);

  if (!isValid) {
    throw new Response(JSON.stringify({ errors }), {
      status: 400,
      statusText: "Invalid userId",
    });
  }

  try {
    const response = client.post.getAllPosts.query(data);
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

export const postAction = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  // Delete intent from FormData to prevent issues with Zod
  formData.delete("intent");

  switch (intent) {
    case "comment": {
      return await createComment(request, params, formData);
    }
    case "post": {
      return await createPost(request, params, formData);
    }
    case "postComment": {
      return await createPostComment(request, params, formData);
    }
    default:
      throw new Error("Unknown intent");
  }
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
            {isOpen ? (
              <PostForm onClose={close} />
            ) : (
              <Button type="button" className="submit" onClick={open}>
                Create post
              </Button>
            )}
            <PostList data={posts} />
          </ContentLayout>
        )}
      </Await>
    </Suspense>
  );
}
