import { simulationFormSteps } from '@/data/simulations'
import { FormStep } from './FormStep'
import { useState } from 'react'
import { StepProgress } from './Progress'

export const SimulationForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const totalSteps = simulationFormSteps.length
  const currentStep = simulationFormSteps[currentStepIndex]

  const handleNextStep = () => {
    if (currentStepIndex + 1 > totalSteps - 1) {
      return
    }

    setCurrentStepIndex((prev) => prev + 1)
  }

  const handlePreviousStep = () => {
    if (currentStepIndex === 0) {
      return
    }

    setCurrentStepIndex((prev) => prev - 1)
  }

  return (
    <>
      <StepProgress
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
      />
      <FormStep
        {...currentStep}
        key={currentStep.id}
        hideBackButton={currentStepIndex === 0}
        onBack={handlePreviousStep}
        onNext={handleNextStep}
      />
    </>
  )
}