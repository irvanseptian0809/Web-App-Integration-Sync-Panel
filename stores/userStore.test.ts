import { useUserStore } from "./userStore"
import { User } from "@/interface/types"

describe("userStore", () => {
  const initialUsers = [
    {
      id: "u1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      role: "Admin",
      status: "active",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
    {
      id: "u2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+0987654321",
      role: "User",
      status: "active",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    },
  ]

  beforeEach(() => {
    useUserStore.setState({
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
    })
  })

  it("should add a user", () => {
    const newUser: User = {
      id: "u3",
      name: "Bob",
      email: "bob@example.com",
      phone: "",
      role: "Viewer",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    useUserStore.getState().addUser(newUser)
    expect(useUserStore.getState().users).toContainEqual(newUser)
    expect(useUserStore.getState().users[0]).toBe(newUser)
  })

  it("should update a user", () => {
    const updatedUser = { ...useUserStore.getState().users[0], name: "John Updated" }
    useUserStore.getState().updateUser(updatedUser)
    expect(useUserStore.getState().users[0].name).toBe("John Updated")
  })

  it("should remove a user", () => {
    const userId = "u1"
    useUserStore.getState().removeUser(userId)
    expect(useUserStore.getState().users.find((u) => u.id === userId)).toBeUndefined()
  })

  it("should set all users", () => {
    const newUsers: User[] = []
    useUserStore.getState().setUsers(newUsers)
    expect(useUserStore.getState().users).toHaveLength(0)
  })
})
