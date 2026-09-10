"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "../lib/api"
import "../styles/globals.css"

interface DashboardData {
  message: string
  user: { sub?: string }
  data: { total_users: number }
}

interface Patient {
  id: number
  name: string
  birth_date: string | null
  sex: "M" | "F" | "O" | null
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    Promise.all([api.get("/dashboard/"), api.get("/patients/", { params: { limit: 5 } })])
      .then(([dashboardRes, patientsRes]) => {
        setDashboard(dashboardRes.data)
        setPatients(patientsRes.data)
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          router.push("/login")
          return
        }
        setError("Não foi possível carregar o dashboard.")
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      {dashboard && (
        <div className="mb-6">
          <h1 className="text-2xl mb-1">
            Bem-vindo{dashboard.user?.sub ? `, ${dashboard.user.sub}` : ""}!
          </h1>
          <p className="text-gray-500">{dashboard.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total de usuários cadastrados</p>
          <p className="text-3xl font-bold">{dashboard?.data.total_users ?? "-"}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Seus pacientes</p>
          <p className="text-3xl font-bold">{patients.length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Pacientes recentes</h2>
        <Link href="/patients" className="text-blue-600 underline text-sm">
          Ver todos / adicionar
        </Link>
      </div>

      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-2 px-4">Nome</th>
            <th className="text-left py-2 px-4">Nascimento</th>
            <th className="text-left py-2 px-4">Sexo</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td className="py-4 px-4 text-gray-500" colSpan={3}>
                Nenhum paciente cadastrado ainda.
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id} className="border-t">
                <td className="py-2 px-4">{patient.name}</td>
                <td className="py-2 px-4">{patient.birth_date || "-"}</td>
                <td className="py-2 px-4">{patient.sex || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
