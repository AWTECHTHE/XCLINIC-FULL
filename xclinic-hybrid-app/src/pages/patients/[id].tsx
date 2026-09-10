"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import api from "../../lib/api"

interface Patient {
  id: number
  name: string
  birth_date: string | null
  sex: "M" | "F" | "O" | null
}

interface Reading {
  id: number
  patient_id: number
  measured_at: string
  weight_kg: number | null
  height_cm: number | null
  body_fat_percent: number | null
}

interface ReadingFormValues {
  weight_kg: string
  height_cm: string
  body_fat_percent: string
}

const emptyForm: ReadingFormValues = { weight_kg: "", height_cm: "", body_fat_percent: "" }

function toPayload(values: ReadingFormValues) {
  const payload: Record<string, number> = {}
  if (values.weight_kg !== "") payload.weight_kg = Number(values.weight_kg)
  if (values.height_cm !== "") payload.height_cm = Number(values.height_cm)
  if (values.body_fat_percent !== "") payload.body_fat_percent = Number(values.body_fat_percent)
  return payload
}

export default function PatientDetail() {
  const router = useRouter()
  const patientId = typeof router.query.id === "string" ? router.query.id : undefined

  const [patient, setPatient] = useState<Patient | null>(null)
  const [readings, setReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [newReading, setNewReading] = useState<ReadingFormValues>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<ReadingFormValues>(emptyForm)

  const load = async () => {
    if (!patientId) return
    setLoading(true)
    setError("")
    try {
      const [patientRes, readingsRes] = await Promise.all([
        api.get(`/patients/${patientId}`),
        api.get(`/patients/${patientId}/readings/`),
      ])
      setPatient(patientRes.data)
      setReadings(readingsRes.data)
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login")
        return
      }
      if (err.response?.status === 404) {
        setError("Paciente não encontrado.")
      } else {
        setError("Não foi possível carregar o paciente.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId])

  const handleAddReading = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      await api.post(`/patients/${patientId}/readings/`, toPayload(newReading))
      setNewReading(emptyForm)
      await load()
    } catch (err) {
      setError("Não foi possível adicionar a leitura.")
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (reading: Reading) => {
    setEditingId(reading.id)
    setEditValues({
      weight_kg: reading.weight_kg?.toString() ?? "",
      height_cm: reading.height_cm?.toString() ?? "",
      body_fat_percent: reading.body_fat_percent?.toString() ?? "",
    })
  }

  const handleSaveEdit = async (readingId: number) => {
    setError("")
    try {
      await api.patch(`/patients/${patientId}/readings/${readingId}`, toPayload(editValues))
      setEditingId(null)
      await load()
    } catch (err) {
      setError("Não foi possível salvar a leitura.")
    }
  }

  const handleDelete = async (readingId: number) => {
    setError("")
    try {
      await api.delete(`/patients/${patientId}/readings/${readingId}`)
      setReadings((prev) => prev.filter((r) => r.id !== readingId))
    } catch (err) {
      setError("Não foi possível remover a leitura.")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Link href="/patients" className="text-blue-600 underline text-sm">
        ← Voltar para pacientes
      </Link>

      {error && (
        <div className="mt-4 mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      {patient && (
        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <p className="text-gray-500 text-sm">
            {patient.birth_date || "Data de nascimento não informada"} ·{" "}
            {patient.sex || "Sexo não informado"}
          </p>
        </div>
      )}

      <form
        onSubmit={handleAddReading}
        className="bg-white shadow rounded-lg p-4 mb-8 flex flex-col md:flex-row gap-3 md:items-end"
      >
        <div>
          <label className="block text-sm text-gray-600 mb-1">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            className="w-full p-2 border rounded"
            value={newReading.weight_kg}
            onChange={(e) => setNewReading((v) => ({ ...v, weight_kg: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Altura (cm)</label>
          <input
            type="number"
            step="0.1"
            className="w-full p-2 border rounded"
            value={newReading.height_cm}
            onChange={(e) => setNewReading((v) => ({ ...v, height_cm: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">% Gordura</label>
          <input
            type="number"
            step="0.1"
            className="w-full p-2 border rounded"
            value={newReading.body_fat_percent}
            onChange={(e) =>
              setNewReading((v) => ({ ...v, body_fat_percent: e.target.value }))
            }
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="py-2 px-4 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
        >
          {submitting ? "Salvando..." : "Adicionar leitura"}
        </button>
      </form>

      <h2 className="text-xl mb-3">Histórico de leituras</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {readings.length === 0 ? (
          <p className="p-4 text-gray-500">
            Nenhuma leitura registrada ainda. Adicione uma acima ou faça o{" "}
            <Link href="/uploadPage" className="text-blue-600 underline">
              upload de um relatório
            </Link>
            .
          </p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-4">Data</th>
                <th className="text-left py-2 px-4">Peso (kg)</th>
                <th className="text-left py-2 px-4">Altura (cm)</th>
                <th className="text-left py-2 px-4">% Gordura</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {readings.map((reading) =>
                editingId === reading.id ? (
                  <tr key={reading.id} className="border-t bg-blue-50">
                    <td className="py-2 px-4 text-sm text-gray-500">
                      {new Date(reading.measured_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        step="0.1"
                        className="w-20 p-1 border rounded"
                        value={editValues.weight_kg}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, weight_kg: e.target.value }))
                        }
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        step="0.1"
                        className="w-20 p-1 border rounded"
                        value={editValues.height_cm}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, height_cm: e.target.value }))
                        }
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        step="0.1"
                        className="w-20 p-1 border rounded"
                        value={editValues.body_fat_percent}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, body_fat_percent: e.target.value }))
                        }
                      />
                    </td>
                    <td className="py-2 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleSaveEdit(reading.id)}
                        className="text-green-600 hover:text-green-800 text-sm mr-3"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={reading.id} className="border-t">
                    <td className="py-2 px-4 text-sm text-gray-500">
                      {new Date(reading.measured_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">{reading.weight_kg ?? "-"}</td>
                    <td className="py-2 px-4">{reading.height_cm ?? "-"}</td>
                    <td className="py-2 px-4">{reading.body_fat_percent ?? "-"}</td>
                    <td className="py-2 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => startEdit(reading)}
                        className="text-blue-600 hover:text-blue-800 text-sm mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(reading.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
