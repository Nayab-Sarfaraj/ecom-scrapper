import { createSlice } from "@reduxjs/toolkit";

const stored =
  localStorage.getItem("wishlist") !== null
    ? JSON.parse(localStorage.getItem("wishlist"))
    : [];

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: stored,
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.wishlist.find((item) => item._id === product._id);
      if (exists) {
        state.wishlist = state.wishlist.filter((item) => item._id !== product._id);
      } else {
        state.wishlist.push(product);
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(
        (item) => item._id !== action.payload._id
      );
    },
  },
});

export const wishlistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("wishlist/")) {
    const wishlist = store.getState().wishlist.wishlist;
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
  return result;
};

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
