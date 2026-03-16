import "@testing-library/jest-dom"
import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { SyncPreviewPanel } from "./SyncPreviewPanel"
import { SyncChange } from "@/interface/types"

const mockChanges: SyncChange[] = [
  {
    id: "chg_1",
    field_name: "user.email",
    change_type: "UPDATE",
    current_value: "old@example.com",
    new_value: "new@example.com",
  },
  {
    id: "chg_2",
    field_name: "user.name",
    change_type: "CREATE",
    current_value: null,
    new_value: "New User",
  },
  {
    id: "chg_3",
    field_name: "user.role",
    change_type: "DELETE",
    current_value: "Admin",
    new_value: null,
  },
]

describe("SyncPreviewPanel", () => {
  const getLocalValue = (c: SyncChange) => (c.change_type === "CREATE" || (c.change_type as any) === "ADD") ? "None" : c.current_value

  it("renders 'No changes to preview' when empty", () => {
    render(<SyncPreviewPanel changes={[]} resolutions={{}} getLocalValue={getLocalValue} />)
    expect(screen.getByText("No changes to preview.")).toBeInTheDocument()
  })

  it("renders all fields and badges", () => {
    render(<SyncPreviewPanel changes={mockChanges} resolutions={{}} getLocalValue={getLocalValue} />)
    expect(screen.getByText("user.email")).toBeInTheDocument()
    expect(screen.getByText("user.name")).toBeInTheDocument()
    expect(screen.getByText("user.role")).toBeInTheDocument()
    
    expect(screen.getByText("UPDATE")).toBeInTheDocument()
    expect(screen.getByText("CREATE")).toBeInTheDocument()
    expect(screen.getByText("DELETE")).toBeInTheDocument()
  })

  it("shows specialized labels for CREATE and DELETE", () => {
    render(<SyncPreviewPanel changes={mockChanges} resolutions={{}} getLocalValue={getLocalValue} />)
    
    // For CREATE
    expect(screen.getByText("None (New Entity)")).toBeInTheDocument()
    
    // For DELETE
    expect(screen.getByText("Accept Removal")).toBeInTheDocument()
    expect(screen.getByText("REMOVED")).toBeInTheDocument()
  })

  it("calls onResolveConflict when an option is clicked", () => {
    const onResolve = jest.fn()
    render(
      <SyncPreviewPanel
        changes={mockChanges}
        resolutions={{}}
        onResolveConflict={onResolve}
        getLocalValue={getLocalValue}
      />,
    )
    
    // Click 'Keep Local' for email
    const localButtons = screen.getAllByText(/Keep Local/)
    fireEvent.click(localButtons[0])
    expect(onResolve).toHaveBeenCalledWith(mockChanges[0], "local")
    
    // Click 'Accept Incoming' for email
    const incomingButtons = screen.getAllByText(/Accept Incoming/)
    fireEvent.click(incomingButtons[0])
    expect(onResolve).toHaveBeenCalledWith(mockChanges[0], "chg_1")
  })

  it("shows Resolved badge and Check icon when resolved", () => {
    render(
      <SyncPreviewPanel
        changes={mockChanges}
        resolutions={{ chg_1: "chg_1" }}
        getLocalValue={getLocalValue}
      />,
    )
    expect(screen.getByText("Resolved")).toBeInTheDocument()
  })

  it("shows validation error message when showValidationErrors is true and unresolved", () => {
    render(
      <SyncPreviewPanel
        changes={mockChanges}
        resolutions={{}}
        showValidationErrors={true}
        getLocalValue={getLocalValue}
      />,
    )
    expect(screen.getAllByText("Please select a resolution").length).toBe(3)
  })
})
