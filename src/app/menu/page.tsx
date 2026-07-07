import { MenuBoard } from "@/components/MenuBoard";
import { getDisplayTheme } from "@/lib/display-theme";
import { getMenu } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const menu = await getMenu();
  return <MenuBoard menu={menu} theme={getDisplayTheme()} />;
}
