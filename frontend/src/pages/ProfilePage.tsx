import { useEffect, useState, type FormEvent } from 'react'
import { Mail, Camera } from 'lucide-react'
import { userApi, professionalApi } from '../services'
import { useAuth } from '../contexts/AuthContext'
import { Button, Card, Input, PageTitle, Textarea, Avatar, Spinner } from '../components/ui'
import { useToast } from '../components/Toast'
import { apiError } from '../utils/format'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', descricao: '', especialidade: '', area_atendimento: '', preco_base: '' })
  const [busy, setBusy] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    userApi
      .profile()
      .then(({ user }) => {
        setForm({
          nome: user.nome,
          telefone: user.telefone,
          email: user.email,
          descricao: user.descricao ?? '',
          especialidade: user.especialidade ?? '',
          area_atendimento: user.area_atendimento ?? '',
          preco_base: user.preco_base != null ? String(user.preco_base) : '',
        })
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true))
  }, [])

  if (!user || !loaded) return <Spinner label="A carregar perfil..." />

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const data: Record<string, unknown> = { nome: form.nome, telefone: form.telefone, email: form.email }
    if (user.role === 'prestador') {
      data.descricao = form.descricao
      data.especialidade = form.especialidade
      data.area_atendimento = form.area_atendimento
      data.preco_base = form.preco_base
    }
    try {
      const { user: updated } = await userApi.update(data)
      setUser(updated)
      if (user.role === 'prestador') await professionalApi.me().catch(() => undefined)
      toast('Perfil atualizado com sucesso.', 'success')
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const uploadAvatar = async (file?: File | null) => {
    if (!file) return
    setAvatarBusy(true)
    try {
      const { avatar } = await userApi.avatar(file)
      setUser({ ...user, avatar })
      toast('Foto atualizada.', 'success')
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setAvatarBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle title="O meu perfil" subtitle="Gerencia os teus dados pessoais." />
      <Card>
        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer">
            <Avatar src={user.avatar} name={user.nome} size={72} />
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow">
              {avatarBusy ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Camera className="h-3.5 w-3.5" />}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadAvatar(e.target.files?.[0])} />
          </label>
          <div>
            <p className="text-lg font-bold text-ink">{user.nome}</p>
            <p className="text-sm text-muted capitalize">{user.role === 'prestador' ? 'Profissional' : user.role === 'admin' ? 'Administrador' : 'Condutor'}</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Nome completo" value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Telefone" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </div>
          {user.role === 'prestador' && (
            <>
              <Textarea label="Apresentação" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} rows={3} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Especialidade" value={form.especialidade} onChange={(e) => set('especialidade', e.target.value)} />
                <Input label="Área de atendimento" value={form.area_atendimento} onChange={(e) => set('area_atendimento', e.target.value)} />
              </div>
              <Input label="Preço base (Kz)" type="number" value={form.preco_base} onChange={(e) => set('preco_base', e.target.value)} />
            </>
          )}
          <div className="flex items-center justify-between gap-3">
            <p className="hidden items-center gap-1.5 text-xs text-muted sm:flex">
              <Mail className="h-3.5 w-3.5" /> Início de sessão protegido por token seguro
            </p>
            <Button type="submit" loading={busy}>Guardar alterações</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}