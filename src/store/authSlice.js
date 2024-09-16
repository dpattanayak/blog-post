import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      let { $id, name, status, email } = action.payload;
      state.status = true;
      state.userData = { $id, name, status, email };
    },
    profile: (state, action) => {
      let { user_id, profilePic, href } = action.payload;
      state.profile = { user_id, profilePic, href };
    },
    logout: () => initialState,
  },
});

export const { login, logout, profile } = authSlice.actions;
export default authSlice.reducer;
