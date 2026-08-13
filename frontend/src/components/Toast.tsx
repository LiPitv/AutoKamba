import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200)
  }, [])

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-sos" />,
    info: <Info className="h-5 w-5 text-sky-500" />,
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-lg animate-[slideIn_.2s_ease-out]"
          >
            {icons[t.type]}
            <p className="flex-1 text-sm text-ink">{t.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-muted hover:text-ink"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider')
  return ctx
}