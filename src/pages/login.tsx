"use client"

import "../styles/globals.css"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Both fields are required")
      return
    }
    setError("")
    try {
      const response = await axios.post("http://localhost:90/users/login/", {
        email,
        password,
      })
      // Supondo que o endpoint retorne um token
      const token = response.data.access_token || response.data.token
      console.log("Login success:", token)
      localStorage.setItem("token", token)
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
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
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