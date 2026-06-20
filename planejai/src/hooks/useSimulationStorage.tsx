import { type SimulationFormData, type SimulationRecord } from '@/data/simulations'

const LOCAL_STORAGE_KEY = 'simulation-data'

export const useSimulationStorage = () => {
  const getSavedSimulations = () => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)

    return storage ? (JSON.parse(storage) as SimulationRecord[]) : []
  }

  const setSavedSimulations = (records: SimulationRecord[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records))
  }

  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const record: SimulationRecord = {
      ...formData,
      id,
      createdAt: now,
      updatedAt: now,
      conversations: [],
    }
    const savedData = getSavedSimulations()

    setSavedSimulations([...savedData, record])

    return id
  }

  const getAllSimulations = () => getSavedSimulations()

  const getFormData = (id: string) => {
    const savedData = getSavedSimulations()
    return savedData.find((record) => record.id === id) || null
  }

  const updateSimulation = (id: string, data: SimulationRecord) => {
    const savedData = getSavedSimulations()

    const updated = savedData.map((record) =>
      record.id === id
        ? {
            ...record,
            ...data,
            id,
            updatedAt: new Date().toISOString(),
          }
        : record,
    )

    setSavedSimulations(updated)
  }

  const deleteSimulation = (id: string) => {
    const savedData = getSavedSimulations()

    setSavedSimulations(savedData.filter((record) => record.id !== id))
  }

  const addConversation = (
    id: string,
    conversation: NonNullable<SimulationRecord['conversations']>[number],
  ) => {
    const savedData = getSavedSimulations()

    const updated = savedData.map((record) =>
      record.id === id
        ? {
            ...record,
            conversations: [...(record.conversations ?? []), conversation],
            updatedAt: new Date().toISOString(),
          }
        : record,
    )

    setSavedSimulations(updated)
  }

  return {
    addConversation,
    deleteSimulation,
    getAllSimulations,
    getFormData,
    saveFormData,
    updateSimulation,
  }
}