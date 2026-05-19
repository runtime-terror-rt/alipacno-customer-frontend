"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerHome() {
  const router = useRouter();
  const [selectedMealType, setSelectedMealType] = useState("delivery");

  const mealTypes = [
    {
      id: "delivery",
      title: "Delivery",
      subtitle: "To your doorstep",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      ),
    },
    {
      id: "collection",
      title: "Collection",
      subtitle: "Pick up in-store",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
    {
      id: "dine-in",
      title: "Dine-In",
      subtitle: "Reserve a table",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
          <path d="M7 2v20"></path>
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"></path>
        </svg>
      ),
    },
    {
      id: "table-order",
      title: "Table Order",
      subtitle: "Order from seat",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      ),
    },
  ];

  const popularDishes = [
    {
      id: 1,
      name: "Filet Mignon",
      price: "£39.99",
      oldPrice: "£52.00",
      unit: "/portion",
      rating: "4.5",
      image: "/customer/popular-1.png",
    },
    {
      id: 2,
      name: "Ribeye Steak",
      price: "£39.99",
      oldPrice: "£52.00",
      unit: "/portion",
      rating: "4.5",
      image: "/customer/popular-2.png",
    },
    {
      id: 3,
      name: "Vegetable Stir Fry",
      price: "£39.99",
      oldPrice: "£52.00",
      unit: "/portion",
      rating: "4.5",
      image: "/customer/popular-3.png",
    },
    {
      id: 4,
      name: "Pork Belly Bao",
      price: "£39.99",
      oldPrice: "£52.00",
      unit: "/portion",
      rating: "4.5",
      image: "/customer/popular-4.png",
    },
  ];

  return (
    <div
      className="min-h-screen w-full bg-[#1E1E20] bg-cover bg-no-repeat bg-center overflow-x-hidden overflow-y-auto flex flex-col items-center justify-start lg:justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-8 select-none"
      style={{
        backgroundImage: "url('/customer/bg-image.png')",
        backgroundPosition: "center 105px",
      }}
    >
      {/* Main Content Container — Max width 1100px, Max height 850px, perfectly proportioned */}
      <div className="w-full max-w-[1100px] h-full lg:max-h-[850px] flex flex-col justify-start lg:justify-between my-auto z-10 gap-6 lg:gap-0">
        {/* 1. Logo */}
     <div className="flex justify-center items-center flex-shrink-0">
  <Image
    src="/logo.png"
    alt="Pacino's Logo"
    width={170}
    height={120}
    className="object-contain"
    priority
  />
</div>
        {/* 2. Big Banner */}
        <div className="w-full bg-gradient-to-r from-[#FFF8F4] to-[#FFB894] rounded-[16px] pl-4 sm:pl-10 pr-0 py-0 flex items-center justify-between relative shadow-xl overflow-hidden border border-[#2d2d2d] flex-shrink-0 my-1 lg:mt-6 h-[130px] sm:h-[180px] md:h-[210px]"
        
        style={{
  background: `linear-gradient(
    90deg,
    #FEF0E7 0%,
    #FDDEC8 50%,
    #FBCAAA 60%,
    #F5A87A 80%,
    #EF8A52 85%,
    #F8D0B0 93%,
    #FFF5EE 100%
  )`
}}
        >
          {/* Left Text */}
          <div className="z-10 text-left py-2 sm:py-6 flex-1 pr-1 sm:pr-0">
            <p className="text-[#1A1A1A] text-[9px] sm:text-[15px] md:text-[17px] font-medium mb-1 sm:mb-2 tracking-wide leading-tight">
              Craving something delicious?
            </p>
            <h1 className="text-[12px] sm:text-[32px] md:text-[40px] lg:text-[44px] font-bold text-[#1A1A1A] leading-[1.2] tracking-tight whitespace-nowrap">
              Food ordering is now more
            </h1>
            <h1 className="text-[12px] sm:text-[32px] md:text-[40px] lg:text-[44px] font-bold text-[#F9671A] leading-[1.2] tracking-tight whitespace-nowrap">
              personalized and instant
            </h1>
          </div>

          {/* Right Images (Delivery Man & Woman Eating) */}
          <div className="h-full flex items-end justify-end relative z-10 flex-shrink-0 w-[42%] sm:w-auto">
            {/* Delivery Man */}
            <img
              src="/customer/banner-men.png"
              alt="Delivery Man"
              className="h-[85%] sm:h-[96%] w-auto object-contain object-bottom -mr-[45%] sm:-mr-[24%] z-0"
            />
            {/* Woman Eating */}
            <img
              src="/customer/banner-woman.png"
              alt="Woman Eating"
              className="h-[95%] sm:h-[96%] w-auto object-contain object-bottom z-10"
            />
          </div>
        </div>

        {/* 3. Choose how you'd like to enjoy your meal */}
        <div className="w-full flex flex-col items-center space-y-4 sm:space-y-5 my-1 flex-shrink-0 px-2 sm:px-0">
        <h2 className="text-[22px] sm:text-xl md:text-2xl font-bold text-white text-center tracking-wide py-1 px-4 sm:px-0 leading-snug">
  Choose how you&apos;d like <br className="block sm:hidden" /> 
  to enjoy your meal
</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-4.5 w-full">
            {mealTypes.map((meal) => {
              const isSelected = selectedMealType === meal.id;
              return (
                <div
                  key={meal.id}
                  onClick={() => {
                    setSelectedMealType(meal.id);
                    router.push('/menu');
                  }}
                  className={`relative rounded-[20px] p-4 sm:p-5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 shadow-xl ${
                    isSelected
                      ? "bg-gradient-to-b from-[#3a3a3c] via-[#302622] to-[#452618] border border-[#F9671A]/40 shadow-orange-600/10 scale-[1.02]"
                      : "bg-[#2a2a2c] border border-white/5 hover:border-white/20 hover:bg-[#303032]"
                  }`}
                >
                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-3 left-3 w-5 h-5 sm:w-6 sm:h-6 bg-[#F9671A] rounded-full flex items-center justify-center text-white shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-3.5 sm:h-3.5">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    </div>
                  )}

                  {/* Icon Circle */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F9671A] rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-lg shadow-orange-600/30">
                    {meal.icon}
                  </div>

                  {/* Titles */}
                  <h3 className="text-sm sm:text-base font-bold text-white mb-0.5">{meal.title}</h3>
                  <p className="text-[11px] sm:text-xs text-zinc-400">{meal.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Popular Right Now */}
        <div className="w-full flex flex-col items-center space-y-2.5 sm:space-y-3 my-1 flex-shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center tracking-wide py-1">
            Popular Right Now
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-4.5 w-full">
            {popularDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-[#2a2a2c] border border-white/5 rounded-[20px] overflow-hidden flex flex-col shadow-xl hover:border-white/20 transition-all duration-300 group cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative w-full h-[180px] sm:h-[160px] md:h-[170px] bg-[#1E1E20] overflow-hidden">
                  {/* Rating Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-[#1E1E20]/90 backdrop-blur-md border border-white/10 px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-white z-10 shadow-md">
                    <span className="text-[#F9671A] text-xs">★</span> {dish.rating}
                  </div>

                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Dish Info */}
                <div className="p-3 sm:p-4 flex flex-col space-y-1 bg-[#2a2a2c]">
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#F9671A] transition-colors duration-300 truncate">
                    {dish.name}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium truncate">
                    <span className="font-extrabold text-[#F9671A]">{dish.price}</span>
                    <span className="text-zinc-500 line-through text-[10px] sm:text-[11px]">{dish.oldPrice}</span>
                    <span className="text-zinc-400 text-[10px] sm:text-[11px]">{dish.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
