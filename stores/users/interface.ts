import { User } from "@/interface/types"

export interface UserState {
  users: User[]
  addUser: (user: User) => void
  updateUser: (user: User) => void
  removeUser: (userId: string) => void
  removeUsersByProvider: (provider: string) => void
  setUsers: (users: User[]) => void
}