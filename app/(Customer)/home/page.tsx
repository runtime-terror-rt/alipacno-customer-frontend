"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StartOrderClient from "../../../components/StartOrderClient";

export default function CustomerHome() {
  const router = useRouter();
  const [selectedMealType, setSelectedMealType] = useState("delivery");

  const mealTypes = [
    {
      id: "delivery",
      title: "Delivery",
      subtitle: "To your doorstep",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path
            d="M4 14L12.82 5.18C13.1921 4.80566 13.6346 4.50868 14.1221 4.30616C14.6095 4.10363 15.1322 3.99958 15.66 4H32.34C32.8678 3.99958 33.3905 4.10363 33.8779 4.30616C34.3654 4.50868 34.8079 4.80566 35.18 5.18L44 14"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 24V40C8 41.0609 8.42143 42.0783 9.17157 42.8284C9.92172 43.5786 10.9391 44 12 44H36C37.0609 44 38.0783 43.5786 38.8284 42.8284C39.5786 42.0783 40 41.0609 40 40V24"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30 44V36C30 34.9391 29.5786 33.9217 28.8284 33.1716C28.0783 32.4214 27.0609 32 26 32H22C20.9391 32 19.9217 32.4214 19.1716 33.1716C18.4214 33.9217 18 34.9391 18 36V44"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 14H44"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M44 14V20C44 21.0609 43.5786 22.0783 42.8284 22.8284C42.0783 23.5786 41.0609 24 40 24C38.8315 23.9357 37.7155 23.4935 36.82 22.74C36.5814 22.5675 36.2944 22.4747 36 22.4747C35.7056 22.4747 35.4186 22.5675 35.18 22.74C34.2845 23.4935 33.1685 23.9357 32 24C30.8315 23.9357 29.7155 23.4935 28.82 22.74C28.5814 22.5675 28.2944 22.4747 28 22.4747C27.7056 22.4747 27.4186 22.5675 27.18 22.74C26.2845 23.4935 25.1685 23.9357 24 24C22.8315 23.9357 21.7155 23.4935 20.82 22.74C20.5814 22.5675 20.2944 22.4747 20 22.4747C19.7056 22.4747 19.4186 22.5675 19.18 22.74C18.2845 23.4935 17.1685 23.9357 16 24C14.8315 23.9357 13.7155 23.4935 12.82 22.74C12.5814 22.5675 12.2944 22.4747 12 22.4747C11.7056 22.4747 11.4186 22.5675 11.18 22.74C10.2845 23.4935 9.16853 23.9357 8 24C6.93913 24 5.92172 23.5786 5.17157 22.8284C4.42143 22.0783 4 21.0609 4 20V14"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "dine-in",
      title: "Dine-In",
      subtitle: "Reserve a table",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path
            d="M32 4L27.4 8.6C26.3006 9.72157 25.6848 11.2295 25.6848 12.8C25.6848 14.3705 26.3006 15.8784 27.4 17L31 20.6C32.1215 21.6994 33.6294 22.3151 35.2 22.3151C36.7705 22.3151 38.2784 21.6994 39.4 20.6L44 16"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30.0001 30.0001L6.60008 6.6001C5.80185 7.38221 5.1677 8.31573 4.73477 9.346C4.30185 10.3763 4.07886 11.4826 4.07886 12.6001C4.07886 13.7176 4.30185 14.8239 4.73477 15.8542C5.1677 16.8845 5.80185 17.818 6.60008 18.6001L21.2001 33.2001C22.6001 34.6001 25.2001 34.6001 26.8001 33.2001L30.0001 30.0001ZM30.0001 30.0001L44.0001 44.0001"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.19995 43.6L17 31"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M38 10L24 24"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "table-order",
      title: "Table Order",
      subtitle: "Order from seat",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path
            d="M24 6V4"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30.8 34.8L37.2 29.2C37.5808 28.8323 38.0304 28.5432 38.5229 28.3492C39.0155 28.1552 39.5414 28.0602 40.0707 28.0695C40.6 28.0788 41.1223 28.1922 41.6077 28.4033C42.0932 28.6145 42.5323 28.9191 42.9 29.3C43.2677 29.6808 43.5568 30.1303 43.7508 30.6229C43.9447 31.1155 44.0398 31.6414 44.0305 32.1707C44.0212 32.7 43.9078 33.2223 43.6966 33.7077C43.4855 34.1932 43.1808 34.6323 42.8 35L35.6 41.6C34.2 43.2 32.2 44 30 44H22C19.8 44 17.8 43.2 16.4 41.6L13.796 38.672C13.6085 38.4609 13.3785 38.2918 13.121 38.176C12.8635 38.0602 12.5844 38.0002 12.302 38H10"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 28H28C29.0609 28 30.0783 28.4214 30.8284 29.1716C31.5786 29.9217 32 30.9391 32 32C32 33.0609 31.5786 34.0783 30.8284 34.8284C30.0783 35.5786 29.0609 36 28 36H24"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 20H40"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 20C10 16.287 11.475 12.726 14.1005 10.1005C16.726 7.475 20.287 6 24 6C27.713 6 31.274 7.475 33.8995 10.1005C36.525 12.726 38 16.287 38 20"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 28V40C10 40.5304 9.78929 41.0391 9.41421 41.4142C9.03914 41.7893 8.53043 42 8 42H4"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
      className="
        h-[100dvh] w-full
        bg-[#1E1E20] bg-cover bg-no-repeat bg-center
        overflow-hidden
        flex flex-col items-center justify-center
        px-4 sm:px-6 lg:px-8
        select-none
        relative
      "
      style={{
        backgroundImage: "url('/customer/bg-image.png')",
        backgroundPosition: "center 105px",
      }}
    >
      <StartOrderClient />

      <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-40 flex items-center gap-2">
        <Link href="/phone-login" className="text-sm font-medium text-[#F9671A] hover:text-white transition-colors">
          Login
        </Link>
        <span className="text-[#F9671A] text-sm">/</span>
        <Link href="/signup" className="text-sm font-medium text-[#F9671A] hover:text-white transition-colors">
          Sign up
        </Link>
      </div>

      {/*
        Inner scroll container — handles overflow only when viewport is genuinely
        too short (e.g. landscape phone). Invisible scrollbar on all other devices.
      */}
      <div
        className="
          w-full max-w-[1100px]
          h-full
          flex flex-col justify-between
          overflow-y-auto
          py-6 sm:py-8
          scrollbar-none
        "
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* 1. Logo */}
        <div className="flex justify-center items-center flex-shrink-0  mb-6 lg:mb-0">
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
        <div
          className="
            w-full rounded-[16px]
            pl-4 sm:pl-10 pr-0 py-0
            flex items-center justify-between
            relative shadow-xl overflow-hidden
            border border-[#2d2d2d]
            flex-shrink-0
            h-[130px] sm:h-[180px] md:h-[210px]
          "
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
            )`,
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

          {/* Right Images */}
          <div className="h-full flex items-end justify-end relative z-10 flex-shrink-0 w-[42%] sm:w-auto">
            <img
              src="/customer/banner-men.png"
              alt="Delivery Man"
              className="h-[85%] sm:h-[96%] w-auto object-contain object-bottom -mr-[45%] sm:-mr-[24%] z-0"
            />
            <img
              src="/customer/banner-woman.png"
              alt="Woman Eating"
              className="h-[95%] sm:h-[96%] w-auto object-contain object-bottom z-10"
            />
          </div>
        </div>

        {/* 3. Choose how you'd like to enjoy your meal */}
        <div className="w-full flex flex-col items-center gap-4 sm:gap-5 flex-shrink-0 px-2 sm:px-0">
          <h2 className="text-[22px] sm:text-xl md:text-2xl font-bold text-white text-center tracking-wide px-4 sm:px-0 leading-snug">
            Choose how you&apos;d like <br className="block sm:hidden" />
            to enjoy your meal
          </h2>

          {/* px-1 gives breathing room so the checkmark badge isn't clipped by parent overflow */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-1">
            {mealTypes.map((meal) => {
              const isSelected = selectedMealType === meal.id;
              return (
                <div
                  key={meal.id}
                  onClick={() => {
                    setSelectedMealType(meal.id);
                    router.push("/menu");
                  }}
                  className="relative rounded-[20px] p-4 sm:p-5 flex flex-col items-center text-center cursor-pointer transition-all duration-300"
                  style={{
                    background: isSelected
                      ? "radial-gradient(ellipse at bottom right, #7A3A1E 0%, #4A2A18 30%, #2C2C2E 70%)"
                      : "#2a2a2c",
                    boxShadow: isSelected
                      ? "0 12px 40px rgba(249,103,26,0.15)"
                      : "0 4px 16px rgba(0,0,0,0.25)",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {/* Checkmark badge — inside card, top-left corner */}
                  {isSelected && (
                    <div
                      className="absolute top-3 left-3 w-6 h-6 bg-[#F9671A] rounded-full flex items-center justify-center text-white z-10"
                      style={{ boxShadow: "0 3px 10px rgba(249,103,26,0.5)" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                  )}

                  {/* Orange Icon Circle */}
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 sm:mb-3"
                    style={{
                      background: "linear-gradient(145deg, #FA8C3A 0%, #F9671A 55%, #E05510 100%)",
                      boxShadow: "0 6px 22px rgba(249,103,26,0.45)",
                    }}
                  >
                    {meal.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white mb-0.5">
                    {meal.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-[11px] sm:text-xs text-zinc-400">
                    {meal.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Popular Right Now */}
        <div className="w-full flex flex-col items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center tracking-wide">
            Popular Right Now
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-4.5 w-full">
            {popularDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-[#2a2a2c] border border-white/5 rounded-[20px] overflow-hidden flex flex-col shadow-xl hover:border-white/20 transition-all duration-300 group cursor-pointer"
              >
                <div className="relative w-full h-[180px] sm:h-[160px] md:h-[170px] bg-[#1E1E20] overflow-hidden">
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