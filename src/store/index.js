import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import postSlice from "./postSlice";
import themeSlice from "./themeSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    post: postSlice,
    theme: themeSlice,
  },
});

export default store;

export { authSlice, postSlice, themeSlice };
