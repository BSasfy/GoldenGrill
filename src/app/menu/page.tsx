import { getMenu } from "@/lib/storage";
import { MenuBoard } from "@/components/MenuBoard";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const menu = await getMenu();
  return <MenuBoard menu={menu} />;
}
