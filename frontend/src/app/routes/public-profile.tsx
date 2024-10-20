import { PublicProfile } from "#frontend/features/profile/components/public/public-profile";
import { ContentLayout } from "#frontend/components/layouts/content/content";

export function PublicProfileRoute() {
  return (
    <ContentLayout>
      <PublicProfile />
    </ContentLayout>
  );
}
