import axios from 'axios'

const api = axios.create({
    baseURL: '/posts',
    headers: { 'Content-Type': 'application/json' }
})

export const getAllPosts = () => api.get('/')
export const getPostById = (id) => api.get(`/${id}`)
export const searchPosts = (q) => api.get(`/search?q=${encodeURIComponent(q)}`)
export const createPost = (data) => api.post('/', data)
export const updatePost = (id, data) => api.put(`/${id}`, data)
export const deletePost = (id) => api.delete(`/${id}`)

export default api
