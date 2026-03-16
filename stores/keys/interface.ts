import { Key } from "@/interface/types"

export interface KeyState {
  keys: Key[]
  addKey: (key: Key) => void
  updateKey: (key: Key) => void
  removeKey: (keyId: string) => void
  removeKeysByProvider: (provider: string) => void
  setKeys: (keys: Key[]) => void
}