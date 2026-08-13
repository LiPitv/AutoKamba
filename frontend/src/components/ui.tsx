import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { X } from 'lucide-react'

type Variant = 'primary' | 'dark' | 'sos' | 'outline' | 'ghost' | 'warn' | 'white'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  dark: 'bg-ink text-white hover:bg-black',
  sos: 'bg-sos text-white hover:bg-red-600',
  warn: 'bg-warn text-ink hover:bg-amber-500',
  outline: 'border border-gray-200 text-ink hover:border-primary hover:text-primary',
  ghost: 'text-muted hover:text-ink hover:bg-gray-50',
  white: 'bg-white text-ink border border-gray-200 hover:border-primary',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
}

export function Button({ variant = 'primary', loading, disabled, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition
        disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <label className="block text-left">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <input
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition
          placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20
          ${error ? 'border-sos' : 'border-gray-200'} ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-sos">{error}</span>}
    </label>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  defaultOption?: string
}

export function Select({ label, defaultOption, className = '', children, ...props }: SelectProps) {
  return (
    <label className="block text-left">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <select
        className={`w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none
          transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
        {...props}
      >
        {defaultOption ? (
          <option value="" disabled hidden>{defaultOption}</option>
        ) : null}
        {children}
      </select>
    </label>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <label className="block text-left">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <textarea
        className={`w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition
          placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
        {...props}
      />
    </label>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

type BadgeTone = 'green' | 'red' | 'yellow' | 'gray' | 'blue'

const tones: Record<BadgeTone, string> = {
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-sos',
  yellow: 'bg-amber-50 text-amber-700',
  gray: 'bg-gray-100 text-muted',
  blue: 'bg-sky-50 text-sky-700',
}

export function Badge({ tone = 'gray', children, className = '' }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  )
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 py-14 text-center">
      {icon && <div className="text-muted">{icon}</div>}
      <p className="text-base font-semibold text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ${wide ? 'max-w-3xl' : 'max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-gray-100 hover:text-ink" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Avatar({ src, name, size = 40 }: { src?: string | null; name?: string; size?: number }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase()
  return src ? (
    <img src={src} alt={name || 'Avatar'} style={{ width: size, height: size }} className="rounded-full object-cover" />
  ) : (
    <div
      className="flex items-center justify-center rounded-full bg-primary/10 font-bold text-primary-dark"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </div>
  )
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function StatsCards({ items }: { items: { label: string; value: string; hint?: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{item.label}</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{item.value}</p>
          {item.hint && <p className="mt-1 text-xs text-muted">{item.hint}</p>}
        </Card>
      ))}
    </div>
  )
}