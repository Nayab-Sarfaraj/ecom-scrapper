import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "./fetchOrders";
import axios from "axios";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelectedNotification.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(fetchSelectedNotification.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchSelectedNotification.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
        state.data = action.payload;
      });
  },
});
export const fetchSelectedNotification = createAsyncThunk(
  "fetchSelectedNotification",
  async (id) => {
    try {
      const res = await axios.get(`/notification/${id}`);
      return res.data;
    } catch (error) {
      console.log(`error while fetching the notifications`);
      return error.response.data;
    }
  }
);

export default notificationSlice.reducer;
