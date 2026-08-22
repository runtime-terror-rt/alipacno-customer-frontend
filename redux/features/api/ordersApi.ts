import { baseApi } from "./baseApi";

export interface OrderItemPreference {
  id: number;
  restaurant_id?: number | null;
  menu_item_id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItemSize {
  id: number;
  menu_item_id: number;
  name: string;
  size_description?: string;
  extra_price?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderMenuItem {
  id: number;
  restaurant_id: number;
  branch_id: number;
  category_id: number;
  subcategory_id?: number;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  image_url?: string;
  price: string;
  original_price?: string;
  discount_price?: string;
  rating?: string;
  review_count?: number;
  is_popular?: number;
  is_featured?: number;
  status?: string;
}

export interface OrderLineItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  item_name: string;
  size_id?: number | null;
  size_name?: string | null;
  cooking_preference_id?: number | null;
  cooking_preference?: OrderItemPreference | null;
  spice_level_id?: number | null;
  spice_level?: OrderItemPreference | null;
  quantity: number;
  unit_price: string;
  subtotal: string;
  special_instructions?: string | null;
  options_summary?: string | null;
  created_at?: string;
  updated_at?: string;
  menu_item?: OrderMenuItem;
  size?: OrderItemSize | null;
  toppings?: any[];
}

export interface OrderPayment {
  id: number;
  order_id: number;
  payment_method: string;
  stripe_payment_intent?: string | null;
  transaction_id?: string;
  amount: string;
  currency?: string;
  status: string;
  paid_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AssignedStaff {
  id: number;
  employee_id?: string;
  name: string;
  image?: string;
  email?: string;
  phone?: string;
  branch_id?: number;
  role_id?: number;
  status?: string;
  image_url?: string;
}

export interface AssignedDriver {
  id: number;
  user_id?: number | null;
  branch_id?: number;
  name: string;
  phone?: string;
  vehicle_type?: string;
  license_number?: string;
  status?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
}

export interface OrderBranch {
  id: number;
  restaurant_id: number;
  name: string;
  branch_code?: string | null;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  latitude?: string | null;
  longitude?: string | null;
  tax_rate?: string;
  minimum_order?: string;
  delivery_radius?: string | null;
  currency?: string;
  timezone?: string;
  opening_time?: string;
  closing_time?: string;
  is_active?: number;
  status?: string;
}

export interface OrderUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string | null;
  loyalty_points_balance?: number;
  status?: string;
}

export interface KitchenOrder {
  id: number;
  order_id: number;
  kitchen_station_id?: number;
  chef_id?: number | null;
  status: string;
  started_at?: string | null;
  ready_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  restaurant_id?: number;
  branch_id?: number;
  address_id?: number | null;
  table_id?: number | null;
  reservation_id?: number | null;
  order_type: string;
  order_status: string; // "pending", "preparing", "ready_for_delivery", "out_for_delivery", "delivered", "cancelled"
  payment_status: string;
  payment_method: string;
  order_source?: string;
  assigned_staff_id?: number | null;
  assigned_driver_id?: number | null;
  subtotal: string | number;
  vat: string | number;
  delivery_fee: string | number;
  discount: string | number;
  tip: string | number;
  rider_tip: string | number;
  total: string | number;
  loyalty_points?: number;
  loyalty_points_earned?: number;
  loyalty_points_used?: number;
  estimated_delivery_time?: string | null;
  customer_name?: string;
  customer_phone?: string;
  delivery_address?: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  items?: OrderLineItem[];
  user?: OrderUser | null;
  branch?: OrderBranch | null;
  assigned_staff?: AssignedStaff | null;
  assigned_driver?: AssignedDriver | null;
  delivery?: any | null;
  payment?: OrderPayment | null;
  kitchen_orders?: KitchenOrder[];
}

export interface OrdersListResponse {
  current_page?: number;
  data: Order[];
  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  next_page_url?: string | null;
  path?: string;
  per_page?: number;
  prev_page_url?: string | null;
  to?: number;
  total?: number;
}

export interface CreateOrderPayload {
  branch_id?: number;
  user_id?: number;
  cart_id?: number;
  order_type?: string;
  payment_method?: string;
  customer_name?: string;
  customer_phone?: string;
  delivery_address?: string;
  table_id?: number | null;
  notes?: string;
  tip?: number;
  rider_tip?: number;
  use_loyalty_points?: boolean;
  items?: Array<{
    menu_item_id: number;
    quantity: number;
    size_id?: number | null;
    cooking_preference_id?: number | null;
    spice_level_id?: number | null;
    unit_price?: number;
    special_instructions?: string | null;
  }>;
}

export interface UpdateOrderPayload {
  order_status?: string;
  payment_status?: string;
  assigned_staff_id?: number;
  assigned_driver_id?: number;
  estimated_delivery_time?: string;
  notes?: string;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      OrdersListResponse,
      { page?: number; per_page?: number; search?: string } | void
    >({
      query: (params) => {
        const page = params?.page || 1;
        const per_page = params?.per_page || 15;
        const search = params?.search || "";
        return `/api/v1/orders?per_page=${per_page}&page=${page}&search=${encodeURIComponent(search)}`;
      },
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query<Order, number | string>({
      query: (id) => `/api/v1/orders/${id}`,
      transformResponse: (res: any) => {
        if (res?.data) return res.data;
        return res;
      },
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    createOrder: builder.mutation<any, CreateOrderPayload>({
      query: (body) => ({
        url: "/api/v1/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),
    updateOrder: builder.mutation<Order, { id: number | string; data: UpdateOrderPayload }>({
      query: ({ id, data }) => ({
        url: `/api/v1/orders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Orders", id }, "Orders"],
    }),
    deleteOrder: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/api/v1/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
    getActiveGateways: builder.query<any, void>({
      query: () => "/api/v1/payment-gateways/active",
    }),
    processPayment: builder.mutation<any, any>({
      query: (body) => ({
        url: "/api/v1/payments",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetActiveGatewaysQuery,
  useProcessPaymentMutation,
} = ordersApi;
