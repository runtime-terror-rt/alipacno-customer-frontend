import { baseApi } from "./baseApi";

export interface DeliveryFeeTier {
  id: number;
  name: string;
  min_distance_miles: number;
  max_distance_miles: number | null;
  fee: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryFeeTierMatchData {
  distance_miles: number;
  fee: number;
  tier?: DeliveryFeeTier | null;
}

export interface DeliveryFeeTierMatchResponse {
  status: number;
  message: string;
  data: DeliveryFeeTierMatchData;
}

export const deliveryFeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    matchDeliveryFeeTier: builder.query<DeliveryFeeTierMatchResponse, { distance: number | string }>({
      query: ({ distance }) => `/api/v1/delivery-fee-tiers/match?distance=${distance}`,
    }),
  }),
});

export const { useMatchDeliveryFeeTierQuery, useLazyMatchDeliveryFeeTierQuery } = deliveryFeeApi;
