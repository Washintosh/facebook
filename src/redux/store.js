import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postsReducer from "./postsSlice";
import sidebarReducer from "./sidebarSlice";

const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
  sidebar: sidebarReducer,
});

export default configureStore({
  reducer: rootReducer,
});
