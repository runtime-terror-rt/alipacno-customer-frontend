"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import CategorySidebar from "./components/CategorySidebar";
import MobileSidebarDrawer from "./components/MobileSidebarDrawer";
import MobileDeliveryBar from "./components/MobileDeliveryBar";
import OrdersListView from "./components/OrdersListView";
import OrderDetailsView from "./components/OrderDetailsView";
import NotificationsPanel from "./components/NotificationsPanel";
import OrderDetailsSidebar from "./components/OrderDetailsSidebar";
import { categories } from "@/components/categories";

export default function MyOrdersPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Steaks");
  const [view, setView] = useState<"list" | "details">("list");
  const [selectedOrderId, setSelectedOrderId] = useState<string | number | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSelectOrder = (orderId: string | number) => {
    setSelectedOrderId(orderId);
    setView("details");
  };

  const handleSelectCategory = (name: string) => {
    setActiveCategory(name);
    router.push(`/menu?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#1E1E20] flex flex-col lg:flex-row text-white overflow-hidden font-sans select-none relative">
      <CategorySidebar categories={categories} activeCategory={activeCategory} onSelect={handleSelectCategory} />

      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <MobileDeliveryBar />

        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
          <main className="flex-1 h-auto lg:h-full px-6 sm:px-8 py-6 overflow-visible lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => (view === "details" ? setView("list") : router.push("/menu"))}
                className="text-white hover:text-zinc-300 transition-colors cursor-pointer flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <h1 className="text-[20px] font-bold text-white">
                My Orders {view === "details" && <span className="text-zinc-400 font-medium">/ Active orders / Details</span>}
              </h1>
            </div>

            {view === "list" ? (
              <OrdersListView onSelectOrder={handleSelectOrder} />
            ) : (
              <OrderDetailsView orderId={selectedOrderId} />
            )}
          </main>

          <aside className="w-full lg:w-[355px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#1E1E20] flex flex-col h-auto lg:h-full relative z-30">
            {view === "list" ? <NotificationsPanel /> : <OrderDetailsSidebar orderId={selectedOrderId} />}
          </aside>
        </div>
      </div>

      <MobileSidebarDrawer
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        onSelect={handleSelectCategory}
      />
    </div>
  );
}
