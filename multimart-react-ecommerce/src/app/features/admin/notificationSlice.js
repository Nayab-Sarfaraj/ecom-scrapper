import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "./fetchOrders";
import axios from "axios";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(fetchNotifications.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
        state.data = action.payload;
      });
  },
});
export const fetchNotifications = createAsyncThunk(
  "fetchNotifications",
  async () => {
    try {
      const res = await axios.get("/notifications");
      return res.data;
    } catch (error) {
      console.log(`error while fetching the notifications`);
      return error.response.data;
    }
  }
);

export default notificationsSlice.reducer;
