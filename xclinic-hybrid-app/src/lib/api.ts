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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return
  const d = new Date()
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  const secure = location.protocol === "https:" ? "; Secure" : ""
  // Ideal: servidor deve setar cookie HttpOnly; this is a fallback for clients.
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${d.toUTCString()};SameSite=Lax${secure}`
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax`
}

function getTokenFromCookie(): string | null {
  return getCookie("xclinic_token")
}

export function setToken(token: string, days = 7) {
  setCookie("xclinic_token", token, days)
}

export function clearToken() {
  clearCookie("xclinic_token")
  clearRefreshToken()
}

export function getRefreshToken(): string | null {
  return getCookie("xclinic_refresh_token")
}

export function setRefreshToken(token: string, days = 7) {
  setCookie("xclinic_refresh_token", token, days)
}

export function clearRefreshToken() {
  clearCookie("xclinic_refresh_token")
}

const baseURL = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL || "" : ""
// Deve corresponder à rota real do backend (app/routers/user.py): POST /token/refresh,
// autenticado via header "Authorization: Bearer <refresh_token>" (não por cookie/body).
const refreshPath = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_REFRESH_URL || "/token/refresh" : "/token/refresh"

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
        const storedRefreshToken = getRefreshToken()
        if (!storedRefreshToken) {
          throw new Error("No refresh token available")
        }
        // Backend exige o refresh token como Bearer, sem corpo (ver app/routers/user.py)
        const resp = await axios.post(baseURL + refreshPath, null, {
          headers: { Authorization: `Bearer ${storedRefreshToken}` },
        })
        const newToken = resp.data?.access_token || resp.data?.token
        const newRefreshToken = resp.data?.refresh_token
        if (newToken) setToken(newToken)
        if (newRefreshToken) setRefreshToken(newRefreshToken)
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
