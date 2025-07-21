import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { postAPI } from '../../services/api';

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  published: boolean;
  views: number;
  likes: Array<{
    user: string;
    createdAt: string;
  }>;
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    content: string;
    createdAt: string;
  }>;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  myPosts: Post[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    search: string;
    tag: string;
    published: boolean;
  };
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  myPosts: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    search: '',
    tag: '',
    published: true,
  },
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
    published?: boolean;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await postAPI.getPosts(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const fetchPost = createAsyncThunk(
  'posts/fetchPost',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await postAPI.getPost(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: {
    title: string;
    content: string;
    excerpt?: string;
    imageUrl?: string;
    tags?: string;
    published?: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await postAPI.createPost(postData);
      return response.data;
    } catch (error: any) {
      // Capture full error payload including validation details
      const responseData = error.response?.data;
      return rejectWithValue(
        responseData || error.response?.data?.message || 'Failed to create post'
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }: {
    id: string;
    postData: {
      title?: string;
      content?: string;
      excerpt?: string;
      imageUrl?: string;
      tags?: string;
      published?: boolean;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await postAPI.updatePost(id, postData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await postAPI.deletePost(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await postAPI.toggleLike(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ id, content }: { id: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await postAPI.addComment(id, content);
      return { postId: id, comment: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }: { postId: string; commentId: string }, { rejectWithValue }) => {
    try {
      await postAPI.deleteComment(postId, commentId);
      return { postId, commentId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

export const fetchMyPosts = createAsyncThunk(
  'posts/fetchMyPosts',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await postAPI.getMyPosts(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my posts');
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<PostsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    updatePostRealtime: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      if (state.currentPost?._id === action.payload._id) {
        state.currentPost = action.payload;
      }
    },
    addPostRealtime: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    removePostRealtime: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
      state.myPosts = state.myPosts.filter(post => post._id !== action.payload);
    },
    updateLikeRealtime: (state, action: PayloadAction<{
      postId: string;
      likeCount: number;
      isLiked: boolean;
    }>) => {
      const { postId, likeCount } = action.payload;
      
      // Update in posts array
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].likeCount = likeCount;
      }
      
      // Update current post
      if (state.currentPost?._id === postId) {
        state.currentPost.likeCount = likeCount;
      }
      
      // Update in my posts
      const myPostIndex = state.myPosts.findIndex(post => post._id === postId);
      if (myPostIndex !== -1) {
        state.myPosts[myPostIndex].likeCount = likeCount;
      }
    },
    addCommentRealtime: (state, action: PayloadAction<{
      postId: string;
      comment: Post['comments'][0];
    }>) => {
      const { postId, comment } = action.payload;
      
      // Update in posts array
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].comments.push(comment);
        state.posts[postIndex].commentCount += 1;
      }
      
      // Update current post
      if (state.currentPost?._id === postId) {
        state.currentPost.comments.push(comment);
        state.currentPost.commentCount += 1;
      }
    },
    removeCommentRealtime: (state, action: PayloadAction<{
      postId: string;
      commentId: string;
    }>) => {
      const { postId, commentId } = action.payload;
      
      // Update in posts array
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].comments = state.posts[postIndex].comments.filter(c => c._id !== commentId);
        state.posts[postIndex].commentCount -= 1;
      }
      
      // Update current post
      if (state.currentPost?._id === postId) {
        state.currentPost.comments = state.currentPost.comments.filter(c => c._id !== commentId);
        state.currentPost.commentCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single post
      .addCase(fetchPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload.data;
        state.error = null;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload.data);
        state.myPosts.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedPost = action.payload.data;
        
        // Update in posts array
        const postIndex = state.posts.findIndex(post => post._id === updatedPost._id);
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }
        
        // Update in my posts
        const myPostIndex = state.myPosts.findIndex(post => post._id === updatedPost._id);
        if (myPostIndex !== -1) {
          state.myPosts[myPostIndex] = updatedPost;
        }
        
        // Update current post
        if (state.currentPost?._id === updatedPost._id) {
          state.currentPost = updatedPost;
        }
        
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload;
        state.posts = state.posts.filter(post => post._id !== deletedId);
        state.myPosts = state.myPosts.filter(post => post._id !== deletedId);
        if (state.currentPost?._id === deletedId) {
          state.currentPost = null;
        }
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Toggle like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { id, likeCount, isLiked } = action.payload;
        
        // Update in posts array
        const postIndex = state.posts.findIndex(post => post._id === id);
        if (postIndex !== -1) {
          state.posts[postIndex].likeCount = likeCount;
        }
        
        // Update current post
        if (state.currentPost?._id === id) {
          state.currentPost.likeCount = likeCount;
        }
        
        // Update in my posts
        const myPostIndex = state.myPosts.findIndex(post => post._id === id);
        if (myPostIndex !== -1) {
          state.myPosts[myPostIndex].likeCount = likeCount;
        }
      })
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        
        // Update in posts array
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments.push(comment);
          state.posts[postIndex].commentCount += 1;
        }
        
        // Update current post
        if (state.currentPost?._id === postId) {
          state.currentPost.comments.push(comment);
          state.currentPost.commentCount += 1;
        }
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        
        // Update in posts array
        const postIndex = state.posts.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments = state.posts[postIndex].comments.filter(c => c._id !== commentId);
          state.posts[postIndex].commentCount -= 1;
        }
        
        // Update current post
        if (state.currentPost?._id === postId) {
          state.currentPost.comments = state.currentPost.comments.filter(c => c._id !== commentId);
          state.currentPost.commentCount -= 1;
        }
      })
      // Fetch my posts
      .addCase(fetchMyPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myPosts = action.payload.data;
        state.error = null;
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearCurrentPost,
  updatePostRealtime,
  addPostRealtime,
  removePostRealtime,
  updateLikeRealtime,
  addCommentRealtime,
  removeCommentRealtime,
} = postSlice.actions;

export default postSlice.reducer;