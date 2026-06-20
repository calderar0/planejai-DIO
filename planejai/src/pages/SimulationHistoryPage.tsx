import {
  CalendarClock,
  CreditCardIcon,
  Goal,
  Landmark,
  PiggyBank,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/button'
import { PageHero } from '@/components/shared/PageHero'
import { type SimulationRecord } from '@/data/simulations'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

function formatCurrency(value: string) {
  return value.startsWith('R$') ? value : `R$ ${value}`
}

function HistoryMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="bg-background/60 rounded-xl border border-border/60 p-3">
      <div className="mb-1 flex items-center gap-2">
        <Icon size={14} className="text-primary" />
        <span className="text-muted-foreground text-xs font-semibold uppercase">
          {label}
        </span>
      </div>
      <p className="text-foreground text-sm font-medium">{value}</p>
    </div>
  )
}

function HistoryCard({
  simulation,
  onDelete,
  onDetails,
}: {
  simulation: SimulationRecord
  onDelete: (id: string) => void
  onDetails: (id: string) => void
}) {
  const monthlySavings = calcMonthlySavings(simulation)

  return (
    <article className="bg-card rounded-2xl border border-border/60 p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Goal size={16} className="text-primary" />
            <h2 className="text-foreground text-lg font-semibold">
              {simulation.goalName}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Simulação criada em{' '}
            {simulation.createdAt
              ? new Date(simulation.createdAt).toLocaleString('pt-BR')
              : 'data indisponível'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onDetails(simulation.id)}
          >
            Ver detalhes
          </Button>
          <Button
            type="button"
            variant="ghost"
            icon={Trash2}
            onClick={() => onDelete(simulation.id)}
          >
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <HistoryMetric
          icon={PiggyBank}
          label="Renda"
          value={formatCurrency(simulation.income)}
        />
        <HistoryMetric
          icon={CreditCardIcon}
          label="Custos fixos"
          value={formatCurrency(simulation.expenses)}
        />
        <HistoryMetric
          icon={Landmark}
          label="Dívidas"
          value={formatCurrency(simulation.debts)}
        />
        <HistoryMetric
          icon={CalendarClock}
          label="Economia mensal"
          value={`R$ ${monthlySavings.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
      </div>
    </article>
  )
}

export function SimulationHistoryPage() {
  const navigate = useNavigate()
  const { deleteSimulation, simulations } = useSimulationStorage()

  const orderedSimulations = useMemo(
    () =>
      [...simulations].sort((left, right) => {
        const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0
        const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0

        return rightTime - leftTime
      }),
    [simulations],
  )

  const handleDelete = (id: string) => {
    deleteSimulation(id)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Revise suas análises salvas, abra os detalhes e remova o que não precisar mais."
      />

      {!orderedSimulations.length ? (
        <section className="bg-card rounded-2xl border border-border/60 p-8 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)]">
          <h2 className="text-foreground text-xl font-semibold">
            Nenhuma simulação salva ainda
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Faça uma nova simulação para começar a acompanhar seu histórico.
          </p>
          <Button
            type="button"
            variant="primary"
            className="mt-6"
            onClick={() => navigate('/')}
          >
            Nova simulação
          </Button>
        </section>
      ) : (
        <div className="grid gap-4">
          {orderedSimulations.map((simulation) => (
            <HistoryCard
              key={simulation.id}
              simulation={simulation}
              onDelete={handleDelete}
              onDetails={(id) => navigate(`/resultado/${id}`)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
