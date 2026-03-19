import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

console.log('API_URL:', API_URL);

const api = axios.create({
    baseURL: `${API_URL}/posts`,
    headers: { 'Content-Type': 'application/json' }
})

export const getAllPosts = () => api.get('/')
export const getPostById = (id) => api.get(`/${id}`)
export const searchPosts = (q) => api.get(`/search?q=${encodeURIComponent(q)}`)
export const createPost = (data) => api.post('/', data)
export const updatePost = (id, data) => api.put(`/${id}`, data)
export const deletePost = (id) => api.delete(`/${id}`)

export default api