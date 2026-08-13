import { useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { CircleDollarSign } from 'lucide-react'
import { professionalApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Card, EmptyState, PageTitle, Select, Spinner } from '../../components/ui'
import { money } from '../../utils/format'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function EarningsPage() {
  const now = new Date()
  const [mes, setMes] = useState(String(now.getMonth() + 1))
  const [ano, setAno] = useState(String(now.getFullYear()))
  const { data, loading } = useFetch(() => professionalApi.earnings(Number(mes), Number(ano)), [mes, ano])

  const earnings = data?.earnings
  const series: { dia: string; total: number }[] = earnings?.serie ?? []

  const chartData = useMemo(
    () => ({
      labels: series.map((s) => s.dia.slice(5)),
      datasets: [
        {
          label: 'Ganhos (Kz)',
          data: series.map((s) => s.total),
          backgroundColor: '#00B86B',
          hoverBackgroundColor: '#087A4B',
          borderRadius: 8,
        },
      ],
    }),
    [series],
  )

  return (
    <div>
      <PageTitle
        title="Ganhos"
        subtitle="Acompanha os teus rendimentos ao longo do tempo."
        actions={
          <div className="flex gap-2">
            <Select value={mes} onChange={(e) => setMes(e.target.value)} className="w-36">
              {monthNames.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </Select>
            <Select value={ano} onChange={(e) => setAno(e.target.value)} className="w-28">
              {[now.getFullYear(), now.getFullYear() - 1].map((a) => <option key={a} value={a}>{a}</option>)}
            </Select>
          </div>
        }
      />

      {loading ? (
        <Spinner label="A carregar ganhos..." />
      ) : !earnings ? (
        <EmptyState icon={<CircleDollarSign className="h-10 w-10" />} title="Sem ganhos" description="Os ganhos aparecem quando concluis serviços." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Hoje', value: earnings.hoje },
              { label: 'Esta semana', value: earnings.semana },
              { label: 'Este mês', value: earnings.mes },
              { label: 'Total', value: earnings.total },
            ].map((s) => (
              <Card key={s.label}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">{s.label}</p>
                <p className="mt-2 text-2xl font-extrabold text-ink">{money(s.value)}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-5">
            <div className="flex items-center justify-between">
              <p className="font-bold text-ink">Ganhos diários — {monthNames[Number(mes) - 1]} {ano}</p>
              <p className="text-xs text-muted">Líquido (após comissão AutoKamba)</p>
            </div>
            {series.length === 0 ? (
              <p className="mt-6 text-center text-sm text-muted">Sem serviços concluídos neste mês.</p>
            ) : (
              <div className="mt-5 h-72">
                <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v) => `${v}` }, grid: { color: '#F2F4F7' } }, x: { grid: { display: false } } } }} />
              </div>
            )}
          </Card>

          <Card className="mt-5">
            <p className="font-bold text-ink">Resumo de comissões</p>
            <div className="mt-3 flex justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
              <span className="text-muted">Comissão total paga à AutoKamba</span>
              <b className="text-ink">{money(earnings.comissao_total)}</b>
            </div>
            <div className="mt-2 flex justify-between rounded-xl bg-primary/5 px-4 py-3 text-sm ring-1 ring-primary/20">
              <span className="text-muted">Valor líquido acumulado</span>
              <b className="text-primary">{money(earnings.total)}</b>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}