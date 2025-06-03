import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "error",
  SUCCESS: "success",
});
const userSlice = createSlice({
  name: "user",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
    isLogin: false,
    isVendor: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.status = STATUSES.SUCCESS;
        state.isLogin = true;
        state.isVendor = action.payload.user.isVendor;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.status = STATUSES.SUCCESS;
        state.isLogin = true;
        state.isVendor = action.payload.user.isVendor;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(registerUser.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.status = STATUSES.SUCCESS;
        state.isLogin = false;
        state.isVendor = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
        state.isLogin = false;
        state.isVendor = false;
        state.data = {};
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
        state.data = action.payload.user;
        state.isLogin = true;
        state.isVendor = action.payload.user.isVendor;
      });
  },
});

export const fetchUser = createAsyncThunk("fetchUser", async () => {
  const res = await axios.get(`/me`);
  return res.data;
});
export const loginUser = createAsyncThunk("loginUser", async (formData) => {
  console.log(formData);
  const res = await axios.post("/login", formData);
  console.log(res.data);
  return res.data;
});
export const registerUser = createAsyncThunk(
  "registerUser",
  async (formData) => {
    const res = await axios.post("/register", formData);
    console.log(res.data);
    return res.data;
  }
);

export const logoutUser = createAsyncThunk("logoutUser", async () => {
  const res = await axios.post("/logout");
  return res.data;
});
export const updatePassword = createAsyncThunk(
  "updatePassword",
  async (data) => {
    try {
      const res = await axios.patch("/update-password", data);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }
);

export default userSlice.reducer;
