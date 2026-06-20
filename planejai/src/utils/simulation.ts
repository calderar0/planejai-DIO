import type { SimulationFormData } from '../data/simulations'
import { parseCurrency } from './currency'

export function calcMonthlySavings(data: SimulationFormData) {
  return (
    parseCurrency(data.income) -
    parseCurrency(data.expenses) -
    parseCurrency(data.debts)
  )
}