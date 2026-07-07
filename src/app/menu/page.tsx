import { MenuBoard } from "@/components/MenuBoard";
import { getDisplayTheme, getMenu } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [menu, theme] = await Promise.all([getMenu(), getDisplayTheme()]);
  return <MenuBoard menu={menu} theme={theme} />;
}
