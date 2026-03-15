import "@testing-library/jest-dom"
import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { SyncPreviewPanel } from "./SyncPreviewPanel"
import { SyncChange } from "@/interface/types"

const mockChanges: SyncChange[] = [
  {
    id: "chg_1",
    field_name: "email",
    change_type: "UPDATE",
    current_value: "old@example.com",
    new_value: "new@example.com",
  },
  {
    id: "chg_2",
    field_name: "name",
    change_type: "UPDATE",
    current_value: "Old Name",
    new_value: "New Name",
  },
]

describe("SyncPreviewPanel", () => {
  it("renders 'No changes to preview' when empty", () => {
    render(<SyncPreviewPanel changes={[]} resolutions={{}} />)
    expect(screen.getByText("No changes to preview.")).toBeInTheDocument()
  })

  it("renders all grouped fields", () => {
    render(<SyncPreviewPanel changes={mockChanges} resolutions={{}} />)
    expect(screen.getByText("email")).toBeInTheDocument()
    expect(screen.getByText("name")).toBeInTheDocument()
  })

  it("calls onResolveConflict when an option is clicked", () => {
    const onResolve = jest.fn()
    render(
      <SyncPreviewPanel
        changes={mockChanges}
        resolutions={{}}
        onResolveConflict={onResolve}
      />,
    )
    
    // Click 'Keep Local' for email
    const localButtons = screen.getAllByText("Keep Local")
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
        resolutions={{ email: "chg_1" }}
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
      />,
    )
    expect(screen.getAllByText("Please select a resolution").length).toBe(2)
  })
})
