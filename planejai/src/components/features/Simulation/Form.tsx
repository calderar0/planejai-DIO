import { FormStep } from './FormStep'
import { StepProgress } from './Progress'
import { Divider } from '@/components/shared/Divider'
import {PiggyBank} from 'lucide-react'

export const SimulationForm = () => {
  return (
    <>
        <StepProgress currentStep={1} totalSteps={6} />
        <Divider className="my-6" />
        <FormStep
          icon={PiggyBank}
          title="Dados do Investimento"
          question="Qual é o valor do investimento inicial?"
          inputProps={{
            type: 'text',
            placeholder: 'ex: 10.000,00',
            prefix: 'R$',
          }}
        />
        {/* Formulário de dados do investimento */}
    </>
  )
}