import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<any, void>({
      query: () => "/api/v1/carts",
      providesTags: ["Cart"],
    }),
    createCart: builder.mutation<any, void>({
      query: () => ({
        url: "/api/v1/carts",
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),
    addCartItem: builder.mutation<any, { 
      cart_id: number; 
      menu_item_id: number; 
      quantity: number; 
      size_id?: number;
      cooking_preference_id?: number;
      spice_level_id?: number;
      special_instructions?: string;
      toppings?: number[];
    }>({
      query: (body) => ({
        url: "/api/v1/cart-items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<any, { id: number; quantity: number }>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/cart-items/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<any, number>({
      query: (id) => ({
        url: `/api/v1/cart-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useCreateCartMutation,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
