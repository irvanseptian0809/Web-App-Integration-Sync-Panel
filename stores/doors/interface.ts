import { Door } from "@/interface/types"

export interface DoorState {
  doors: Door[]
  addDoor: (door: Door) => void
  updateDoor: (door: Door) => void
  removeDoor: (doorId: string) => void
  removeDoorsByProvider: (provider: string) => void
  setDoors: (doors: Door[]) => void
}