import { baseApi } from "./baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<any, { per_page?: number; page?: number; search?: string }>({
      query: ({ per_page = 15, page = 1, search = "" }) =>
        `/api/v1/categories?per_page=${per_page}&page=${page}&search=${search}`,
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
