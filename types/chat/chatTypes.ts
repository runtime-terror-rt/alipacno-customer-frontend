export interface ChatUserParticipant {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  user_image?: string | null;
  user_image_url?: string | null;
  user_type?: string | null;
  role_id?: number | null;
  status?: string | null;
  is_online?: boolean;
  branch_id?: number | null;
  pivot?: {
    conversation_id: number;
    user_id: number;
    last_read_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

export interface ChatContactSummaryCounts {
  all: number;
  super_admin: number;
  branch_admin: number;
  staff: number;
  driver: number;
  customer: number;
}

export interface GetChatContactsQueryParams {
  branch_id?: number | string;
  role_id?: number | string;
  user_type?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ChatContactsResponse {
  summary_counts: ChatContactSummaryCounts;
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: ChatUserParticipant[];
}

export interface ChatLastMessage {
  id: number;
  sender_id: number;
  sender_name?: string;
  message: string | null;
  has_attachment?: boolean;
  attachment_url?: string | null;
  attachment_type?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ConversationListItem {
  id: number;
  type: string;
  branch_id?: number | null;
  order_id?: number | null;
  last_message_at?: string | null;
  unread_count: number;
  other_participant?: ChatUserParticipant | null;
  last_message?: ChatLastMessage | null;
  participants: ChatUserParticipant[];
}

export interface ConversationsListResponse {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: ConversationListItem[];
}

export interface ChatMessageItem {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string | null;
  attachment?: string | null;
  attachment_type?: string | null;
  attachment_url?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  sender?: ChatUserParticipant | null;
}

export interface ConversationDetailResponse {
  conversation: {
    id: number;
    type: string;
    branch_id?: number | null;
    order_id?: number | null;
    created_by?: number | null;
    last_message_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    participants: ChatUserParticipant[];
  };
  other_participant: ChatUserParticipant;
  messages: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: ChatMessageItem[];
  };
}

export interface CreateConversationRequest {
  receiver_id: number;
  order_id?: number | null;
}

export interface CreateConversationResponse {
  success: boolean;
  message: string;
  conversation: ConversationListItem;
}

export interface SendMessagePayload {
  conversationId: number | string;
  receiver_id?: number | string;
  order_id?: number | string | null;
  message?: string;
  attachment?: File | null;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: ChatMessageItem;
}
