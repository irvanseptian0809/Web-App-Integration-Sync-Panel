import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { DoorForm } from "./DoorForm"

describe("DoorForm", () => {
  it("renders all form fields", () => {
    render(<DoorForm onSubmit={jest.fn()} onCancel={jest.fn()} />)
    expect(screen.getByLabelText(/Door Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Device ID/i)).toBeInTheDocument()
  })

  it("calls onSubmit with door data", () => {
    const onSubmit = jest.fn()
    render(<DoorForm onSubmit={onSubmit} onCancel={jest.fn()} />)
    
    fireEvent.change(screen.getByLabelText(/Door Name/i), { target: { value: "Side Door" } })
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: "Parking" } })
    fireEvent.change(screen.getByLabelText(/Device ID/i), { target: { value: "HW-2" } })
    
    fireEvent.click(screen.getByText(/Create Door/i))
    
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: "Side Door",
      location: "Parking",
      device_id: "HW-2"
    }))
  })
})
