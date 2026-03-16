import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { DoorsTable } from "./DoorsTable"
import { Door } from "@/interface/types"

const mockDoors: Door[] = [
  {
    id: "d1",
    name: "Front Door",
    location: "Main Lobby",
    device_id: "HW-1",
    status: "online",
    battery_level: 90,
    last_seen: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
]

describe("DoorsTable", () => {
  it("renders door information correctly", () => {
    render(<DoorsTable doors={mockDoors} onEdit={jest.fn()} onDelete={jest.fn()} />)
    expect(screen.getByText("Front Door")).toBeInTheDocument()
    expect(screen.getByText("Main Lobby")).toBeInTheDocument()
    expect(screen.getByText("HW-1")).toBeInTheDocument()
    expect(screen.getByText("90%")).toBeInTheDocument()
  })

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = jest.fn()
    render(<DoorsTable doors={mockDoors} onEdit={onEdit} onDelete={jest.fn()} />)
    const editButton = screen.getAllByRole("button")[0]
    fireEvent.click(editButton)
    expect(onEdit).toHaveBeenCalledWith(mockDoors[0])
  })

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = jest.fn()
    render(<DoorsTable doors={mockDoors} onEdit={jest.fn()} onDelete={onDelete} />)
    const deleteButton = screen.getAllByRole("button")[1]
    fireEvent.click(deleteButton)
    expect(onDelete).toHaveBeenCalledWith(mockDoors[0].id)
  })

  it("shows empty state", () => {
    render(<DoorsTable doors={[]} onEdit={jest.fn()} onDelete={jest.fn()} />)
    expect(screen.getByText("No doors found.")).toBeInTheDocument()
  })
})
