import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { STATUSES } from "./admin/fetchOrders";

const searchedProductSlice = createSlice({
  name: "searchedProduct",
  initialState: {
    status: STATUSES.IDLE,
    data: [],
  },
  extraReducers: (bundler) => {
    bundler
      .addCase(getSearchedProducts.pending, (state, action) => {
        state.status = STATUSES.LOADING;
        state.data = [];
      })
      .addCase(getSearchedProducts.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(getSearchedProducts.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
        state.data = action.payload;
      });
  },
});

export const getSearchedProducts = createAsyncThunk(
  "getSearchedProducts",
  async ({ searchQuery, page, minPrice = 500, maxPrice = 500000 }) => {
    try {
      console.log(minPrice);
      let url = "";
      if (minPrice) {
        url = `/products/all?page=${page}&searchQuery=${searchQuery}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      } else {
        url = `/products/all?page=${page}&searchQuery=${searchQuery}`;
      }
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }
);

export default searchedProductSlice.reducer;
