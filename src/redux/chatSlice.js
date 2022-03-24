import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    username: "",
    profilePicture: "",
  },
  reducers: {
    setChat: (state, action) => {
      state.username = action.payload.username;
      state.profilePicture = action.payload.profilePicture;
    },
  },
});

export const { setChat } = chatSlice.actions;
export default chatSlice.reducer;
