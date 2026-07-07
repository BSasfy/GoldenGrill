import { getMenu, getSpecials } from "@/lib/storage";
import { DisplayRotator } from "@/components/DisplayRotator";

export const dynamic = "force-dynamic";

export default async function DisplayPage() {
  const [menu, specials] = await Promise.all([getMenu(), getSpecials()]);
  return <DisplayRotator menu={menu} specials={specials} />;
}
