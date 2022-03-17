import { createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    sidebar: false,
  },
  reducers: {
    openClose: (state) => {
      state.sidebar = !state.sidebar;
    },
  },
});

export default sidebarSlice.reducer;
export const { openClose } = sidebarSlice.actions;
