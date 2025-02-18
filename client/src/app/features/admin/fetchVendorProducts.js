import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "error",
  SUCCESS: "success",
});
const vendorProductSlice = createSlice({
  name: "products",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProduct.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchVendorProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.SUCCESS;
      })
      .addCase(fetchVendorProduct.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const fetchVendorProduct = createAsyncThunk(
  "fetchVendorProduct",
  async (id) => {
    try {
      const res = await axios.get(`/product/vendor/all`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export default vendorProductSlice.reducer;
