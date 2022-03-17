import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postsReducer from "./postsSlice";
import sidebarReducer from "./sidebarSlice";
import alertReducer from "./alertSlice";

const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
  sidebar: sidebarReducer,
  alert: alertReducer,
});

export default configureStore({
  reducer: rootReducer,
});
