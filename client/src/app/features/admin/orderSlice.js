import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../../utils/url";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "error",
  SUCCESS: "success",
});
const orderSlice = createSlice({
  name: "order",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  extraReducers: (builder) => {
    builder
      .addCase(editPaymentStatus.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(editPaymentStatus.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.SUCCESS;
      })
      .addCase(editPaymentStatus.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(editOrderStatus.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(editOrderStatus.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
        state.data = action.payload;
      })
      .addCase(editOrderStatus.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(getOrderById.pending, (state, action) => {
        state.status = STATUSES.IDLE;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
        state.data = action.payload;
      });
  },
});

export const editOrderStatus = createAsyncThunk(
  "editOrderStatus",
  async ({ id, orderStatus }) => {
    try {
      console.log(orderStatus);
      const res = await axios.post(`${url}/order/status/${id}`, { orderStatus }, { withCredentials: true });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }
);

export const editPaymentStatus = createAsyncThunk(
  "editPaymentStatus",
  async ({ id, paymentStatus }) => {
    try {
      const res = await axios.post(
        `${url}/order/status/payment/${id}`,
        { paymentStatus }, { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }
);
export const getOrderById = createAsyncThunk("getOrderById", async (id) => {
  try {
    const res = await axios.get(`${url}/order/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
});
export default orderSlice.reducer;
