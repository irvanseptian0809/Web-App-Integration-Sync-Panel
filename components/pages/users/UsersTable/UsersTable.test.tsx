import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { UsersTable } from "./UsersTable"
import { User } from "@/interface/types"

const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({}),
}))

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
  it("navigates to user detail page on row click", () => {
    render(<UsersTable users={mockUsers} onEdit={jest.fn()} onDelete={jest.fn()} />)
    
    // The clickable row is the <tr> itself (excluding buttons)
    // Finding the cell with user name and clicking it
    const nameCell = screen.getByText("John Doe")
    fireEvent.click(nameCell)
    
    expect(mockPush).toHaveBeenCalledWith("/users/u1")
  })

  it("handles missing user fields gracefully", () => {
    const emptyUser: User = {
      id: "u2",
      created_at: "", // Empty or invalid date
      updated_at: ""
    }
    render(<UsersTable users={[emptyUser]} onEdit={jest.fn()} onDelete={jest.fn()} />)
    expect(screen.getByText("Unnamed User")).toBeInTheDocument()
    // Using getAllByText since multiple fields use "—" as fallback
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("Local")).toBeInTheDocument() // For provider
  })

  it("calls onToggleRow when row checkbox is clicked", () => {
    const onToggleRow = jest.fn()
    render(
      <UsersTable 
        users={mockUsers} 
        onEdit={jest.fn()} 
        onDelete={jest.fn()} 
        onToggleRow={onToggleRow}
      />
    )
    const checkbox = screen.getAllByRole("checkbox")[0]
    fireEvent.click(checkbox)
    expect(onToggleRow).toHaveBeenCalledWith(mockUsers[0].id)
  })

  it("calls onToggleAll when header checkbox is clicked", () => {
    const onToggleAll = jest.fn()
    render(
      <UsersTable 
        users={mockUsers} 
        onEdit={jest.fn()} 
        onDelete={jest.fn()} 
        onToggleAll={onToggleAll}
      />
    )
    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes.length).toBe(2)
    const headerCheckbox = checkboxes[0]
    fireEvent.click(headerCheckbox)
    expect(onToggleAll).toHaveBeenCalled()
  })

  it("toggles row selection on row click if onToggleRow is provided", () => {
    const onToggleRow = jest.fn()
    render(
      <UsersTable 
        users={mockUsers} 
        onEdit={jest.fn()} 
        onDelete={jest.fn()} 
        onToggleRow={onToggleRow}
      />
    )
    const row = screen.getByText("John Doe")
    fireEvent.click(row)
    expect(onToggleRow).toHaveBeenCalledWith(mockUsers[0].id)
  })
})
