import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "error",
  SUCCESS: "success",
});

const myOrderSlice = createSlice({
  name: "myOrder",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.SUCCESS;
      })
      .addCase(fetchMyOrders.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      });
  },
});
export const fetchMyOrders = createAsyncThunk("fetchMyOrders", async () => {
  try {
    const res = await axios.get("/user/orders");
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
});

export default myOrderSlice.reducer;
