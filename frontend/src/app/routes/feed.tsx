import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { useToggle } from "@frontend/hooks/useToggle";
import {
  createComment,
  createPostComment,
} from "@frontend/features/shared/comment/form/form";
import { createPost } from "@frontend/features/post/components/form/form";
import { Button } from "@frontend/components/ui/button/button";
import { FeedList } from "@frontend/features/feed/components/list/list";
import { PostForm } from "@frontend/features/post/components/form/form";
import { client } from "@frontend/lib/trpc";
import { LoaderData } from "@frontend/types";
import { ContentLayout } from "@frontend/components/layouts/content/content";

export type FeedLoaderData = LoaderData<typeof feedLoader>;

export const feedLoader = async ({ params }: LoaderFunctionArgs) => {
  const { userId } = params;

  const response = await client.post.getAllFeeds.query(Number(userId));

  console.log(response);

  return {
    data: response,
  };
};

export const feedAction = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "post":
      return createPost(request, params, formData);
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
  const { data } = useLoaderData() as FeedLoaderData;

  return (
    <ContentLayout>
      <h2>Feeds</h2>
      <FeedList data={data} />
      <Button type="button" className="submit" onClick={open}>
        Create post
      </Button>
      {isOpen && <PostForm onClose={close} />}
    </ContentLayout>
  );
}
