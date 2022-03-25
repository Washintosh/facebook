import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postsReducer from "./postsSlice";
import sidebarReducer from "./sidebarSlice";
import alertReducer from "./alertSlice";
import chatReducer from "./chatSlice";
import darkReducer from "./darkSlice";

const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
  sidebar: sidebarReducer,
  alert: alertReducer,
  chat: chatReducer,
  dark: darkReducer,
});

export default configureStore({
  reducer: rootReducer,
});
