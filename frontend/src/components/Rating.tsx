import { Star } from 'lucide-react'

export function Rating({ value, size = 16, className = '' }: { value: number | null | undefined; size?: number; className?: string }) {
  if (value == null) return <span className={`text-xs text-muted ${className}`}>Sem avaliações</span>
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(value) ? 'fill-warn text-warn' : 'fill-gray-200 text-gray-200'}
        />
      ))}
      <span className="ml-1 text-sm font-bold text-ink">{Number(value).toFixed(1)}</span>
    </span>
  )
}

export function RatingInput({
  value,
  onChange,
  label = 'Como foi o serviço?',
}: {
  value: number
  onChange: (v: number) => void
  label?: string
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" onClick={() => onChange(i)} aria-label={`${i} estrelas`}>
            <Star
              className={`h-8 w-8 transition ${i <= value ? 'fill-warn text-warn' : 'fill-gray-200 text-gray-200 hover:fill-amber-200'}`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}