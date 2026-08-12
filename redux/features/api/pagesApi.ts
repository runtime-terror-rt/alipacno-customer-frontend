import { baseApi } from "./baseApi";

export const pagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPages: builder.query<any, void>({
      query: () => "/api/v1/pages",
      providesTags: ['Pages'],
    }),
  }),
});

export const { useGetPagesQuery } = pagesApi;
