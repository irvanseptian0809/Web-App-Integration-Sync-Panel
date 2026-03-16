import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Door } from "@/interface/types"

interface DoorState {
  doors: Door[]
  addDoor: (door: Door) => void
  updateDoor: (door: Door) => void
  removeDoor: (doorId: string) => void
  setDoors: (doors: Door[]) => void
}

export const useDoorStore = create<DoorState>()(
  persist(
    (set) => ({
      doors: [
        {
          id: "d1",
          name: "Main Entrance",
          location: "Ground Floor",
          device_id: "dev_001",
          status: "online",
          battery_level: 85,
          last_seen: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: "d2",
          name: "Server Room",
          location: "Basement",
          device_id: "dev_002",
          status: "offline",
          battery_level: 42,
          last_seen: new Date(Date.now() - 3600000).toISOString(),
          created_at: new Date().toISOString(),
        },
      ],
      addDoor: (door) => set((state) => ({ doors: [door, ...state.doors] })),
      updateDoor: (updatedDoor) =>
        set((state) => ({
          doors: state.doors.map((d) => (d.id === updatedDoor.id ? updatedDoor : d)),
        })),
      removeDoor: (doorId) =>
        set((state) => ({
          doors: state.doors.filter((d) => d.id !== doorId),
        })),
      setDoors: (doors) => set({ doors }),
    }),
    { name: "door-storage" },
  ),
)
