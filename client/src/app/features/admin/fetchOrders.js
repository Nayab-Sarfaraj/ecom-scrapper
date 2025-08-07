import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../../utils/url";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "error",
  SUCCESS: "success",
});
const venderOrderSlice = createSlice({
  name: "products",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorOrders.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchVendorOrders.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.SUCCESS;
      })
      .addCase(fetchVendorOrders.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const fetchVendorOrders = createAsyncThunk(
  "fetchVendorOrders",
  async (id) => {
    try {
      const res = await axios.get(`${url}/order/vendor/all`, { withCredentials: true });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export default venderOrderSlice.reducer;
