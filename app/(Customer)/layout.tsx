"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useSelector((state: RootState) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If there is no token, redirect to login
    if (!token) {
      router.push("/login");
    } else {
      setIsReady(true);
    }
  }, [token, router, pathname]);

  // Don't render children until we know user is authenticated
  if (!isReady) {
    return (
      <div className="h-[100dvh] w-full bg-[#1E1E20] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9671A]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
