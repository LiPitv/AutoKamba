import { useCallback, useEffect, useRef, useState } from 'react'

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const inFlight = useRef(false)

  const run = useCallback(() => {
    if (inFlight.current) return
    inFlight.current = true
    setLoading(true)
    setError(null)
    fetcher()
      .then((result) => {
        setData(result)
        setLoading(false)
        inFlight.current = false
      })
      .catch((err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ??
          (err as { message?: string })?.message ??
          'Erro ao carregar.'
        setError(msg)
        setLoading(false)
        inFlight.current = false
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run()
  }, [run])

  return { data, loading, error, refetch: run }
}