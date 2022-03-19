import { createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    sidebar: false,
  },
  reducers: {
    openClose: (state, action) => {
      state.sidebar = action.payload;
    },
  },
});

export default sidebarSlice.reducer;
export const { openClose } = sidebarSlice.actions;
