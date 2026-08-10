import { baseApi } from "./baseApi";

export const subcategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubcategories: builder.query<any, { per_page?: number; page?: number; search?: string; all?: number }>({
      query: ({ per_page = 50, page = 1, search = "" }) => {
        let url = `/api/v1/subcategories?per_page=${per_page}&page=${page}&search=${search}`;
        return url;
      },
    }),
  }),
});

export const { useGetSubcategoriesQuery } = subcategoriesApi;
