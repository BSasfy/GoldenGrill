import { DisplayRotator } from "@/components/DisplayRotator";
import { getDisplayTheme, getMenu, getSpecials } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function DisplayPage() {
  const [menu, specials, theme] = await Promise.all([
    getMenu(),
    getSpecials(),
    getDisplayTheme(),
  ]);
  return <DisplayRotator menu={menu} specials={specials} theme={theme} />;
}
