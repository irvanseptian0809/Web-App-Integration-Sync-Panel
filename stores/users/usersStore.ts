import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "@/interface/types"

interface UserState {
  users: User[]
  addUser: (user: User) => void
  updateUser: (user: User) => void
  removeUser: (userId: string) => void
  removeUsersByProvider: (provider: string) => void
  setUsers: (users: User[]) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [
        {
          id: "u1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          role: "Admin",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "u2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+0987654321",
          role: "User",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
      updateUser: (updatedUser) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        })),
      removeUser: (userId) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        })),
      removeUsersByProvider: (provider) =>
        set((state) => ({
          users: state.users.filter((u) => u.provider !== provider),
        })),
      setUsers: (users) => set({ users }),
    }),
    { name: "user-storage" },
  ),
)
