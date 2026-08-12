import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store/store";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
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

      // Add ngrok skip warning header for development
      // headers.set("ngrok-skip-browser-warning", "any");
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Profile",
    "Cart",
    "Orders",
    "Wishlist",
    "Pages"
  ], // Kept minimal as requested ("unnessecery jeno kicu na thake"), you can add more when needed.

  endpoints: () => ({}),
});
