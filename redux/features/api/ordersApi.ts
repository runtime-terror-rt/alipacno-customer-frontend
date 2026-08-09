import { baseApi } from "./baseApi";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<any, any>({
      query: (body) => ({
        url: "/api/v1/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),
    getActiveGateways: builder.query<any, void>({
      query: () => "/api/v1/payment-gateways/active",
    }),
    processPayment: builder.mutation<any, any>({
      query: (body) => ({
        url: "/api/v1/payments",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetActiveGatewaysQuery,
  useProcessPaymentMutation,
} = ordersApi;
