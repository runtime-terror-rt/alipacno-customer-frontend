import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  isCartOpen: boolean;
  localCartId: number | null;
}

const initialState: CartState = {
  isCartOpen: false,
  localCartId: null, // Depending on if we need to store cart id locally for guests
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },
    setLocalCartId: (state, action: PayloadAction<number | null>) => {
      state.localCartId = action.payload;
    },
  },
});

export const { toggleCart, setCartOpen, setLocalCartId } = cartSlice.actions;
export default cartSlice.reducer;
