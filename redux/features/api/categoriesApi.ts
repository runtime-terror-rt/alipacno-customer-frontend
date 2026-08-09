import { baseApi } from "./baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<any, { per_page?: number; page?: number; search?: string; all?: number }>({
      query: ({ per_page = 15, page = 1, search = "", all }) => {
        let url = `/api/v1/categories?per_page=${per_page}&page=${page}&search=${search}`;
        if (all) {
          url += `&all=${all}`;
        }
        return url;
      },
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
