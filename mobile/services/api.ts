// Backend URL — change this to match your environment:
//   iOS simulator    → http://localhost:3000
//   Android emulator → http://10.0.2.2:3000
//   Physical device  → http://<your-machine-ip>:3000
const API_BASE_URL = 'http://192.168.0.58:3000'

let authToken: string | null = null
export const setAuthToken = (token: string | null) => { authToken = token }

// ─── Types ───────────────────────────────────────────────────────────────────

export type Post = {
  id: string; title: string; content: string; author: string
  createdAt: string; updatedAt: string
}
export type PostInput = { title: string; content: string; author: string }

export type Teacher = {
  id: string; name: string; email: string; createdAt: string; updatedAt: string
}
export type TeacherInput = { name: string; email: string; password?: string }

export type Student = {
  id: string; name: string; email: string; createdAt: string; updatedAt: string
}
export type StudentInput = { name: string; email: string; password?: string }

export type AuthResponse = {
  token: string
  user: { id: string; name: string; email: string; role: 'teacher' | 'student' }
}

export type PaginatedTeachers = { total: number; page: number; limit: number; teachers: Teacher[] }
export type PaginatedStudents = { total: number; page: number; limit: number; students: Student[] }

// ─── HTTP client ─────────────────────────────────────────────────────────────

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const method = options?.method ?? 'GET'
  console.log(`[API] ${method} ${url}`)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  try {
    const res = await fetch(url, {
      headers,
      signal: controller.signal,
      ...options,
    })
    console.log(`[API] ${method} ${url} → ${res.status}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    return text ? (JSON.parse(text) as T) : ({} as T)
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error(`[API] ${method} ${url} → TIMEOUT (8s)`)
      throw new Error('Tempo limite atingido. Verifique a conexão.')
    }
    console.error(`[API] ${method} ${url} → ERROR: ${err.message}`)
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const login = (email: string, password: string, role: 'teacher' | 'student') =>
  req<AuthResponse>(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  })

// ─── Posts ───────────────────────────────────────────────────────────────────

const POSTS = `${API_BASE_URL}/posts`
export const getAllPosts = () => req<Post[]>(POSTS)
export const getPostById = (id: string) => req<Post>(`${POSTS}/${id}`)
export const searchPosts = (q: string) =>
  req<{ results: Post[] }>(`${POSTS}/search?q=${encodeURIComponent(q)}`)
export const createPost = (data: PostInput) =>
  req<Post>(POSTS, { method: 'POST', body: JSON.stringify(data) })
export const updatePost = (id: string, data: PostInput) =>
  req<Post>(`${POSTS}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deletePost = (id: string) =>
  req<void>(`${POSTS}/${id}`, { method: 'DELETE' })

// ─── Teachers ────────────────────────────────────────────────────────────────

const TEACHERS = `${API_BASE_URL}/teachers`
export const getAllTeachers = (page = 1) =>
  req<PaginatedTeachers>(`${TEACHERS}?page=${page}&limit=10`)
export const getTeacherById = (id: string) => req<Teacher>(`${TEACHERS}/${id}`)
export const createTeacher = (data: TeacherInput) =>
  req<Teacher>(TEACHERS, { method: 'POST', body: JSON.stringify(data) })
export const updateTeacher = (id: string, data: TeacherInput) =>
  req<Teacher>(`${TEACHERS}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteTeacher = (id: string) =>
  req<void>(`${TEACHERS}/${id}`, { method: 'DELETE' })

// ─── Students ────────────────────────────────────────────────────────────────

const STUDENTS = `${API_BASE_URL}/students`
export const getAllStudents = (page = 1) =>
  req<PaginatedStudents>(`${STUDENTS}?page=${page}&limit=10`)
export const getStudentById = (id: string) => req<Student>(`${STUDENTS}/${id}`)
export const createStudent = (data: StudentInput) =>
  req<Student>(STUDENTS, { method: 'POST', body: JSON.stringify(data) })
export const updateStudent = (id: string, data: StudentInput) =>
  req<Student>(`${STUDENTS}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteStudent = (id: string) =>
  req<void>(`${STUDENTS}/${id}`, { method: 'DELETE' })
