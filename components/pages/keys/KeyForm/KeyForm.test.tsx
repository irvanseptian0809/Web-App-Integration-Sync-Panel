import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { KeyForm } from "./KeyForm"
import { useUserStore } from "@/stores/users/usersStore"
import { useDoorStore } from "@/stores/doors/doorsStore"

describe("KeyForm", () => {
  beforeEach(() => {
    useUserStore.setState({
      users: [{ id: "u1", name: "User 1", email: "", phone: "", role: "", status: "active", created_at: "", updated_at: "" }]
    })
    useDoorStore.setState({
      doors: [{ id: "d1", name: "Door 1", location: "Loc 1", device_id: "", status: "online", battery_level: 100, last_seen: "", created_at: "" }]
    })
  })

  it("renders all form fields", () => {
    render(<KeyForm onSubmit={jest.fn()} onCancel={jest.fn()} />)
    expect(screen.getByLabelText(/Assign User/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Target Door/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Key Type/i)).toBeInTheDocument()
  })

  it("calls onSubmit with key data", () => {
    const onSubmit = jest.fn()
    render(<KeyForm onSubmit={onSubmit} onCancel={jest.fn()} />)

    // Selects are already populated with first item if available
    fireEvent.change(screen.getByLabelText(/Key Type/i), { target: { value: "Visitor" } })

    fireEvent.click(screen.getByText(/Issue Key/i))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      key_type: "Visitor",
      user_id: "u1",
      door_id: "d1"
    }))
  })
})
