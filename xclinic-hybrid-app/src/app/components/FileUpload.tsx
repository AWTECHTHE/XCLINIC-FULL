"use client"

import React, { useState, useRef, DragEvent } from "react"
import {
  LucideUploadCloud,
  LucideX,
  LucideFile,
  LucideAlertCircle,
  LucideCheckCircle,
} from "lucide-react"
import api from "../../lib/api"

import { UploadButton } from "../components/ui/button"
import { cn } from "../lib/utils"

type FileStatus = "idle" | "uploading" | "success" | "error"

interface FileWithStatus {
  file: File
  id: string
  progress: number
  status: FileStatus
  errorMessage?: string
}

function getColorByCategory(category: string | undefined) {
  // Se for "Normal" → verde, se for "Limite" → laranja, caso contrário → vermelho
  if (!category) return "text-gray-500"
  const cat = category.toLowerCase()
  if (cat === "normal") return "text-green-500"
  if (cat === "limite") return "text-orange-500"
  return "text-red-500"
}

interface FileUploadProps {
  patientId: number | null
}

export default function FileUpload({ patientId }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [inbodyData, setInbodyData] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      id: crypto.randomUUID(),
      progress: 0,
      status: "idle" as FileStatus,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileChange(e.dataTransfer.files)
  }

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const handleUpload = async () => {
    if (files.length === 0 || !patientId) return

    setIsUploading(true)
    setFiles((prevFiles) => prevFiles.map((f) => ({ ...f, status: "uploading" })))

    // Para simplificar, vamos fazer upload do primeiro arquivo ou de todos?
    // Se quiser mandar todos, continue como está. Se quiser mandar só 1, ajuste aqui.
    const uploadPromises = files.map(async (fileWithStatus) => {
      const formData = new FormData()
      formData.append("file", fileWithStatus.file)
      formData.append("patient_id", String(patientId))

      try {
        const response = await api.post(`/inbody/`, formData)

        setInbodyData(response.data)

        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === fileWithStatus.id
              ? { ...f, progress: 100, status: "success" }
              : f
          )
        )
        return { id: fileWithStatus.id, success: true }
      } catch (error) {
        console.error("Erro no upload:", error)
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === fileWithStatus.id
              ? {
                  ...f,
                  progress: 100,
                  status: "error",
                  errorMessage: "Falha no upload",
                }
              : f
          )
        )
        return { id: fileWithStatus.id, success: false }
      }
    })

    await Promise.all(uploadPromises)

    // Aguardar 2s para remover arquivos com status=success (opcional)
    setTimeout(() => {
      setIsUploading(false)
      setFiles((prevFiles) => prevFiles.filter((file) => file.status !== "success"))
    }, 2000)
  }

  const imc = inbodyData?.analise_obesidade?.imc
  const pgc = inbodyData?.analise_obesidade?.pgc

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload de Arquivos</h2>

      {/* Área de Drag & Drop */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-all duration-200 ease-in-out cursor-pointer",
          isDragging
            ? "border-blue-600 bg-blue-50"
            : "border-blue-300 bg-blue-50/50 hover:bg-blue-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <LucideUploadCloud
            className={cn(
              "w-16 h-16 mb-4 transition-colors",
              isDragging ? "text-blue-600" : "text-blue-500"
            )}
          />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Arraste e solte arquivos aqui
          </h3>
          <p className="text-gray-500 mb-4">
            ou <span className="text-blue-600 font-medium">clique para selecionar</span>
          </p>
          <p className="text-sm text-gray-400">
            Suporta qualquer tipo de arquivo até 10MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </div>

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Arquivos selecionados ({files.length})
          </h3>
          <ul className="space-y-3">
            {files.map((file) => (
              <li key={file.id} className="bg-gray-50 rounded-lg p-3 flex items-center">
                <div className="mr-3 text-gray-500">
                  <LucideFile className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="truncate pr-2">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.file.size)}
                      </p>
                    </div>
                    {file.status === "success" && (
                      <div className="flex items-center text-green-500 text-xs">
                        <LucideCheckCircle className="w-4 h-4 mr-1" />
                        Sucesso
                      </div>
                    )}
                    {file.status === "error" && (
                      <div className="flex items-center text-red-500 text-xs">
                        <LucideAlertCircle className="w-4 h-4 mr-1" />
                        {file.errorMessage}
                      </div>
                    )}
                  </div>
                  {file.status === "uploading" && (
                    <div className="mt-2 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></div>
                      <p className="text-xs text-gray-500">Enviando...</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile(file.id)
                  }}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors disabled:cursor-not-allowed"
                  disabled={isUploading}
                >
                  <LucideX className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botão de Upload */}
      <div className="mt-6">
        <UploadButton
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading || !patientId}
        >
          {isUploading ? "Enviando..." : "Enviar Arquivos"}
        </UploadButton>
        {!patientId && (
          <p className="mt-2 text-sm text-red-500">
            Selecione um paciente antes de enviar o relatório.
          </p>
        )}
      </div>

      {/* Exibição dos dados de IMC e Gordura Corporal (PGC) */}
      {inbodyData && (
        <div className="mt-8 p-4 border rounded-md">
          <h3 className="text-xl font-semibold mb-4">Resultados de IMC e Gordura</h3>
          <div className="flex gap-8">
            {/* IMC */}
            {imc && (
              <div>
                <p className="font-semibold">IMC:</p>
                <p className={getColorByCategory(imc.categoria)}>
                  Valor: {imc.valor} {imc.unidade}
                </p>
                <p className="text-sm text-gray-500">
                  Categoria: {imc.categoria || "Desconhecida"}
                </p>
              </div>
            )}

            {/* PGC */}
            {pgc && (
              <div>
                <p className="font-semibold">Percentual de Gordura (PGC):</p>
                <p className={getColorByCategory(pgc.categoria)}>
                  Valor: {pgc.valor} {pgc.unidade}
                </p>
                <p className="text-sm text-gray-500">
                  Categoria: {pgc.categoria || "Desconhecida"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}