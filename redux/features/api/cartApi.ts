import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<any, void>({
      query: () => "/api/v1/carts",
      providesTags: ["Cart"],
    }),
    createCart: builder.mutation<any, {
      order_type: string;
      delivery_postcode?: string;
      branch_id: number;
      latitude?: number | null;
      longitude?: number | null;
    }>({
      query: (body) => ({
        url: "/api/v1/carts",
        method: "POST",
        body,
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

export function extractCartData(res: any): { cartObj: any; items: any[] } {
  if (!res) return { cartObj: {}, items: [] };

  let rawCart = res;
  if (res.data !== undefined) {
    if (Array.isArray(res.data)) {
      rawCart = res.data[0] || {};
    } else {
      rawCart = res.data;
    }
  } else if (Array.isArray(res)) {
    rawCart = res[0] || {};
  }

  if (rawCart && rawCart.cart) {
    rawCart = rawCart.cart;
  }

  const items = Array.isArray(rawCart?.items)
    ? rawCart.items
    : Array.isArray(rawCart?.cart_items)
    ? rawCart.cart_items
    : Array.isArray(rawCart?.data?.items)
    ? rawCart.data.items
    : Array.isArray(rawCart?.data)
    ? rawCart.data
    : [];

  return {
    cartObj: rawCart || {},
    items,
  };
}

export const {
  useGetCartQuery,
  useCreateCartMutation,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
