import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { KeysTable } from "./KeysTable"
import { Key } from "@/interface/types"
import { useUserStore } from "@/stores/users/usersStore"
import { useDoorStore } from "@/stores/doors/doorsStore"

const mockKeys: Key[] = [
  {
    id: "k1",
    user_id: "u1",
    door_id: "d1",
    key_type: "Digital",
    status: "active",
    access_start: new Date().toISOString(),
    access_end: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
]

describe("KeysTable", () => {
  beforeEach(() => {
    useUserStore.setState({
      users: [{ id: "u1", name: "John Doe", email: "", phone: "", role: "", status: "active", created_at: "", updated_at: "" }]
    })
    useDoorStore.setState({
      doors: [{ id: "d1", name: "Main Door", location: "", device_id: "", status: "online", battery_level: 100, last_seen: "", created_at: "" }]
    })
  })

  it("renders key information correctly", () => {
    render(<KeysTable keysList={mockKeys} onEdit={jest.fn()} onDelete={jest.fn()} />)
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Main Door")).toBeInTheDocument()
    expect(screen.getByText("Digital")).toBeInTheDocument()
  })

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = jest.fn()
    render(<KeysTable keysList={mockKeys} onEdit={jest.fn()} onDelete={onDelete} />)
    const deleteButton = screen.getAllByRole("button")[1]
    fireEvent.click(deleteButton)
    expect(onDelete).toHaveBeenCalledWith(mockKeys[0].id)
  })
})
