import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true,
});

// Interceptor para adicionar o token JWT em cada requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const postService = {
    getAll: (tipoRelatoId?: number) => api.get('/posts', { params: { tipoRelatoId } }),
    getUserPosts: () => api.get('/posts/my-posts'),
    create: (data: any) => api.post('/posts', data),
    vote: (postId: number) => api.post(`/posts/${postId}/vote`),
    getCategories: () => api.get('/posts/categories'),
};

export const commentService = {
    getByPost: (postId: number) => api.get(`/posts/${postId}/comments`),
    create: (postId: number, texto: string) => api.post(`/posts/${postId}/comments`, { texto }),
    delete: (postId: number, commentId: string) => api.delete(`/posts/${postId}/comments/${commentId}`),
};

export const authService = {
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

export const userService = {
    updateProfile: (data: { avatarUrl?: string; nome?: string }) => api.patch('/users/profile', data),
};
