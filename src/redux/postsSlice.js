import { createSlice } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    pending: false,
  },
  reducers: {
    fetchStart: (state) => {
      state.pending = true;
    },
    fetchSuccess: (state, action) => {
      state.posts = action.payload;
      state.pending = false;
    },
    fetchFailure: (state) => {
      state.pending = false;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure } = postsSlice.actions;
export default postsSlice.reducer;
