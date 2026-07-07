import { SpecialsBoard } from "@/components/SpecialsBoard";
import { getDisplayTheme } from "@/lib/display-theme";
import { getSpecials } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function SpecialsPage() {
  const specials = await getSpecials();
  return <SpecialsBoard specials={specials} theme={getDisplayTheme()} />;
}
