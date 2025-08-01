import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchRemovePost = createAsyncThunk("posts/fetchRemovePost", async (id) => 
  axios.delete(`/posts/${id}`)
);

export const fetchPostsWithTagName = createAsyncThunk(
  "posts/fetchPostsWithTagName",
  async (tagName) => {
    const { data } = await axios.get(`/tags/${tagName}`);
    return data;
  }
);

const initialState = {
  tagPosts: {
    items: [],
    status: "loading",
  },
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },

    [fetchPostsWithTagName.pending]: (state) => {
      state.tagPosts.items = [];
      state.tagPosts.status = "loading";
    },
    [fetchPostsWithTagName.fulfilled]: (state, action) => {
      state.tagPosts.items = action.payload;
      state.tagPosts.status = "loaded";
    },
    [fetchPostsWithTagName.rejected]: (state) => {
      state.tagPosts.items = [];
      state.tagPosts.status = "error";
    },

    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
    [fetchRemovePost.rejected]: (state) => {
      state.posts.status = "error";
    },
  },
});

export const postsReducer = postsSlice.reducer;
