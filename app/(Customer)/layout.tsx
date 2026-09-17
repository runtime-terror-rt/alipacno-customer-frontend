"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store/store";
import { logout } from "../../redux/features/slice/authSlice";
import { useGetMeQuery } from "../../redux/features/api/authApi";
import { isCustomerUser } from "@/utils/auth";
import { toast } from "react-hot-toast";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [isReady, setIsReady] = useState(false);

  const { data: meRes } = useGetMeQuery(undefined, { skip: !token });
  const fetchedUser = meRes?.user || meRes?.data || meRes;

  useEffect(() => {
    // If there is no token, redirect to login
    if (!token) {
      router.push("/login");
      return;
    }

    const currentUser = fetchedUser || user;
    if (currentUser && !isCustomerUser(currentUser)) {
      toast.error("Access denied. Only customer accounts can access this portal.");
      dispatch(logout());
      router.push("/login");
      return;
    }

    setIsReady(true);
  }, [token, user, fetchedUser, router, pathname, dispatch]);

  // Don't render children until we know user is authenticated and authorized as customer
  if (!isReady) {
    return (
      <div className="h-[100dvh] w-full bg-[#1E1E20] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9671A]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
