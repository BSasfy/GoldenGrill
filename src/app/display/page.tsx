import { DisplayPageClient } from "./DisplayPageClient";
import { getDisplayTheme, getMenu, getSpecials } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function DisplayPage() {
  const [menu, specials, theme] = await Promise.all([
    getMenu(),
    getSpecials(),
    getDisplayTheme(),
  ]);
  return <DisplayPageClient menu={menu} specials={specials} initialTheme={theme} />;
}
