import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { ContentLayout } from "@frontend/components/layouts/content/content";
import { ProfileInfo } from "@frontend/features/profile/components/info/info";
import { client } from "@frontend/lib/trpc";
import { LoaderData } from "@frontend/types";

export type ProfileLoaderData = LoaderData<typeof profileLoader>;

export const profileLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  const response = await client.user.getUser.query(Number(id));

  return {
    data: response,
  };
};

export function ProfileRoute() {
  const { data } = useLoaderData() as ProfileLoaderData;

  return (
    <ContentLayout>
      <h2>Profile Info</h2>
      <ProfileInfo data={data} />
    </ContentLayout>
  );
}
