import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Key } from "@/interface/types"

interface KeyState {
  keys: Key[]
  addKey: (key: Key) => void
  updateKey: (key: Key) => void
  removeKey: (keyId: string) => void
  setKeys: (keys: Key[]) => void
}

export const useKeyStore = create<KeyState>()(
  persist(
    (set) => ({
      keys: [
        {
          id: "k1",
          user_id: "u1",
          door_id: "d1",
          key_type: "Physical",
          access_start: new Date().toISOString(),
          access_end: new Date(Date.now() + 86400000 * 365).toISOString(),
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "k2",
          user_id: "u2",
          door_id: "d2",
          key_type: "Digital",
          access_start: new Date().toISOString(),
          access_end: new Date(Date.now() + 86400000 * 30).toISOString(),
          status: "active",
          created_at: new Date().toISOString(),
        },
      ],
      addKey: (key) => set((state) => ({ keys: [key, ...state.keys] })),
      updateKey: (updatedKey) =>
        set((state) => ({
          keys: state.keys.map((k) => (k.id === updatedKey.id ? updatedKey : k)),
        })),
      removeKey: (keyId) =>
        set((state) => ({
          keys: state.keys.filter((k) => k.id !== keyId),
        })),
      setKeys: (keys) => set({ keys }),
    }),
    { name: "key-storage" },
  ),
)
