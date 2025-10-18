"use client"

import { useState, useRef } from "react"
import { NestButton } from "@/components/nest/nest-button"
import { Upload, User } from "lucide-react"
import Image from "next/image"

interface AvatarUploadProps {
  currentAvatarUrl?: string
  onUpload?: (url: string) => void
  label?: string
  type?: 'avatar' | 'logo'
}

export function AvatarUpload({
  currentAvatarUrl,
  onUpload,
  label = "Upload Photo",
  type = 'avatar'
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    try {
      setIsUploading(true)

      // Create local preview first
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Supabase Storage
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setPreviewUrl(data.url)
      onUpload?.(data.url)

      console.log('File uploaded successfully:', data.url)

    } catch (error) {
      console.error('Upload error:', error)
      const message = error instanceof Error ? error.message : 'Failed to upload file'
      alert(message)
      // Revert preview on error
      setPreviewUrl(currentAvatarUrl)
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className={`${type === 'avatar' ? 'w-20 h-20' : 'w-32 h-20'} rounded-lg bg-muted flex items-center justify-center overflow-hidden border-2 border-border`}>
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={type === 'avatar' ? 'Profile photo' : 'Company logo'}
            width={type === 'avatar' ? 80 : 128}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <User className="w-8 h-8 text-muted-foreground" />
        )}
      </div>

      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <NestButton
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : label}
        </NestButton>
        <p className="text-sm text-muted-foreground mt-1">JPG or PNG, max 2MB</p>
      </div>
    </div>
  )
}
