import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store/store";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
      console.log("Preparing headers for API call, endpoint:", endpoint);

      // Skip auth header for login and register endpoints
      if (endpoint === "login" || endpoint === "register") {
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

      // Add ngrok skip warning header for development
      // headers.set("ngrok-skip-browser-warning", "any");
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Profile",
  ], // Kept minimal as requested ("unnessecery jeno kicu na thake"), you can add more when needed.

  endpoints: () => ({}),
});
