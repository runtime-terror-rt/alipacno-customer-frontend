import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "../../store/store";
import { logout } from "../slice/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.pacinos.uk",
  prepareHeaders: (headers, { getState, endpoint }) => {
    console.log("Preparing headers for API call, endpoint:", endpoint);

    // Skip auth header for login, register and getPages endpoints
    if (endpoint === "login" || endpoint === "register" || endpoint === "getPages") {
      console.log(`Skipping authorization header for ${endpoint}`);
    } else {
      const token = (getState() as RootState).auth.token;
      if (token) {
        console.log("Token found, adding to headers");
        headers.set("authorization", `Bearer ${token}`);
      } else {
        console.warn("No token found in auth state");
      }
    }

    if (typeof window !== "undefined") {
      let sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        // Generate a simple UUID-like string if crypto.randomUUID is not available
        sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("session_id", sessionId);
      }
      headers.set("X-Session-ID", sessionId);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.warn("401 Unauthenticated error received. Logging out user...");
    api.dispatch(logout());
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Profile",
    "Cart",
    "Orders",
    "Wishlist",
    "Pages",
    "Branches"
  ],
  endpoints: () => ({}),
});
