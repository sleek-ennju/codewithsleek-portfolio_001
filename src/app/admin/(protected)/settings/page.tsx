import { getSiteSettings } from "@/features/settings/queries";
import { SettingsForm } from "@/features/settings/settings-form";
export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Global content</p>
          <h1>Site settings</h1>
          <p>
            Manage identity, contact routes, social profiles, homepage copy, and default search
            metadata.
          </p>
        </div>
      </div>
      <div className="admin-panel admin-settings-panel">
        <SettingsForm settings={settings} />
      </div>
    </main>
  );
}
