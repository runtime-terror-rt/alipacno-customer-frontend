import { baseApi } from "./baseApi";

export const menuItemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMenuItems: builder.query<any, { category_id?: number; is_popular?: number; search?: string; per_page?: number; page?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.category_id) queryParams.append("category_id", params.category_id.toString());
        if (params.is_popular !== undefined) queryParams.append("is_popular", params.is_popular.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.per_page) queryParams.append("per_page", params.per_page.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        
        return `/api/v1/menu-items?${queryParams.toString()}`;
      },
    }),
  }),
});

export const { useGetMenuItemsQuery } = menuItemsApi;
