import { DisplayRotator } from "@/components/DisplayRotator";
import { getMenu, getSettings, getSpecials } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function DisplayPage() {
  const [menu, specials, settings] = await Promise.all([
    getMenu(),
    getSpecials(),
    getSettings(),
  ]);
  return (
    <DisplayRotator
      menu={menu}
      specials={specials}
      theme={settings.displayTheme}
      rotationSeconds={settings.displaySpeedSeconds}
    />
  );
}
