import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
  name: "alert",
  initialState: {
    message: "",
    show: false,
    error: false,
  },
  reducers: {
    showAlert: (state, action) => {
      state.message = action.payload.message;
      state.show = true;
      state.error = action.payload.error;
    },
    hideAlert: (state) => {
      state.show = false;
    },
  },
});

export default alertSlice.reducer;

export const { showAlert, hideAlert } = alertSlice.actions;
