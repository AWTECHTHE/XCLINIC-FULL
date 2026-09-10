"use client"

import { useState, type FormEvent } from "react"
import api, { setToken, setRefreshToken } from "../lib/api"
import { useRouter } from "next/navigation"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Both fields are required")
      return
    }
    setError("")
    try {
      // Backend (app/routers/user.py) expõe POST /login/ e espera "username", não "email"
      const response = await api.post(`/login/`, {
        username,
        password,
      })
      const token = response.data.access_token || response.data.token
      const refreshToken = response.data.refresh_token
      if (token) {
        try {
          // Tentar usar Secure Storage (Capacitor) em apps nativos
          const secure = await import("../lib/secureStorage")
          await secure.setSecureItem("xclinic_token", token)
          if (refreshToken) await secure.setSecureItem("xclinic_refresh_token", refreshToken)
        } catch (e) {
          // Fallback para cookie via setToken (não HttpOnly)
          setToken(token)
          if (refreshToken) setRefreshToken(refreshToken)
        }
      }
      router.push("/dashboard")
    } catch (err: any) {
      console.error(err)
      const detail = err.response?.data?.detail
      setError(typeof detail === "string" ? detail : JSON.stringify(detail))
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Username</label>
          <input
            id="username"
            type="text"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            id="password"
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}