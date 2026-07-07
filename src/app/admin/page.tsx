import { isAdminAuthenticated } from "@/lib/auth";
import { getMenu, getSpecials } from "@/lib/storage";
import { logoutAction } from "./actions";
import { AdminDashboard } from "./AdminDashboard";
import { LoginForm } from "./AdminPanel";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#14110e] px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#d4a853]">Golden Grill Admin</h1>
            <p className="mt-2 text-[#a89a88]">Sign in to update the menu and daily specials</p>
          </div>
          <LoginForm />
        </div>
      </main>
    );
  }

  const [menu, specials] = await Promise.all([getMenu(), getSpecials()]);

  return (
    <main className="min-h-screen bg-[#14110e] px-6 py-10 text-[#f5efe6]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#3d3428] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#d4a853]">Golden Grill Admin</h1>
            <p className="mt-1 text-[#a89a88]">
              Changes appear on the TV within a few minutes
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-[#3d3428] px-4 py-2 text-sm text-[#c9bfb0] hover:border-[#d4a853]/50"
            >
              Sign out
            </button>
          </form>
        </header>

        <AdminDashboard menu={menu} specials={specials} />

        <footer className="mt-12 border-t border-[#3d3428] pt-6 text-sm text-[#a89a88]">
          <p>TV display URLs:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <a href="/display" className="text-[#d4a853] hover:underline">
                /display
              </a>{" "}
              — rotates between menu and specials
            </li>
            <li>
              <a href="/menu" className="text-[#d4a853] hover:underline">
                /menu
              </a>{" "}
              — main menu only
            </li>
            <li>
              <a href="/specials" className="text-[#d4a853] hover:underline">
                /specials
              </a>{" "}
              — specials only
            </li>
          </ul>
        </footer>
      </div>
    </main>
  );
}
