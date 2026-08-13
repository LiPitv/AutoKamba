import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import CategoryIcon from '../../components/CategoryIcon'
import { ChevronLeft, ChevronRight, CircleAlert, ImagePlus, Loader2, MapPin, Phone, Siren, Star, X } from 'lucide-react'
import { categoryApi, professionalApi, requestApi, vehicleApi } from '../../services'
import { Button, Card, EmptyState, Input, PageTitle, Textarea } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { useGeolocation, Map } from '../../components/Map'
import { apiError, distanciaKm } from '../../utils/format'
import type { ServiceCategory } from '../../types'

const steps = ['Avaria', 'Detalhes', 'Veículo', 'Local', 'Confirmar'] as const

export default function RequestWizardPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { toast } = useToast()
  const getLocation = useGeolocation()

  const [step, setStep] = useState(0)
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [professionals, setProfessionals] = useState<any[]>([])
  const [loadingProfs, setLoadingProfs] = useState(false)

  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [descricao, setDescricao] = useState('')
  const [vehicleId, setVehicleId] = useState<number | ''>('')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [endereco, setEndereco] = useState('')
  const [fotos, setFotos] = useState<File[]>([])
  const [providerId, setProviderId] = useState<number | ''>('')
  const [locating, setLocating] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    categoryApi.all().then(({ categories }) => setCategories(categories)).catch(() => undefined)
    vehicleApi.all().then(({ vehicles }) => setVehicles(vehicles)).catch(() => undefined)
    const prof = params.get('profissional')
    const cat = params.get('categoria')
    if (cat) setCategoryId(Number(cat))
    if (prof) setProviderId(Number(prof))
  }, [params])

  useEffect(() => {
    if (providerId && categoryId) {
      setLat(-8.8383334)
      setLng(13.2344444)
    } else if (categoryId) {
      const category = categories.find((c) => c.id === Number(categoryId))
      if (category) setProviderId('')
    }
  }, [categoryId, providerId, categories])

  const selectedCategory = categories.find((c) => c.id === Number(categoryId))
  const selectedProfessional = professionals.find((p) => p.id === Number(providerId))

  const locate = async () => {
    setLocating(true)
    try {
      const pos = await getLocation()
      setLat(pos.latitude)
      setLng(pos.longitude)
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setLocating(false)
    }
  }

  const searchProfessionals = async () => {
    if (lat == null || lng == null) return
    setLoadingProfs(true)
    try {
      const { professionals } = await professionalApi.nearby(lat, lng, 15, categoryId ? Number(categoryId) : undefined)
      setProfessionals(professionals)
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setLoadingProfs(false)
    }
  }

  const mostrarResultados = step === 3 && lat != null && lng != null
  useEffect(() => {
    if (mostrarResultados && professionals.length === 0 && !loadingProfs) searchProfessionals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostrarResultados])

  const canNext =
    step === 0 ? categoryId !== ''
    : step === 1 ? descricao.trim() !== ''
    : step === 2 ? true
    : lat != null && lng != null

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      const result = await requestApi.create(
        {
          category_id: Number(categoryId),
          vehicle_id: vehicleId || undefined,
          latitude: lat!,
          longitude: lng!,
          endereco: endereco || undefined,
          descricao: descricao || undefined,
          provider_id: providerId || undefined,
        },
        fotos,
      )
      navigate(`/app/pedidos/${result.id}`)
      toast('Pedido SOS enviado! Estamos a procurar ajuda.', 'success')
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const points = useMemo(() => {
    const pts: { lat: number; lng: number; label?: string; type?: 'sos' | 'provider' }[] = []
    if (lat != null && lng != null) pts.push({ lat, lng, type: 'sos' })
    professionals.forEach((p) => pts.push({ lat: p.latitude, lng: p.longitude, label: `${p.nome} (${distanciaKm(p.distancia_km)})`, type: 'provider' }))
    return pts
  }, [lat, lng, professionals])

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="Pedir assistência" subtitle="Preenche os detalhes da avaria. Leva menos de um minuto." />

      <ol className="mb-6 flex items-center gap-2">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              i < step ? 'bg-primary text-white' : i === step ? 'bg-primary/15 text-primary-dark ring-2 ring-primary' : 'bg-gray-100 text-muted'
            }`}>
              {i < step ? '✓' : i + 1}
            </span>
            <span className={`hidden text-xs font-semibold sm:block ${i === step ? 'text-ink' : 'text-muted'}`}>{s}</span>
            {i < steps.length - 1 && <span className="h-0.5 flex-1 rounded bg-gray-200" />}
          </li>
        ))}
      </ol>

      <form onSubmit={submit} className="space-y-4">
        {step === 0 && (
          <>
            <p className="text-sm font-semibold text-ink">Que tipo de avaria tens?</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    categoryId === c.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-200 bg-white hover:border-primary/50'
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl"><CategoryIcon icone={c.icone} className="h-5 w-5 text-primary" /></span>
                  <div>
                    <p className="text-sm font-bold text-ink">{c.nome}</p>
                    {c.descricao && <p className="text-xs text-muted">{c.descricao}</p>}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <Card>
            <Textarea
              label="Descreve o que aconteceu"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              placeholder="Ex.: O carro não ligou e faz um barulho estranho ao tentar arrancar. Estou na estrada principal, junto à rotunda do Kilamba."
            />
            <div className="mt-4">
              <p className="mb-1.5 block text-sm font-semibold text-ink">Fotos (opcional)</p>
              <div className="flex flex-wrap gap-3">
                {fotos.map((f, i) => (
                  <span key={i} className="relative">
                    <img src={URL.createObjectURL(f)} alt="Anexo" className="h-20 w-20 rounded-xl object-cover" />
                    <button type="button" onClick={() => setFotos(fotos.filter((_, x) => x !== i))} className="absolute -right-2 -top-2 rounded-full bg-sos p-1 text-white">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-muted hover:border-primary hover:text-primary">
                  <ImagePlus className="h-6 w-6" />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFotos([...fotos, ...Array.from(e.target.files ?? [])])} />
                </label>
              </div>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <p className="text-sm font-semibold text-ink">Qual veículo está avariado?</p>
            {vehicles.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="Sem veículos registados" description="Adiciona um veículo para que o profissional saiba o que encontrar." />
                <Link to="/app/veiculos" className="mt-4 inline-block text-sm font-bold text-primary hover:text-primary-dark">Gerir veículos →</Link>
              </div>
            ) : (
              <div className="mt-3 space-y-2.5">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicleId(v.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      vehicleId === v.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-200 bg-white hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-ink">{v.marca} {v.modelo}</p>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-muted">{v.placa}</span>
                    </div>
                    {(v.cor || v.ano) && <p className="mt-1 text-xs text-muted">{v.cor} {v.ano ? `• ${v.ano}` : ''}</p>}
                    {!v.principal && <p className="mt-1 text-[11px] text-warn">Não é o veículo principal</p>}
                  </button>
                ))}
                <button type="button" onClick={() => setVehicleId('')} className="w-full rounded-2xl border border-dashed border-gray-200 p-3.5 text-sm font-semibold text-muted hover:border-primary hover:text-primary">
                  Sem veículo registado
                </button>
              </div>
            )}
          </Card>
        )}

        {step === 3 && (
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-bold text-ink"><MapPin className="h-4.5 w-4.5 text-sos" /> Onde estás?</p>
              <Button type="button" variant={lat != null ? 'outline' : 'sos'} onClick={locate} loading={locating}>
                {lat != null ? 'Reutilizar localização' : 'Usar a minha localização'}
              </Button>
            </div>
            {lat != null && lng != null ? (
              <div className="mt-3 space-y-3">
                <Map
                  center={[lat, lng]}
                  zoom={13}
                  className="h-64 w-full rounded-2xl"
                  points={points}
                  onClick={(d) => { setLat(d.lat); setLng(d.lng) }}
                  radiusKm={5}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input type="number" step="any" value={lat} onChange={(e) => setLat(Number(e.target.value))} label="Latitude" />
                  <Input type="number" step="any" value={lng} onChange={(e) => setLng(Number(e.target.value))} label="Longitude" />
                </div>
                <Input value={endereco} onChange={(e) => setEndereco(e.target.value)} label="Endereço / ponto de referência (opcional)" placeholder="Ex.: Rotunda do Kilamba, junto ao supermercado" />
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                    <Siren className="h-4 w-4 text-sos" /> Profissionais perto de ti
                    {loadingProfs && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
                  </p>
                  {professionals.length === 0 && !loadingProfs ? (
                    <p className="rounded-xl bg-gray-50 p-4 text-sm text-muted">Nenhum profissional encontrado neste raio. Sem problema: o pedido será enviado para as centrais e profissionais disponíveis em Luanda.</p>
                  ) : (
                    <div className="space-y-2">
                      {professionals.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setProviderId(providerId === p.id ? '' : p.id)}
                          className={`w-full rounded-2xl border p-3.5 text-left transition ${
                            providerId === p.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-200 bg-white hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary-dark">{p.nome?.charAt(0)}</span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-ink">{p.nome} {providerId === p.id ? '✓' : ''}</p>
                              <p className="flex items-center gap-1 text-xs text-muted">
                                <Star className="h-3 w-3 fill-warn text-warn" /> {p.avaliacao_media ?? '—'} ({p.numero_avaliacoes}) • {distanciaKm(p.distancia_km)}
                              </p>
                            </div>
                            {p.preco_base != null && <span className="text-sm font-bold text-primary">{p.preco_base} Kz</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="rounded-xl bg-gray-50 p-3.5 text-xs leading-relaxed text-muted">
                  {selectedProfessional ? (
                    <>Pedido dirigido a <b className="text-ink">{selectedProfessional.nome}</b>. Se não aceitar em 5 minutos, enviamos para outros profissionais próximos.</>
                  ) : providerId === '' && (
                    <>Sem profissional escolhido: o pedido será enviado aos <b className="text-ink">profissionais verificados</b> na tua zona. Aceita a melhor proposta.</>
                  )}
                </p>
              </div>
            ) : (
              <EmptyState icon={<MapPin className="h-10 w-10" />} title="Falta a tua localização" description="Usa o botão acima para partilhar a tua posição." />
            )}
          </Card>
        )}

        {step === 4 && selectedCategory && (
          <Card>
            <p className="flex items-center gap-2 font-bold text-ink"><CircleAlert className="h-5 w-5 text-sos" /> Confirmar pedido</p>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3"><span className="text-muted">Tipo de avaria</span><b className="text-ink">{selectedCategory.nome}</b></div>
              {descricao && <div className="flex justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3"><span className="shrink-0 text-muted">Descrição</span><b className="text-right text-ink">{descricao}</b></div>}
              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3"><span className="text-muted">Local</span><b className="text-ink">{endereco || `${lat?.toFixed(4)}, ${lng?.toFixed(4)}`}</b></div>
              {selectedProfessional && <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3"><span className="text-muted">Profissional</span><b className="text-ink">{selectedProfessional.nome}</b></div>}
            </div>
            <Button type="submit" variant="sos" loading={busy} className="mt-5 w-full py-4 text-base">
              <Phone className="h-5 w-5" /> Enviar pedido SOS
            </Button>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => (step === 0 ? navigate('/app/meus-pedidos') : setStep(step - 1))}>
            <ChevronLeft className="h-4 w-4" /> {step === 0 ? 'Cancelar' : 'Anterior'}
          </Button>
          {step < 4 && (
            <Button type="button" disabled={!canNext} onClick={() => setStep(step + 1)}>
              Continuar <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}