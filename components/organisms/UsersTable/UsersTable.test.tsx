import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { UsersTable } from "./UsersTable"
import { User } from "@/interface/types"

const mockUsers: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123",
    role: "Admin",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

describe("UsersTable", () => {
  it("renders user information correctly", () => {
    render(<UsersTable users={mockUsers} onEdit={jest.fn()} onDelete={jest.fn()} />)
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("john@example.com")).toBeInTheDocument()
    expect(screen.getByText("Admin")).toBeInTheDocument()
  })

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = jest.fn()
    render(<UsersTable users={mockUsers} onEdit={onEdit} onDelete={jest.fn()} />)
    
    const editButton = screen.getAllByRole("button")[0]
    fireEvent.click(editButton)
    expect(onEdit).toHaveBeenCalledWith(mockUsers[0])
  })

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = jest.fn()
    render(<UsersTable users={mockUsers} onEdit={jest.fn()} onDelete={onDelete} />)
    
    const deleteButton = screen.getAllByRole("button")[1]
    fireEvent.click(deleteButton)
    expect(onDelete).toHaveBeenCalledWith(mockUsers[0].id)
  })

  it("shows empty state when no users are provided", () => {
    render(<UsersTable users={[]} onEdit={jest.fn()} onDelete={jest.fn()} />)
    expect(screen.getByText("No users found.")).toBeInTheDocument()
  })
})
