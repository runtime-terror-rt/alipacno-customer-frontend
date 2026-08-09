import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../features/api/baseApi";
import authReducer from "../features/slice/authSlice";
import cartReducer from "../features/slice/cartSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
