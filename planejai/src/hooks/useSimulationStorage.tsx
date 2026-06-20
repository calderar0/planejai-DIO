import { useCallback, useEffect, useState } from 'react'

import { type SimulationFormData, type SimulationRecord } from '@/data/simulations'

const LOCAL_STORAGE_KEY = 'simulation-data'
const STORAGE_EVENT_NAME = 'simulation-storage-changed'

export const useSimulationStorage = () => {
  const [simulations, setSimulations] = useState<SimulationRecord[]>(() => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)

    return storage ? (JSON.parse(storage) as SimulationRecord[]) : []
  })

  const getSavedSimulations = useCallback(() => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY)

    return storage ? (JSON.parse(storage) as SimulationRecord[]) : []
  }, [])

  const setSavedSimulations = useCallback((records: SimulationRecord[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records))
    setSimulations(records)
    window.dispatchEvent(new Event(STORAGE_EVENT_NAME))
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      setSimulations(getSavedSimulations())
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(STORAGE_EVENT_NAME, handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(STORAGE_EVENT_NAME, handleStorageChange)
    }
  }, [getSavedSimulations])

  const saveFormData = useCallback(
    (formData: SimulationFormData) => {
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
    },
    [getSavedSimulations, setSavedSimulations],
  )

  const getAllSimulations = useCallback(() => simulations, [simulations])

  const getFormData = useCallback(
    (id: string) => simulations.find((record) => record.id === id) || null,
    [simulations],
  )

  const updateSimulation = useCallback(
    (id: string, data: SimulationRecord) => {
      const updated = simulations.map((record) =>
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
    },
    [setSavedSimulations, simulations],
  )

  const deleteSimulation = useCallback(
    (id: string) => {
      setSavedSimulations(simulations.filter((record) => record.id !== id))
    },
    [setSavedSimulations, simulations],
  )

  const addConversation = useCallback(
    (
      id: string,
      conversation: NonNullable<SimulationRecord['conversations']>[number],
    ) => {
      const updated = simulations.map((record) =>
        record.id === id
          ? {
              ...record,
              conversations: [...(record.conversations ?? []), conversation],
              updatedAt: new Date().toISOString(),
            }
          : record,
      )

      setSavedSimulations(updated)
    },
    [setSavedSimulations, simulations],
  )

  return {
    addConversation,
    deleteSimulation,
    getAllSimulations,
    getFormData,
    saveFormData,
    simulations,
    updateSimulation,
  }
}