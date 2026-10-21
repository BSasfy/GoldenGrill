"use client";

import type { DisplayTheme, MenuCategory, MenuColumn, MenuData } from "@/lib/types";
import { tvScreenClass } from "@/lib/display-theme";
import { groupCategoriesIntoColumns } from "@/lib/menu-pagination";

function formatPrice(price: string): string {
  const trimmed = price.trim();
  if (trimmed.startsWith("£")) return trimmed;
  return `£${trimmed}`;
}

function CategorySection({ category }: { category: MenuCategory }) {
  return (
    <section>
      <h2 className="tv-category border-b font-bold uppercase tracking-wider">
        {category.name}
      </h2>
      <ul className="tv-item-list">
        {category.items
          .filter((item) => !item.hidden)
          .map((item) => (
            <li key={item.id}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="tv-item-name">{item.name}</span>
                <span className="tv-item-price shrink-0">
                  {formatPrice(item.price)}
                </span>
              </div>
              {item.description && (
                <p className="tv-description">{item.description}</p>
              )}
            </li>
          ))}
      </ul>
    </section>
  );
}

export function MenuBoard({
  menu,
  theme = "dark",
  columns,
}: {
  menu: MenuData;
  theme?: DisplayTheme;
  columns?: MenuColumn[];
}) {
  const resolvedColumns =
    columns ??
    groupCategoriesIntoColumns(menu.categories.filter((c) => !c.hidden));

  return (
    <div className={`${tvScreenClass(theme)} tv-layout`}>
      <header className="tv-header tv-header-block border-b">
        <h1 className="tv-title font-black uppercase tracking-wide">
          {menu.title}
        </h1>
        {menu.tagline && <p className="tv-tagline">{menu.tagline}</p>}
      </header>

      <div className="tv-content">
        <div className="tv-menu-grid">
          {resolvedColumns.map((column) => (
            <div key={column.map((c) => c.id).join("-")} className="tv-menu-column">
              {column.map((category) => (
                <CategorySection key={category.id} category={category} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
