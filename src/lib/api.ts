import axios from "axios"

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (error?: any) => void
  config?: any
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  failedQueue = []
}

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match('(^|;)\\s*xclinic_token\\s*=\\s*([^;]+)')
  return match ? decodeURIComponent(match[2]) : null
}

export function setToken(token: string, days = 7) {
  if (typeof document === "undefined") return
  const d = new Date()
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  const secure = location.protocol === "https:" ? "; Secure" : ""
  // Ideal: servidor deve setar cookie HttpOnly; this is a fallback for clients.
  document.cookie = `xclinic_token=${encodeURIComponent(token)};path=/;expires=${d.toUTCString()};SameSite=Lax${secure}`
}

export function clearToken() {
  if (typeof document === "undefined") return
  document.cookie = "xclinic_token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax"
}

const baseURL = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL || "" : ""
const refreshPath = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_REFRESH_URL || "/users/refresh/" : "/users/refresh/"

const api = axios.create({
  baseURL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getTokenFromCookie()
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject, config: originalRequest })
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Use axios without interceptors to request refresh (server should use HttpOnly cookie)
        const resp = await axios.post(baseURL + refreshPath, {}, { withCredentials: true })
        const newToken = resp.data?.access_token || resp.data?.token
        if (newToken) setToken(newToken)
        processQueue(null, newToken)
        isRefreshing = false
        originalRequest.headers["Authorization"] = "Bearer " + newToken
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        isRefreshing = false
        clearToken()
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)

export default api
