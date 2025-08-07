import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../utils/url";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "error",
  SUCCESS: "success",
});
const selectedProductSlice = createSlice({
  name: "products",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelectedProduct.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchSelectedProduct.fulfilled, (state, action) => {
        state.data = action.payload.product;
        state.status = STATUSES.SUCCESS;
      })
      .addCase(fetchSelectedProduct.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const fetchSelectedProduct = createAsyncThunk("fetchSelectedProduct", async (id) => {
  const res = await axios.get(`${url}/product/${id}`, { withCredentials: true });
  console.log(res.data);
  return res.data;
});

export default selectedProductSlice.reducer;
