import { DisplayPageClient } from "./DisplayPageClient";
import { getMenu, getSettings, getSpecials } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function DisplayPage() {
  const [menu, specials, settings] = await Promise.all([
    getMenu(),
    getSpecials(),
    getSettings(),
  ]);
  return (
    <DisplayPageClient
      menu={menu}
      specials={specials}
      initialTheme={settings.displayTheme}
      rotationSeconds={settings.displaySpeedSeconds}
    />
  );
}
