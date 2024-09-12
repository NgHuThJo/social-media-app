import { ActionFunctionArgs, useLoaderData } from "react-router-dom";
import { useToggle } from "@frontend/hooks/useToggle";
import { client } from "@frontend/lib/trpc";
import { Button } from "@frontend/components/ui/button/button";
import {
  PostForm,
  createPost,
} from "@frontend/features/post/components/form/form";
import { ContentLayout } from "@frontend/components/layouts/content/content";
import { PostList } from "@frontend/features/post/components/list/list";
import {
  createComment,
  createPostComment,
} from "@frontend/features/shared/comment/form/form";
import { LoaderData } from "@frontend/types";

export type PostLoaderData = LoaderData<typeof postLoader>;

export const postLoader = async () => {
  const posts = await client.post.getAllPosts.query();

  return {
    data: posts,
  };
};

export const postAction = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  // Delete intent from FormData to prevent issues with Zod
  formData.delete("intent");
  let response;

  switch (intent) {
    case "comment": {
      response = await createComment(request, params, formData);
      break;
    }
    case "post": {
      response = await createPost(request, params, formData);
      break;
    }
    case "postComment": {
      response = await createPostComment(request, params, formData);
      break;
    }
    default:
      throw new Error("Unknown intent");
  }

  console.log("Response in postAction", response);

  return response;
};

export function PostRoute() {
  const { data } = useLoaderData() as PostLoaderData;
  const { isOpen, open, close } = useToggle();

  return (
    <ContentLayout>
      <h2>Posts</h2>
      <PostList data={data} />
      <Button type="button" className="submit" onClick={open}>
        Create post
      </Button>
      {isOpen && <PostForm onClose={close} />}
    </ContentLayout>
  );
}
