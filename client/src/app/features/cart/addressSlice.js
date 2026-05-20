import { createSlice } from "@reduxjs/toolkit";

const storedAddress =
  localStorage.getItem("address") !== null
    ? JSON.parse(localStorage.getItem("address"))
    : {};

const initialState = {
  address: storedAddress,
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    saveAddress: (state, action) => {
      // Must mutate state.address — reassigning `state` directly has no effect in Immer
      state.address = action.payload;
      localStorage.setItem("address", JSON.stringify(action.payload));
    },
  },
});

export const { saveAddress } = addressSlice.actions;

export default addressSlice.reducer;
