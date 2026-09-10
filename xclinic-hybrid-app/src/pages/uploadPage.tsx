"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import FileUpload from "../app/components/FileUpload"
import api from "../lib/api"

interface Patient {
  id: number
  name: string
}

export default function HomePage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientId, setPatientId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    api
      .get("/patients/")
      .then((response) => {
        setPatients(response.data)
        if (response.data.length > 0) setPatientId(response.data[0].id)
      })
      .catch((err) => {
        if (err.response?.status === 401) router.push("/login")
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 gap-4">
      <div className="w-full max-w-2xl">
        <label className="block text-sm text-gray-600 mb-1">Paciente</label>
        {loading ? (
          <p className="text-gray-500 text-sm">Carregando pacientes...</p>
        ) : patients.length === 0 ? (
          <p className="text-sm text-gray-600">
            Nenhum paciente cadastrado ainda.{" "}
            <Link href="/patients" className="text-blue-600 underline">
              Cadastrar paciente
            </Link>
          </p>
        ) : (
          <select
            className="w-full p-2 border rounded bg-white"
            value={patientId ?? ""}
            onChange={(e) => setPatientId(Number(e.target.value))}
          >
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <FileUpload patientId={patientId} />
    </main>
  )
}
