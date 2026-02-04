"use client"

import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Button } from "./button"

interface ImageUploadProps {
  value?: string | null
  file?: File | null
  onFileChange: (file: File | null) => void
  disabled?: boolean
}

export function ImageUpload({ value, file, onFileChange, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Create preview URL from file
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [file])

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      return
    }
    onFileChange(selectedFile)
  }, [onFileChange])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }, [handleFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const selectedFile = e.dataTransfer.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleRemove = useCallback(() => {
    onFileChange(null)
  }, [onFileChange])

  // Show preview (either from saved value or local file)
  const displayUrl = value || previewUrl

  if (displayUrl) {
    return (
      <div className="relative group">
        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border bg-muted">
          <Image
            src={displayUrl}
            alt="Imagem do enunciado"
            fill
            className="object-contain"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleRemove}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
        ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <ImageIcon className="h-8 w-8" />
        <span className="text-sm">Arraste uma imagem ou clique para selecionar</span>
        <span className="text-xs">(Opcional)</span>
      </div>
    </div>
  )
}
