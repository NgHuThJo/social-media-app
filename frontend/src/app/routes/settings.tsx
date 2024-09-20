import { ContentLayout } from "@frontend/components/layouts/content/content";
import { Settings } from "@frontend/features/settings/components/settings";

export function SettingsRoute() {
  return (
    <ContentLayout>
      <Settings />
    </ContentLayout>
  );
}
