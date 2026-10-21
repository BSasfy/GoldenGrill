import type { MenuCategory, MenuColumn } from "./types";

export const MENU_COLUMNS_PER_PAGE = 3;

export function groupCategoriesIntoColumns(
  categories: MenuCategory[],
): MenuColumn[] {
  const columns: MenuColumn[] = [];

  for (const category of categories) {
    if (category.stackWithPrevious && columns.length > 0) {
      columns[columns.length - 1].push(category);
    } else {
      columns.push([category]);
    }
  }

  return columns;
}

export function paginateMenuCategories(
  categories: MenuCategory[],
  pageSize = MENU_COLUMNS_PER_PAGE,
): MenuColumn[][] {
  const columns = groupCategoriesIntoColumns(categories);
  if (columns.length === 0) return [[]];

  const pages: MenuColumn[][] = [];
  for (let index = 0; index < columns.length; index += pageSize) {
    pages.push(columns.slice(index, index + pageSize));
  }

  return pages;
}
