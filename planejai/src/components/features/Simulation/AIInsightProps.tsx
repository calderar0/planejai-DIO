import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'

import { Send } from 'lucide-react'
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from 'react-loading-skeleton'

import { Content } from '@/components/features/Simulation/Content'
import { Error } from '@/components/features/Simulation/Error'
import { Input } from '@/components/shared/Input'
import { Button } from '@/components/shared/button'
import { buildCoachPrompt } from '@/data/aiPrompt'
import type { SimulationConversation } from '@/data/simulations'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getCoachReply } from '@/services/aiService'

import { useInsight } from '@/hooks/useInsight'

interface AIInsightCardProps {
  simulationId: string
}

function formatConversationHistory(entries: SimulationConversation[]) {
  if (!entries.length) {
    return ''
  }

  return entries
    .map(
      (entry, index) =>
        `${index + 1}. Pergunta: ${entry.question}\n   Resposta: ${entry.answer}`,
    )
    .join('\n')
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
  const { addConversation, getFormData } = useSimulationStorage()
  const simulation = useMemo(
    () => getFormData(simulationId),
    [getFormData, simulationId],
  )

  const [question, setQuestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [conversation, setConversation] = useState<SimulationConversation[]>(
    () => simulation?.conversations ?? [],
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [conversation.length, isSubmitting, insight])

  useEffect(() => {
    setConversation(simulation?.conversations ?? [])
  }, [simulationId, simulation?.conversations])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const currentQuestion = question.trim()

    if (!currentQuestion || isSubmitting) {
      return
    }

    if (!simulation) {
      setSubmitError('Simulação não encontrada.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await getCoachReply(
        buildCoachPrompt(
          simulation,
          currentQuestion,
          formatConversationHistory(conversation),
        ),
      )

      const entry: SimulationConversation = {
        id: crypto.randomUUID(),
        question: currentQuestion,
        answer: response,
        createdAt: new Date().toISOString(),
      }

      setConversation((currentConversation) => [...currentConversation, entry])
      addConversation(simulationId, entry)
      setQuestion('')
      inputRef.current?.focus()
    } catch {
      setSubmitError('Não consegui responder agora. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}

      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => fetchInsight(simulationId)}
        />
      )}

      {!isLoading && !error && insight && (
        <div className="flex flex-col gap-6">
          <Content insight={insight} />

          <section className="border-border/60 bg-background/40 rounded-2xl border p-4">
            <div className="mb-3">
              <h3 className="text-foreground text-sm font-semibold">
                Conversando com o educador financeiro
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Faça quantas perguntas quiser sobre essa simulação.
              </p>
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  ref={inputRef}
                  aria-label="Perguntar ao educador financeiro"
                  placeholder="Ex: Como posso economizar mais este mês?"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                />
                <Button
                  type="submit"
                  variant="primary"
                  icon={Send}
                  disabled={!question.trim() || isSubmitting}
                  className="sm:w-auto"
                >
                  {isSubmitting ? 'Enviando...' : 'Perguntar'}
                </Button>
              </div>

              {submitError && (
                <p className="text-sm text-red-500">⚠️ {submitError}</p>
              )}
            </form>

            <div className="mt-4 flex max-h-[28rem] flex-col gap-3 overflow-y-auto pr-1">
              {!conversation.length && !isSubmitting && (
                <p className="text-muted-foreground text-sm">
                  Ainda não há perguntas registradas para esta simulação.
                </p>
              )}

              {conversation.map((entry) => (
                <article
                  key={entry.id}
                  className="bg-card rounded-2xl border border-border/60 p-4 shadow-sm"
                >
                  <div className="mb-3">
                    <p className="text-muted-foreground text-xs font-semibold uppercase">
                      Você
                    </p>
                    <p className="text-foreground mt-1 text-sm leading-relaxed">
                      {entry.question}
                    </p>
                  </div>

                  <div>
                    <p className="text-primary text-xs font-semibold uppercase">
                      Educador financeiro
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {entry.answer}
                    </p>
                  </div>
                </article>
              ))}

              {isSubmitting && (
                <div className="bg-background/60 text-muted-foreground rounded-2xl border border-dashed border-border/70 p-4 text-sm">
                  Pensando na melhor resposta...
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </section>
        </div>
      )}
    </div>
  )
}