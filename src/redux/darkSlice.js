import { createSlice } from "@reduxjs/toolkit";

export const darkSlice = createSlice({
  name: "dark",
  initialState: {
    value: false,
  },
  reducers: {
    setDark: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setDark } = darkSlice.actions;
export default darkSlice.reducer;
