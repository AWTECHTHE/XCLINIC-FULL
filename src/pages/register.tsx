import '../styles/globals.css'
 
"use client"

import "../styles/globals.css"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError("All fields are required")
      return
    }
    setError("")
    try {
      // IMPORTANTE: enviar "username" ao back-end
      const response = await axios.post("http://localhost:90/users/register/", {
        username: name,
        email,
        password,
      })
      console.log("Registration success:", response.data)
      router.push("/login")
    } catch (err: any) {
      console.error(err)
      // Se for um objeto complexo, converta para string para evitar erro de render
      const detail = err.response?.data?.detail
      setError(typeof detail === "string" ? detail : JSON.stringify(detail))
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          Register
        </button>
      </form>
    </div>
  )
}
