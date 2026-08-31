import { baseApi } from "./baseApi";
import type {
  ChatContactsResponse,
  GetChatContactsQueryParams,
  ConversationsListResponse,
  ConversationDetailResponse,
  CreateConversationRequest,
  CreateConversationResponse,
  SendMessagePayload,
  SendMessageResponse,
} from "@/types/chat/chatTypes";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/chat/contacts
    getChatContacts: builder.query<ChatContactsResponse, GetChatContactsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.branch_id !== undefined && params?.branch_id !== "")
          queryParams.append("branch_id", params.branch_id.toString());
        if (params?.role_id !== undefined && params?.role_id !== "")
          queryParams.append("role_id", params.role_id.toString());
        if (params?.user_type) queryParams.append("user_type", params.user_type);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
        const qs = queryParams.toString();
        return { url: `/api/v1/chat/contacts${qs ? `?${qs}` : ""}`, method: "GET" };
      },
      providesTags: ["Chat"],
    }),

    // GET /api/v1/conversations
    getConversations: builder.query<ConversationsListResponse, { page?: number } | void>({
      query: (params) => ({
        url: `/api/v1/conversations?page=${params?.page || 1}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    // GET /api/v1/conversations/:id
    getConversationDetail: builder.query<
      ConversationDetailResponse,
      { conversationId: number | string; page?: number }
    >({
      query: ({ conversationId, page = 1 }) => ({
        url: `/api/v1/conversations/${conversationId}?page=${page}`,
        method: "GET",
      }),
      providesTags: (result, error, { conversationId }) => [
        { type: "Chat", id: conversationId },
      ],
    }),

    // POST /api/v1/conversations
    createConversation: builder.mutation<CreateConversationResponse, CreateConversationRequest>({
      query: (body) => ({ url: "/api/v1/conversations", method: "POST", body }),
      invalidatesTags: ["Chat"],
    }),

    // POST /api/v1/conversations/:id/messages
    sendMessage: builder.mutation<SendMessageResponse, SendMessagePayload>({
      query: ({ conversationId, receiver_id, order_id, message, attachment }) => {
        const formData = new FormData();
        if (receiver_id != null) formData.append("receiver_id", receiver_id.toString());
        if (order_id != null) formData.append("order_id", order_id.toString());
        if (message) formData.append("message", message);
        if (attachment) formData.append("attachment", attachment);
        return {
          url: `/api/v1/conversations/${conversationId}/messages`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { conversationId }) => [
        "Chat",
        { type: "Chat", id: conversationId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChatContactsQuery,
  useGetConversationsQuery,
  useGetConversationDetailQuery,
  useCreateConversationMutation,
  useSendMessageMutation,
} = chatApi;
