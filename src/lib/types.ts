export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  hidden?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  hidden?: boolean;
  items: MenuItem[];
}

export interface MenuData {
  title: string;
  tagline?: string;
  categories: MenuCategory[];
}

export interface SpecialOffer {
  id: string;
  name: string;
  description?: string;
  price: string;
}

export interface SpecialsData {
  title: string;
  hero: SpecialOffer & { badge?: string };
  offers: SpecialOffer[];
}

export type DisplayTheme = "dark" | "bright";

export interface SettingsData {
  displayTheme: DisplayTheme;
}
