import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ConflictResolutionModal } from "./ConflictResolutionModal"
import { SyncChange } from "@/interface/types"

const mockChange: SyncChange = {
  id: "chg_1",
  field_name: "email",
  change_type: "UPDATE",
  current_value: "old@example.com",
  new_value: "new@example.com",
}

describe("ConflictResolutionModal", () => {
  const onClose = jest.fn()
  const onResolve = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  it("renders null when change is null", () => {
    const { container } = render(
      <ConflictResolutionModal
        isOpen
        onClose={onClose}
        change={null}
        onResolve={onResolve}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it("renders modal title when open with a change", () => {
    render(
      <ConflictResolutionModal
        isOpen
        onClose={onClose}
        change={mockChange}
        onResolve={onResolve}
      />,
    )
    expect(screen.getByRole("heading", { name: /resolve conflict/i })).toBeInTheDocument()
  })

  it("shows field name in description", () => {
    render(
      <ConflictResolutionModal
        isOpen
        onClose={onClose}
        change={mockChange}
        onResolve={onResolve}
      />,
    )
    expect(screen.getByText(/email/)).toBeInTheDocument()
  })

  it("shows current_value (local option)", () => {
    render(
      <ConflictResolutionModal
        isOpen
        onClose={onClose}
        change={mockChange}
        onResolve={onResolve}
      />,
    )
    expect(screen.getByText("old@example.com")).toBeInTheDocument()
  })

  it("shows new_value (remote option)", () => {
    render(
      <ConflictResolutionModal
        isOpen
        onClose={onClose}
        change={mockChange}
        onResolve={onResolve}
      />,
    )
    expect(screen.getByText("new@example.com")).toBeInTheDocument()
  })

  it("calls onResolve with 'local' when Keep Local is clicked", () => {
    render(
      <ConflictResolutionModal
        isOpen
        onClose={onClose}
        change={mockChange}
        onResolve={onResolve}
      />,
    )
    fireEvent.click(screen.getByText("Keep Local").closest("button")!)
    expect(onResolve).toHaveBeenCalledWith("email", "local")
    expect(onClose).toHaveBeenCalled()
  })

  it("calls onResolve with 'remote' when Accept Incoming is clicked", () => {
    render(
      <ConflictResolutionModal
        isOpen
        onClose={onClose}
        change={mockChange}
        onResolve={onResolve}
      />,
    )
    fireEvent.click(screen.getByText("Accept Incoming").closest("button")!)
    expect(onResolve).toHaveBeenCalledWith("email", "remote")
    expect(onClose).toHaveBeenCalled()
  })

  it("shows check icon for current resolution 'local'", () => {
    render(
      <ConflictResolutionModal
        isOpen
        onClose={onClose}
        change={mockChange}
        onResolve={onResolve}
        currentResolution="local"
      />,
    )
    // The check icon SVG should render in the local option
    const localBtn = screen.getByText("Keep Local").closest("button")!
    expect(localBtn).toHaveClass("border-blue-500")
  })

  it("shows check icon for current resolution 'remote'", () => {
    render(
      <ConflictResolutionModal
        isOpen
        onClose={onClose}
        change={mockChange}
        onResolve={onResolve}
        currentResolution="remote"
      />,
    )
    const remoteBtn = screen.getByText("Accept Incoming").closest("button")!
    expect(remoteBtn).toHaveClass("border-blue-500")
  })
})
