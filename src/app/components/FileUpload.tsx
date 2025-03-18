"use client"

import React, { useState, useRef, DragEvent } from "react"
import {
    LucideUploadCloud,
    LucideX,
    LucideFile,
    LucideAlertCircle,
    LucideCheckCircle,
} from "lucide-react"
import axios from "axios"

import '../../styles/globals.css'
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


export default function FileUpload() {
    const [files, setFiles] = useState<FileWithStatus[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
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
        if (files.length === 0) return

        setIsUploading(true)
        setFiles((prevFiles) =>
            prevFiles.map((f) => ({ ...f, status: "uploading" })),
        )

        const uploadPromises = files.map(async (fileWithStatus) => {
            const formData = new FormData()
            formData.append("file", fileWithStatus.file)

            try {
                await axios.post(
                    "http://localhost:90/inbody/",
                    formData
                )

                // Se sucesso
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
                            : f,
                    ),
                )
                return { id: fileWithStatus.id, success: false }
            }
        })

        await Promise.all(uploadPromises)

        setTimeout(() => {
            setIsUploading(false)
            setFiles((prevFiles) => prevFiles.filter((file) => file.status !== "success"))
        }, 2000)
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload de Arquivos</h2>

            {/* Área de Drag & Drop */}
            <div
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 transition-all duration-200 ease-in-out cursor-pointer",
                    isDragging ? "border-blue-600 bg-blue-50" : "border-blue-300 bg-blue-50/50 hover:bg-blue-50",
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
                            isDragging ? "text-blue-600" : "text-blue-500",
                        )}
                    />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Arraste e solte arquivos aqui</h3>
                    <p className="text-gray-500 mb-4">
                        ou <span className="text-blue-600 font-medium">clique para selecionar</span>
                    </p>
                    <p className="text-sm text-gray-400">Suporta qualquer tipo de arquivo até 10MB</p>
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
                                            <p className="text-sm font-medium text-gray-700 truncate">{file.file.name}</p>
                                            <p className="text-xs text-gray-500">{formatFileSize(file.file.size)}</p>
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
                                    {/* {file.status === "uploading" && (
                                        <div className="mt-2">
                                            <Progress value={file.progress} className="h-1.5" />
                                            <p className="text-xs text-gray-500 mt-1">{Math.round(file.progress)}%</p>
                                        </div>
                                    )} */}
                                    {file.status === "uploading" && (
                                        <div className="mt-2 flex items-center">
                                            {/* Spinner simples (pode ser um ícone animado ou CSS) */}
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
                <UploadButton onClick={handleUpload} disabled={files.length === 0 || isUploading}>
                    {isUploading ? "Enviando..." : "Enviar Arquivos"}
                </UploadButton>

            </div>
        </div>
    )
}
