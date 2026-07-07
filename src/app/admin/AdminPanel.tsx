"use client";

import { useActionState, useState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="mx-auto w-full max-w-md space-y-4">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#c9bfb0]">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-lg border border-[#3d3428] bg-[#1c1814] px-4 py-3 text-[#f5efe6] outline-none focus:border-[#d4a853]"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#d4a853] px-4 py-3 font-semibold text-[#14110e] transition hover:bg-[#e0b96a] disabled:opacity-60"
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
    const result = await onSave(menu);
    setSaving(false);
    setStatus(result.ok ? "Menu saved." : result.error ?? "Save failed.");
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#d4a853]">Main menu</h2>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#d4a853] px-5 py-2 font-semibold text-[#14110e] hover:bg-[#e0b96a] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save menu"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-[#a89a88]">Restaurant name</span>
          <input
            value={menu.title}
            onChange={(e) => setMenu({ ...menu, title: e.target.value })}
            className="w-full rounded-lg border border-[#3d3428] bg-[#1c1814] px-3 py-2 text-[#f5efe6]"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[#a89a88]">Tagline</span>
          <input
            value={menu.tagline ?? ""}
            onChange={(e) => setMenu({ ...menu, tagline: e.target.value })}
            className="w-full rounded-lg border border-[#3d3428] bg-[#1c1814] px-3 py-2 text-[#f5efe6]"
          />
        </label>
      </div>

      {menu.categories.map((category, catIndex) => (
        <div key={category.id} className="rounded-xl border border-[#3d3428] bg-[#1c1814] p-5">
          <div className="mb-4 flex items-center gap-3">
            <input
              value={category.name}
              onChange={(e) => {
                const categories = [...menu.categories];
                categories[catIndex] = { ...category, name: e.target.value };
                setMenu({ ...menu, categories });
              }}
              className="flex-1 rounded-lg border border-[#3d3428] bg-[#14110e] px-3 py-2 text-lg font-semibold text-[#d4a853]"
            />
            <button
              type="button"
              onClick={() => {
                const categories = menu.categories.filter((_, i) => i !== catIndex);
                setMenu({ ...menu, categories });
              }}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Remove category
            </button>
          </div>

          <div className="space-y-3">
            {category.items.map((item, itemIndex) => (
              <div key={item.id} className="grid gap-2 rounded-lg bg-[#14110e] p-3 md:grid-cols-[1fr_1fr_100px_auto]">
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
                  className="rounded border border-[#3d3428] bg-[#1c1814] px-3 py-2 text-[#f5efe6]"
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
                  className="rounded border border-[#3d3428] bg-[#1c1814] px-3 py-2 text-[#f5efe6]"
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
                  className="rounded border border-[#3d3428] bg-[#1c1814] px-3 py-2 text-[#f5efe6]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const categories = [...menu.categories];
                    const items = category.items.filter((_, i) => i !== itemIndex);
                    categories[catIndex] = { ...category, items };
                    setMenu({ ...menu, categories });
                  }}
                  className="text-sm text-red-400 hover:text-red-300"
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
            className="mt-3 text-sm text-[#d4a853] hover:underline"
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
        className="rounded-lg border border-dashed border-[#d4a853]/50 px-4 py-2 text-[#d4a853] hover:bg-[#d4a853]/10"
      >
        + Add category
      </button>

      {status && <p className="text-sm text-[#c9bfb0]">{status}</p>}
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
    const result = await onSave(specials);
    setSaving(false);
    setStatus(result.ok ? "Specials saved." : result.error ?? "Save failed.");
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#d4a853]">Daily specials</h2>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#d4a853] px-5 py-2 font-semibold text-[#14110e] hover:bg-[#e0b96a] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save specials"}
        </button>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm text-[#a89a88]">Screen title</span>
        <input
          value={specials.title}
          onChange={(e) => setSpecials({ ...specials, title: e.target.value })}
          className="w-full rounded-lg border border-[#3d3428] bg-[#1c1814] px-3 py-2 text-[#f5efe6]"
        />
      </label>

      <div className="rounded-xl border border-[#d4a853]/40 bg-[#1c1814] p-5">
        <h3 className="mb-4 text-lg font-semibold text-[#d4a853]">Hero offer (main deal)</h3>
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
            className="rounded border border-[#3d3428] bg-[#14110e] px-3 py-2 text-[#f5efe6]"
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
            className="rounded border border-[#3d3428] bg-[#14110e] px-3 py-2 text-[#f5efe6]"
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
            className="rounded border border-[#3d3428] bg-[#14110e] px-3 py-2 text-[#f5efe6] md:col-span-2"
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
            className="rounded border border-[#3d3428] bg-[#14110e] px-3 py-2 text-[#f5efe6] md:col-span-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#d4a853]">Additional offers</h3>
        {specials.offers.map((offer, index) => (
          <div key={offer.id} className="grid gap-2 rounded-lg bg-[#1c1814] p-3 md:grid-cols-[1fr_1fr_100px_auto]">
            <input
              placeholder="Offer name"
              value={offer.name}
              onChange={(e) => {
                const offers = [...specials.offers];
                offers[index] = { ...offer, name: e.target.value };
                setSpecials({ ...specials, offers });
              }}
              className="rounded border border-[#3d3428] bg-[#14110e] px-3 py-2 text-[#f5efe6]"
            />
            <input
              placeholder="Description"
              value={offer.description ?? ""}
              onChange={(e) => {
                const offers = [...specials.offers];
                offers[index] = { ...offer, description: e.target.value };
                setSpecials({ ...specials, offers });
              }}
              className="rounded border border-[#3d3428] bg-[#14110e] px-3 py-2 text-[#f5efe6]"
            />
            <input
              placeholder="Price"
              value={offer.price}
              onChange={(e) => {
                const offers = [...specials.offers];
                offers[index] = { ...offer, price: e.target.value };
                setSpecials({ ...specials, offers });
              }}
              className="rounded border border-[#3d3428] bg-[#14110e] px-3 py-2 text-[#f5efe6]"
            />
            <button
              type="button"
              onClick={() => {
                const offers = specials.offers.filter((_, i) => i !== index);
                setSpecials({ ...specials, offers });
              }}
              className="text-sm text-red-400 hover:text-red-300"
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
          className="text-sm text-[#d4a853] hover:underline"
        >
          + Add offer
        </button>
      </div>

      {status && <p className="text-sm text-[#c9bfb0]">{status}</p>}
    </section>
  );
}
