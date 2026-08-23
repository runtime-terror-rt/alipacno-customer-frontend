import { baseApi } from "./baseApi";

export interface BranchRestaurant {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  cover_image?: string;
  phone?: string;
  email?: string;
  address?: string;
  postcode?: string;
  latitude?: string | null;
  longitude?: string | null;
  delivery_radius?: string | null;
  opening_time?: string | null;
  closing_time?: string | null;
  is_delivery?: number;
  is_collection?: number;
  is_dine_in?: number;
  is_table_order?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BranchItem {
  id: number;
  restaurant_id: number;
  name: string;
  branch_code?: string | null;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postcode?: string | null;
  postal_code?: string;
  latitude?: string | null;
  longitude?: string | null;
  tax_rate?: string;
  minimum_order?: string;
  delivery_radius?: string | null;
  currency?: string;
  timezone?: string;
  opening_time?: string;
  closing_time?: string;
  is_active?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  restaurant?: BranchRestaurant;
}

export interface BranchesResponse {
  current_page?: number;
  data: BranchItem[];
  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  next_page_url?: string | null;
  path?: string;
  per_page?: number;
  prev_page_url?: string | null;
  to?: number;
  total?: number;
}

export const branchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<BranchesResponse, void>({
      query: () => "/api/v1/branches",
      providesTags: ["Branches"],
    }),
    getBranchById: builder.query<BranchItem, number | string>({
      query: (id) => `/api/v1/branches/${id}`,
      providesTags: (result, error, id) => [{ type: "Branches", id }],
    }),
  }),
});

export const { useGetBranchesQuery, useGetBranchByIdQuery } = branchesApi;
