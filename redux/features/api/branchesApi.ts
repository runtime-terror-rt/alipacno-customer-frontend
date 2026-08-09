import { baseApi } from "./baseApi";

export const branchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<any, void>({
      query: () => "/api/v1/branches",
    }),
  }),
});

export const { useGetBranchesQuery } = branchesApi;
