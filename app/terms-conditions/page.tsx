"use client";

import { useGetPagesQuery } from "@/redux/features/api/pagesApi";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsAndConditions() {
  const router = useRouter();
  const { data: pagesData, isLoading, isError } = useGetPagesQuery(undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181A]">
        <Loader2 className="w-10 h-10 animate-spin text-[#F9671A]" />
      </div>
    );
  }

  if (isError || !pagesData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181A]">
        <div className="text-white text-xl">Failed to load Terms & Conditions.</div>
      </div>
    );
  }

  // Find the terms and conditions page by slug
  const termsPage = pagesData.data.find(
    (page: any) => page.slug === "terms conditions" || page.slug === "terms-conditions"
  );

  if (!termsPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181A]">
        <div className="text-white text-xl">Terms & Conditions not found.</div>
      </div>
    );
  }

  const { content, title } = termsPage;

  return (
    <div className="min-h-screen bg-[#18181A] pt-10 pb-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto bg-[#1E1E20] border border-white/5 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F9671A] to-[#FFA175]" />

        <div className="p-8 md:p-12">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-[#F9671A] transition-colors duration-200 mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Go Back</span>
          </button>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {content?.heading || title || "Terms & Conditions"}
          </h1>
          
          {content?.intro && (
            <div className="mb-10 text-[#FFF7F3]/70 text-base md:text-lg leading-relaxed border-l-4 border-[#F9671A] pl-6 py-2 bg-white/5 rounded-r-lg">
              {content.intro}
            </div>
          )}

          <div className="space-y-12">
            {content?.sections?.map((section: any, idx: number) => (
              <div key={idx} className="space-y-4">
                {section.title && (
                  <h2 className="text-2xl font-semibold text-[#FFA175] flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#F9671A]" />
                    {section.title}
                  </h2>
                )}
                
                {section.body?.map((paragraph: string, pIdx: number) => (
                  <p key={pIdx} className="text-[#FFF7F3]/80 leading-relaxed text-[15px] md:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
