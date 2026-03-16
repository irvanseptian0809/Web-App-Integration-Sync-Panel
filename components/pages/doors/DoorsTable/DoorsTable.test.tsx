import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { DoorsTable } from "./DoorsTable"
import { Door } from "@/interface/types"

const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

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
  {
    id: "d2",
    name: "Back Door",
    location: "Kitchen",
    device_id: "HW-2",
    status: "offline",
    battery_level: 15,
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
    
    expect(screen.getByText("Back Door")).toBeInTheDocument()
    expect(screen.getByText("Kitchen")).toBeInTheDocument()
    expect(screen.getByText("HW-2")).toBeInTheDocument()
    expect(screen.getByText("15%")).toBeInTheDocument()
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

  it("calls onToggleRow when row checkbox is clicked", () => {
    const onToggleRow = jest.fn()
    render(
      <DoorsTable 
        doors={mockDoors} 
        onEdit={jest.fn()} 
        onDelete={jest.fn()} 
        onToggleRow={onToggleRow}
      />
    )
    // Row 1 checkbox is index 0
    const checkbox = screen.getAllByRole("checkbox")[0]
    fireEvent.click(checkbox)
    expect(onToggleRow).toHaveBeenCalledWith(mockDoors[0].id)
  })

  it("calls onToggleAll when header checkbox is clicked", () => {
    const onToggleAll = jest.fn()
    render(
      <DoorsTable 
        doors={mockDoors} 
        onEdit={jest.fn()} 
        onDelete={jest.fn()} 
        onToggleAll={onToggleAll}
      />
    )
    // 1 header checkbox + 2 row checkboxes = 3
    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes.length).toBe(3)
    const headerCheckbox = checkboxes[0]
    fireEvent.click(headerCheckbox)
    expect(onToggleAll).toHaveBeenCalled()
  })

  it("toggles row selection on row click if onToggleRow is provided", () => {
    const onToggleRow = jest.fn()
    render(
      <DoorsTable 
        doors={mockDoors} 
        onEdit={jest.fn()} 
        onDelete={jest.fn()} 
        onToggleRow={onToggleRow}
      />
    )
    const row = screen.getByText("Front Door")
    fireEvent.click(row)
    expect(onToggleRow).toHaveBeenCalledWith(mockDoors[0].id)
  })

  it("navigates to detail page on row click if onToggleRow is NOT provided", () => {
    render(
      <DoorsTable 
        doors={mockDoors} 
        onEdit={jest.fn()} 
        onDelete={jest.fn()} 
      />
    )
    const row = screen.getByText("Front Door")
    fireEvent.click(row)
    expect(mockPush).toHaveBeenCalledWith("/doors/d1")
  })
})
