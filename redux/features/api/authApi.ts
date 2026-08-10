import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (otpInfo) => ({
        url: "/api/v1/auth/verify-otp",
        method: "POST",
        body: otpInfo,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body: emailData,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
    }),
    getMe: builder.query<any, void>({
      query: () => "/api/v1/auth/me",
      providesTags: ['Profile'],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => {
        if (data instanceof FormData) {
          data.append("_method", "PUT");
          return {
            url: `/api/v1/users/${id}`,
            method: "POST",
            body: data,
          };
        }
        return {
          url: `/api/v1/users/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { 
  useRegisterMutation, 
  useVerifyOtpMutation, 
  useForgotPasswordMutation, 
  useResetPasswordMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateUserMutation
} = authApi;
