import { isAdminAuthenticated } from "@/lib/auth";
import { getDisplayTheme, getMenu, getSpecials } from "@/lib/storage";
import { logoutAction } from "./actions";
import { AdminDashboard } from "./AdminDashboard";
import { LoginForm } from "./AdminPanel";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  const displayTheme = await getDisplayTheme();
  const adminThemeClass =
    displayTheme === "dark" ? "admin-page admin-page--dark" : "admin-page";

  if (!authenticated) {
    return (
      <main
        className={`${adminThemeClass} flex min-h-screen items-center justify-center px-6 py-12`}
      >
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="admin-heading text-3xl font-bold">
              Golden Grill Admin
            </h1>
            <p className="admin-muted mt-2">
              Sign in to update the menu and daily specials
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    );
  }

  const [menu, specials] = await Promise.all([getMenu(), getSpecials()]);

  return (
    <main className={`${adminThemeClass} min-h-screen px-6 py-10`}>
      <div className="mx-auto max-w-5xl">
        <header className="admin-divider mb-10 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="admin-heading text-3xl font-bold">
              Golden Grill Admin
            </h1>
            <p className="admin-muted mt-1">
              Changes appear on the TV immediately after saving and reloading
              the page
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="admin-btn-secondary rounded-lg px-4 py-2 text-sm transition"
            >
              Sign out
            </button>
          </form>
        </header>

        <AdminDashboard
          menu={menu}
          specials={specials}
          displayTheme={displayTheme}
        />

        <footer className="admin-divider admin-muted mt-12 border-t pt-6 text-sm">
          <p>TV display URLs:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <a href="/display" className="admin-link hover:underline">
                /display
              </a>{" "}
              — rotates between menu and specials
            </li>
            <li>
              <a href="/menu" className="admin-link hover:underline">
                /menu
              </a>{" "}
              — main menu only
            </li>
            <li>
              <a href="/specials" className="admin-link hover:underline">
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
