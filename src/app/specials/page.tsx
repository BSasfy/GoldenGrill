import { getSpecials } from "@/lib/storage";
import { SpecialsBoard } from "@/components/SpecialsBoard";

export const dynamic = "force-dynamic";

export default async function SpecialsPage() {
  const specials = await getSpecials();
  return <SpecialsBoard specials={specials} />;
}
