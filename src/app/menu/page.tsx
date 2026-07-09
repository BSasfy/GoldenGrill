import { MenuRotator } from "@/components/MenuRotator";
import { getMenu, getSettings } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);
  return (
    <MenuRotator
      menu={menu}
      theme={settings.displayTheme}
      rotationSeconds={settings.displaySpeedSeconds}
    />
  );
}
