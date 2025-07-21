import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  updateProfile: (profileData: { name?: string; bio?: string; avatar?: string }) =>
    api.put('/auth/profile', profileData),
};

// Posts API
export const postAPI = {
  getPosts: (params: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
    published?: boolean;
  } = {}) =>
    api.get('/posts', { params }),
  
  getPost: (id: string) =>
    api.get(`/posts/${id}`),
  
  createPost: (postData: {
    title: string;
    content: string;
    excerpt?: string;
    imageUrl?: string;
    tags?: string;
    published?: boolean;
  }) =>
    api.post('/posts', postData),
  
  updatePost: (id: string, postData: {
    title?: string;
    content?: string;
    excerpt?: string;
    imageUrl?: string;
    tags?: string;
    published?: boolean;
  }) =>
    api.put(`/posts/${id}`, postData),
  
  deletePost: (id: string) =>
    api.delete(`/posts/${id}`),
  
  toggleLike: (id: string) =>
    api.post(`/posts/${id}/like`),
  
  addComment: (id: string, content: string) =>
    api.post(`/posts/${id}/comments`, { content }),
  
  deleteComment: (postId: string, commentId: string) =>
    api.delete(`/posts/${postId}/comments/${commentId}`),
  
  getMyPosts: (params: { page?: number; limit?: number } = {}) =>
    api.get('/posts/my-posts', { params }),
};

export default api;