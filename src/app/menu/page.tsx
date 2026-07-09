import { MenuRotator } from "@/components/MenuRotator";
import { getDisplayTheme, getMenu } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [menu, theme] = await Promise.all([getMenu(), getDisplayTheme()]);
  return <MenuRotator menu={menu} theme={theme} />;
}
