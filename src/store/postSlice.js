import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  bgImage: {},
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    allPosts: (state, action) => {
      state.posts = action.payload;
    },

    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },

    updatePost: (state, action) => {
      const { $id, body } = action.payload;
      state.posts = state.posts.map((post) => {
        return post.$id === $id ? { ...post, ...body } : post;
      });

      // Sort the posts by $updatedAt field in descending order
      state.posts.sort(
        (a, b) => new Date(b.$updatedAt) - new Date(a.$updatedAt)
      );
    },

    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.$id !== action.payload);
    },

    activeBGImage: (state, action) => {
      state.bgImage = action.payload;
    },

    resetState: () => initialState,
  },
});

export const {
  allPosts,
  addPost,
  updatePost,
  removePost,
  activeBGImage,
  resetState,
} = postSlice.actions;
export default postSlice.reducer;
