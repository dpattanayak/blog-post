import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTheme: "",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.selectedTheme = action.payload;
    },
    toggleTheme: (state, action) => {
      state.selectedTheme = action.payload ? "dark" : "light";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
