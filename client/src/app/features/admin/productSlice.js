import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../../utils/url";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "error",
  SUCCESS: "success",
});
const productSlice = createSlice({
  name: "products",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.SUCCESS;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(editProduct.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
        state.data = action.payload;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(getProductById.pending, (state, action) => {
        state.status = STATUSES.LOADING;
        state.data = {};
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
        state.data = action.payload;
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const createProduct = createAsyncThunk("createProduct", async (data) => {
  try {
    const res = await axios.post(`/product/new`, data, { withCredentials: true });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
});

export const editProduct = createAsyncThunk(
  "editProduct",
  async ({ id, data }) => {
    try {
      const res = await axios.put(`${url}/product/${id}`, data, { withCredentials: true });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }
);
export const getProductById = createAsyncThunk("getProductById", async (id) => {
  try {
    const res = await axios.get(`${url}/product/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
});
export const deleteProduct = createAsyncThunk("deleteProduct", async (id) => {
  try {
    const res = await axios.delete(`${url}/product/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.log(error);
  }
});
export default productSlice.reducer;
