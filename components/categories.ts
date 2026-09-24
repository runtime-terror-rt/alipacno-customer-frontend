export type Category = {
  id?: number | string;
  name: string;
  icon?: string | null;
  image?: string | null;
  image_url?: string | null;
  hasDropdown?: boolean;
  [key: string]: any;
};

export const categories: Category[] = [
  { name: "Steaks", icon: "/customer/menu/steaks.svg" },
  { name: "Starters", icon: "/customer/menu/starters.svg" },
  { name: "Sides", icon: "/customer/menu/sides.svg" },
  { name: "Drinks", icon: "/customer/menu/drinks.svg" },
  { name: "Desserts", icon: "/customer/menu/desserts.svg" },
  { name: "Lunch Special", icon: "/customer/menu/lunch.svg" },
];