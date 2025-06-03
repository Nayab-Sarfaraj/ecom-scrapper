import { createSlice } from "@reduxjs/toolkit";

const storedAddress =
  localStorage.getItem("address") !== null
    ? JSON.parse(localStorage.getItem("address"))
    : [];

const initialState = {
  address: storedAddress,
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    saveAddress: (state, action) => {
      localStorage.setItem("address", JSON.stringify(action.payload));
      state = action.payload;
    },
  },
});

export const { saveAddress } = addressSlice.actions;

export default addressSlice.reducer;
