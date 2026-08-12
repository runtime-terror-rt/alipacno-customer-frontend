import { baseApi } from "./baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<any, void>({
      query: () => "/api/v1/my-wishlist",
      providesTags: ['Wishlist'],
    }),
    toggleWishlist: builder.mutation<any, { menu_item_id: number }>({
      query: (data) => ({
        url: "/api/v1/toggle-wishlist",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const { useGetWishlistQuery, useToggleWishlistMutation } = wishlistApi;
