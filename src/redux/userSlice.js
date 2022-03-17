import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")),
    pending: false,
  },
  reducers: {
    loginStart: (state) => {
      state.pending = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.pending = false;
    },
    loginFailure: (state) => {
      state.pending = false;
    },
    logout: (state) => {
      state.user = null;
    },
    updateStart: (state) => {
      state.pending = true;
    },
    updateSuccess: (state, action) => {
      state.user = action.payload;
      state.pending = false;
    },
    updateFailure: (state) => {
      state.pending = false;
    },
    registerStart: (state) => {
      state.pending = true;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.pending = false;
    },
    registerFailure: (state) => {
      state.pending = false;
    },
    follow: (state, action) => {
      state.user.followings = [...state.user.followings, action.payload];
    },
    unfollow: (state, action) => {
      state.user.followings = state.user.followings.filter(
        (el) => el !== action.payload
      );
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  follow,
  unfollow,
} = userSlice.actions;
export default userSlice.reducer;
