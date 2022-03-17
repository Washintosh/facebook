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
    createPostStart: (state) => {
      state.pending = true;
    },
    createPostSuccess: (state, action) => {
      state.posts = [action.payload, ...state.posts];
      state.pending = false;
    },
    createPostFailure: (state) => {
      state.pending = false;
    },
    deletePostStart: (state) => {
      state.pending = true;
    },
    deletePostSuccess: (state, action) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload);
      state.pending = false;
    },
    deletePostFailure: (state) => {
      state.pending = false;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  deletePostStart,
  deletePostSuccess,
  deletePostFailure,
} = postsSlice.actions;
export default postsSlice.reducer;
