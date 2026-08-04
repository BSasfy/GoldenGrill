import { DisplayKeepAlive } from "@/components/DisplayKeepAlive";
import { SpecialsBoard } from "@/components/SpecialsBoard";
import { getDisplayTheme, getSpecials } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function SpecialsPage() {
  const [specials, theme] = await Promise.all([getSpecials(), getDisplayTheme()]);
  return (
    <>
      <DisplayKeepAlive />
      <SpecialsBoard specials={specials} theme={theme} />
    </>
  );
}
