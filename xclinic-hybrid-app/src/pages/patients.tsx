"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "../lib/api"

interface Patient {
  id: number
  name: string
  birth_date: string | null
  sex: "M" | "F" | "O" | null
  owner_id: number
  created_at: string
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [sex, setSex] = useState<"" | "M" | "F" | "O">("")
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()

  const loadPatients = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await api.get("/patients/")
      setPatients(response.data)
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login")
        return
      }
      setError("Não foi possível carregar os pacientes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Nome é obrigatório")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      await api.post("/patients/", {
        name,
        birth_date: birthDate || null,
        sex: sex || null,
      })
      setName("")
      setBirthDate("")
      setSex("")
      await loadPatients()
    } catch (err: any) {
      const detail = err.response?.data?.detail
      setError(typeof detail === "string" ? detail : "Não foi possível criar o paciente.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/patients/${id}`)
      setPatients((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError("Não foi possível remover o paciente.")
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Pacientes</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleCreate}
          className="bg-white shadow rounded-lg p-4 mb-8 flex flex-col md:flex-row gap-3 md:items-end"
        >
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Nome</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nascimento</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sexo</label>
            <select
              className="w-full p-2 border rounded"
              value={sex}
              onChange={(e) => setSex(e.target.value as "" | "M" | "F" | "O")}
            >
              <option value="">-</option>
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
              <option value="O">Outro</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="py-2 px-4 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Adicionar paciente"}
          </button>
        </form>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <p className="p-4 text-gray-500">Carregando...</p>
          ) : patients.length === 0 ? (
            <p className="p-4 text-gray-500">Nenhum paciente cadastrado ainda.</p>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-2 px-4">Nome</th>
                  <th className="text-left py-2 px-4">Nascimento</th>
                  <th className="text-left py-2 px-4">Sexo</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-t">
                    <td className="py-2 px-4">
                      <Link href={`/patients/${patient.id}`} className="text-blue-600 underline">
                        {patient.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{patient.birth_date || "-"}</td>
                    <td className="py-2 px-4">{patient.sex || "-"}</td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}
