import { DisplayRotator } from "@/components/DisplayRotator";
import { getDisplayTheme } from "@/lib/display-theme";
import { getMenu, getSpecials } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function DisplayPage() {
  const [menu, specials] = await Promise.all([getMenu(), getSpecials()]);
  return (
    <DisplayRotator menu={menu} specials={specials} theme={getDisplayTheme()} />
  );
}
