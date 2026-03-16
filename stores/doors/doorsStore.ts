import { create } from "zustand"
import { persist } from "zustand/middleware"
import { DoorState } from "./interface"

export const useDoorStore = create<DoorState>()(
  persist(
    (set) => ({
      doors: [],
      addDoor: (door) => set((state) => ({ doors: [door, ...state.doors] })),
      updateDoor: (updatedDoor) =>
        set((state) => ({
          doors: state.doors.map((d) => (d.id === updatedDoor.id ? updatedDoor : d)),
        })),
      removeDoor: (doorId) =>
        set((state) => ({
          doors: state.doors.filter((d) => d.id !== doorId),
        })),
      removeDoorsByProvider: (provider) =>
        set((state) => ({
          doors: state.doors.filter((d) => d.provider !== provider),
        })),
      setDoors: (doors) => set({ doors }),
    }),
    { name: "door-storage" },
  ),
)
