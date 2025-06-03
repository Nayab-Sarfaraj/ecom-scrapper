import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../utils/url";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "error",
  SUCCESS: "success",
});
const productSlice = createSlice({
  name: "products",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.data = action.payload.products;
        state.status = STATUSES.SUCCESS;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const fetchProduct = createAsyncThunk("fetchProduct", async () => {
  const res = await axios.get(`${url}/product/all`);
  console.log(res.data);
  return res.data;
});

export default productSlice.reducer;
