import { baseApi } from "./baseApi";

export const subcategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubcategories: builder.query<any, { per_page?: number; page?: number; search?: string; all?: number; category_id?: number }>({
      query: ({ per_page = 50, page = 1, search = "", all, category_id }) => {
        let url = `/api/v1/subcategories?per_page=${per_page}&page=${page}&search=${search}`;
        if (all !== undefined) url += `&all=${all}`;
        if (category_id !== undefined) url += `&category_id=${category_id}`;
        return url;
      },
    }),
  }),
});

export const { useGetSubcategoriesQuery } = subcategoriesApi;
