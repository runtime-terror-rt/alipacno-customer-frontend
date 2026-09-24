"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryIcon from "@/public/CategoryIcon";
import { useGetCategoriesQuery } from "@/redux/features/api/categoriesApi";
import { Category } from "@/components/categories";

type Props = {
  categories?: Category[] | any[];
  activeCategory?: string;
  onSelect?: (name: string) => void;
};

export default function CategorySidebar({ categories: propCategories, activeCategory = "", onSelect }: Props) {
  const router = useRouter();
  const { data: categoriesData } = useGetCategoriesQuery(
    { all: 1 },
    { skip: Boolean(propCategories && propCategories.length > 0) }
  );

  const categories: any[] = (propCategories && propCategories.length > 0)
    ? propCategories
    : (Array.isArray(categoriesData?.data) ? categoriesData.data : (Array.isArray(categoriesData) ? categoriesData : []));

  const handleSelect = (name: string) => {
    if (onSelect) {
      onSelect(name);
    } else {
      router.push(`/menu?category=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="hidden lg:flex w-[240px] md:w-[260px] flex-shrink-0 border-r border-white/5 bg-[#1a1a1c] flex-col z-20">
      <div className="h-[90px] flex items-center justify-center px-6 mt-4">
        <Link href="/home">
          <Image src="/logo.png" alt="Logo" width={130} height={80} priority />
        </Link>
      </div>
      <div className="border-b border-white/5 mt-4"></div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6">
        <h3 className="text-white font-bold text-[18px] mb-4 pl-6">Menu Categories</h3>
        <div className="flex flex-col">
          {categories.map((cat: any, i: number) => {
            const catName = cat?.name || "";
            const isActive = activeCategory === catName;
            return (
              <button
                key={cat.id || i}
                onClick={() => handleSelect(catName)}
                className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${
                  isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"
                }`}
              >
                <div className={`w-[22px] h-[22px] mr-4 flex items-center justify-center ${isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                  <CategoryIcon cat={cat} name={catName} isActive={isActive} />
                </div>
                <span className={`text-[16px] font-medium flex-1 text-left ${isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                  {catName}
                </span>
                {cat.hasDropdown && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-2 ${isActive ? "text-[#F9671A]" : "text-zinc-500"}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}