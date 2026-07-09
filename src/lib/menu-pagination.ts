import type { MenuCategory } from "./types";

export const MENU_CATEGORIES_PER_PAGE = 3;

export function paginateMenuCategories(
  categories: MenuCategory[],
  pageSize = MENU_CATEGORIES_PER_PAGE,
): MenuCategory[][] {
  if (categories.length === 0) return [[]];

  const pages: MenuCategory[][] = [];
  for (let index = 0; index < categories.length; index += pageSize) {
    pages.push(categories.slice(index, index + pageSize));
  }

  return pages;
}
