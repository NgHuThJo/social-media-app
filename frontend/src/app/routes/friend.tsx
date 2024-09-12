import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { client } from "@frontend/lib/trpc";
import { FriendList } from "@frontend/features/friend/components/list/list";
import { LoaderData } from "@frontend/types";
import { ContentLayout } from "@frontend/components/layouts/content/content";

export type FriendLoaderData = LoaderData<typeof friendLoader>;

export const friendLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  const response = await client.friend.getAllFriends.query(Number(id));

  console.log("Get all friends of current user", response);

  return { data: response };
};

export function FriendRoute() {
  const { data } = useLoaderData() as FriendLoaderData;

  return (
    <ContentLayout>
      <h2>Friends</h2>
      <FriendList data={data} />
    </ContentLayout>
  );
}
