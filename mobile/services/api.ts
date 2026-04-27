const API_BASE_URL = 'http://192.168.0.58:64891'
const BASE = `${API_BASE_URL}/posts`

export type Post = {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
}

export type PostInput = {
  title: string
  content: string
  author: string
}

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const method = options?.method ?? 'GET'
  console.log(`[API] ${method} ${url}`)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
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

export const getAllPosts = () => req<Post[]>(BASE)
export const getPostById = (id: string) => req<Post>(`${BASE}/${id}`)
export const searchPosts = (q: string) =>
  req<{ results: Post[] }>(`${BASE}/search?q=${encodeURIComponent(q)}`)
export const createPost = (data: PostInput) =>
  req<Post>(BASE, { method: 'POST', body: JSON.stringify(data) })
export const updatePost = (id: string, data: PostInput) =>
  req<Post>(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deletePost = (id: string) =>
  req<void>(`${BASE}/${id}`, { method: 'DELETE' })
