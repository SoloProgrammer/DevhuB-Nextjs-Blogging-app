import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  followers: null,
  following: null,
  subscribers: null,
  posts: null,
  savedPosts: null,
};

const profile = createSlice({
  initialState,
  name: "profileSlice",
  reducers: {
    newProfile: (state, { payload }) => {
      state.profile = payload.profile;
    },
    clearProfileData: (state) => {
      state.profile = null;
      state.followers = null;
      state.following = null;
      state.subscribers = null;
      state.posts = null;
      state.savedPosts = null;
    },
    addPosts: (state, { payload }) => {
      state.posts = state.posts
        ? { ...state.posts, [payload.page]: payload.posts }
        : { [payload.page]: payload.posts };
    },
    addSavedPosts: (state, { payload }) => {
      state.savedPosts = state.savedPosts
        ? { ...state.savedPosts, [payload.page]: payload.savedPosts }
        : { [payload.page]: payload.savedPosts };
    },
    addToSavedPostsSavedPostsInProfile: (state, { payload }) => {
      console.log("payload", payload);
      state.profile.savedPosts.push(payload.postId);
    },
    removeFromSavedPostsInProfile: (state, { payload }) => {
      state.profile.savedPosts = state.profile.savedPosts.filter(
        (postId) => postId !== payload.postId
      );
    },
    clearSavedPosts: (state) => {
      state.savedPosts = null;
    },
    updateSavedPosts: (state, { payload }) => {
      state.savedPosts = payload.updatedSavedPosts;
    },
  },
});

export const {
  newProfile,
  addPosts,
  addSavedPosts,
  addToSavedPostsSavedPostsInProfile,
  removeFromSavedPostsInProfile,
  clearProfileData,
  updateSavedPosts,
  clearSavedPosts,
} = profile.actions;
export default profile.reducer;