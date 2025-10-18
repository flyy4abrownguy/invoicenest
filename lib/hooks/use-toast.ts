import { useState } from "react"

type ToastType = "default" | "success" | "destructive"

interface Toast {
  id: string
  title?: string
  description?: string
  type?: ToastType
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({
    title,
    description,
    type = "default",
    duration = 5000,
  }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(7)
    const newToast = { id, title, description, type, duration }

    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)

    return id
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return {
    toasts,
    toast,
    dismiss,
  }
}
