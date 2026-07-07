"use client";

import { useActionState, useState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="mx-auto w-full max-w-md space-y-4">
      <div>
        <label htmlFor="password" className="admin-subtle mb-2 block text-sm font-medium">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="admin-input w-full rounded-lg px-4 py-3 outline-none"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="admin-btn-primary w-full rounded-lg px-4 py-3 font-semibold transition disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function newId(): string {
  return crypto.randomUUID().slice(0, 8);
}

export function MenuEditor({
  initialMenu,
  onSave,
}: {
  initialMenu: import("@/lib/types").MenuData;
  onSave: (data: import("@/lib/types").MenuData) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [menu, setMenu] = useState(initialMenu);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const result = await onSave(menu);
      setStatus(result.ok ? "Menu saved." : result.error ?? "Save failed.");
    } catch {
      setStatus("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="admin-heading text-2xl font-bold">Main menu</h2>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn-primary rounded-lg px-5 py-2 font-semibold transition disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save menu"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="admin-muted mb-1 block text-sm">Restaurant name</span>
          <input
            value={menu.title}
            onChange={(e) => setMenu({ ...menu, title: e.target.value })}
            className="admin-input w-full rounded-lg px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="admin-muted mb-1 block text-sm">Tagline</span>
          <input
            value={menu.tagline ?? ""}
            onChange={(e) => setMenu({ ...menu, tagline: e.target.value })}
            className="admin-input w-full rounded-lg px-3 py-2"
          />
        </label>
      </div>

      {menu.categories.map((category, catIndex) => (
        <div key={category.id} className="admin-card rounded-xl p-5">
          <div className="mb-4 flex items-center gap-3">
            <input
              value={category.name}
              onChange={(e) => {
                const categories = [...menu.categories];
                categories[catIndex] = { ...category, name: e.target.value };
                setMenu({ ...menu, categories });
              }}
              className="admin-input-accent flex-1 rounded-lg px-3 py-2 text-lg font-semibold"
            />
            <button
              type="button"
              onClick={() => {
                const categories = menu.categories.filter((_, i) => i !== catIndex);
                setMenu({ ...menu, categories });
              }}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Remove category
            </button>
          </div>

          <div className="space-y-3">
            {category.items.map((item, itemIndex) => (
              <div key={item.id} className="admin-surface grid gap-2 rounded-lg p-3 md:grid-cols-[1fr_1fr_100px_auto]">
                <input
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => {
                    const categories = [...menu.categories];
                    const items = [...category.items];
                    items[itemIndex] = { ...item, name: e.target.value };
                    categories[catIndex] = { ...category, items };
                    setMenu({ ...menu, categories });
                  }}
                  className="admin-input rounded px-3 py-2"
                />
                <input
                  placeholder="Description"
                  value={item.description ?? ""}
                  onChange={(e) => {
                    const categories = [...menu.categories];
                    const items = [...category.items];
                    items[itemIndex] = { ...item, description: e.target.value };
                    categories[catIndex] = { ...category, items };
                    setMenu({ ...menu, categories });
                  }}
                  className="admin-input rounded px-3 py-2"
                />
                <input
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => {
                    const categories = [...menu.categories];
                    const items = [...category.items];
                    items[itemIndex] = { ...item, price: e.target.value };
                    categories[catIndex] = { ...category, items };
                    setMenu({ ...menu, categories });
                  }}
                  className="admin-input rounded px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const categories = [...menu.categories];
                    const items = category.items.filter((_, i) => i !== itemIndex);
                    categories[catIndex] = { ...category, items };
                    setMenu({ ...menu, categories });
                  }}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              const categories = [...menu.categories];
              const items = [
                ...category.items,
                { id: newId(), name: "", description: "", price: "" },
              ];
              categories[catIndex] = { ...category, items };
              setMenu({ ...menu, categories });
            }}
            className="admin-link mt-3 text-sm hover:underline"
          >
            + Add item
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          setMenu({
            ...menu,
            categories: [
              ...menu.categories,
              { id: newId(), name: "New category", items: [] },
            ],
          });
        }}
        className="admin-add-btn rounded-lg px-4 py-2 transition"
      >
        + Add category
      </button>

      {status && (
        <p
          className={`text-sm ${status.endsWith("saved.") ? "admin-subtle" : "text-red-600"}`}
          role={status.endsWith("saved.") ? undefined : "alert"}
        >
          {status}
        </p>
      )}
    </section>
  );
}

export function SpecialsEditor({
  initialSpecials,
  onSave,
}: {
  initialSpecials: import("@/lib/types").SpecialsData;
  onSave: (data: import("@/lib/types").SpecialsData) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [specials, setSpecials] = useState(initialSpecials);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const result = await onSave(specials);
      setStatus(result.ok ? "Specials saved." : result.error ?? "Save failed.");
    } catch {
      setStatus("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="admin-heading text-2xl font-bold">Daily specials</h2>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn-primary rounded-lg px-5 py-2 font-semibold transition disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save specials"}
        </button>
      </div>

      <label className="block">
        <span className="admin-muted mb-1 block text-sm">Screen title</span>
        <input
          value={specials.title}
          onChange={(e) => setSpecials({ ...specials, title: e.target.value })}
          className="admin-input w-full rounded-lg px-3 py-2"
        />
      </label>

      <div className="admin-hero-card rounded-xl p-5">
        <h3 className="admin-heading mb-4 text-lg font-semibold">Hero offer (main deal)</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            placeholder="Badge (e.g. Best Value)"
            value={specials.hero.badge ?? ""}
            onChange={(e) =>
              setSpecials({
                ...specials,
                hero: { ...specials.hero, badge: e.target.value },
              })
            }
            className="admin-input rounded px-3 py-2"
          />
          <input
            placeholder="Price"
            value={specials.hero.price}
            onChange={(e) =>
              setSpecials({
                ...specials,
                hero: { ...specials.hero, price: e.target.value },
              })
            }
            className="admin-input rounded px-3 py-2"
          />
          <input
            placeholder="Offer name"
            value={specials.hero.name}
            onChange={(e) =>
              setSpecials({
                ...specials,
                hero: { ...specials.hero, name: e.target.value },
              })
            }
            className="admin-input rounded px-3 py-2 md:col-span-2"
          />
          <input
            placeholder="Description"
            value={specials.hero.description ?? ""}
            onChange={(e) =>
              setSpecials({
                ...specials,
                hero: { ...specials.hero, description: e.target.value },
              })
            }
            className="admin-input rounded px-3 py-2 md:col-span-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="admin-heading text-lg font-semibold">Additional offers</h3>
        {specials.offers.map((offer, index) => (
          <div key={offer.id} className="admin-card grid gap-2 rounded-lg p-3 md:grid-cols-[1fr_1fr_100px_auto]">
            <input
              placeholder="Offer name"
              value={offer.name}
              onChange={(e) => {
                const offers = [...specials.offers];
                offers[index] = { ...offer, name: e.target.value };
                setSpecials({ ...specials, offers });
              }}
              className="admin-input rounded px-3 py-2"
            />
            <input
              placeholder="Description"
              value={offer.description ?? ""}
              onChange={(e) => {
                const offers = [...specials.offers];
                offers[index] = { ...offer, description: e.target.value };
                setSpecials({ ...specials, offers });
              }}
              className="admin-input rounded px-3 py-2"
            />
            <input
              placeholder="Price"
              value={offer.price}
              onChange={(e) => {
                const offers = [...specials.offers];
                offers[index] = { ...offer, price: e.target.value };
                setSpecials({ ...specials, offers });
              }}
              className="admin-input rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={() => {
                const offers = specials.offers.filter((_, i) => i !== index);
                setSpecials({ ...specials, offers });
              }}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            setSpecials({
              ...specials,
              offers: [
                ...specials.offers,
                { id: newId(), name: "", description: "", price: "" },
              ],
            });
          }}
          className="admin-link text-sm hover:underline"
        >
          + Add offer
        </button>
      </div>

      {status && (
        <p
          className={`text-sm ${status.endsWith("saved.") ? "admin-subtle" : "text-red-600"}`}
          role={status.endsWith("saved.") ? undefined : "alert"}
        >
          {status}
        </p>
      )}
    </section>
  );
}
