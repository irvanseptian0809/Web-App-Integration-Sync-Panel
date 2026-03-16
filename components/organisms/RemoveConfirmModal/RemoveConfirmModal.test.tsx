import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { RemoveConfirmModal } from "./RemoveConfirmModal"
import { Integration } from "@/interface/types"

// ── Mocks ───────────────────────────────────────────────────────────────────
const mockRemoveIntegration = jest.fn()

jest.mock("@/stores/integrations/integrationsStore", () => ({
  useIntegrationStore: (selector: any) =>
    selector({ removeIntegration: mockRemoveIntegration }),
}))

const mockIntegration: Integration = {
  id: "1",
  name: "Salesforce CRM",
  provider: "salesforce",
  status: "synced",
  lastSyncTime: "2026-03-15T10:00:00Z",
  version: 1,
  logo: "https://example.com/logo.png",
}

describe("RemoveConfirmModal", () => {
  const onClose = jest.fn()
  const onSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders confirmation message when open", () => {
    render(
      <RemoveConfirmModal
        isOpen
        onClose={onClose}
        integration={mockIntegration}
      />,
    )
    expect(screen.getByRole("heading", { name: /remove integration/i })).toBeInTheDocument()
  })

  it("disables remove button initially", () => {
    render(
      <RemoveConfirmModal
        isOpen
        onClose={onClose}
        integration={mockIntegration}
      />,
    )
    const btn = screen.getByRole("button", { name: /yes, remove integration/i })
    expect(btn).toBeDisabled()
  })

  it("enables remove button when provider name is typed correctly", () => {
    render(
      <RemoveConfirmModal
        isOpen
        onClose={onClose}
        integration={mockIntegration}
      />,
    )
    const input = screen.getByPlaceholderText("salesforce")
    fireEvent.change(input, { target: { value: "salesforce" } })

    const btn = screen.getByRole("button", { name: /yes, remove integration/i })
    expect(btn).not.toBeDisabled()
  })

  it("calls removeIntegration and onSuccess after delay when confirmed", async () => {
    render(
      <RemoveConfirmModal
        isOpen
        onClose={onClose}
        integration={mockIntegration}
        onSuccess={onSuccess}
      />,
    )

    const input = screen.getByPlaceholderText("salesforce")
    fireEvent.change(input, { target: { value: "salesforce" } })

    const btn = screen.getByRole("button", { name: /yes, remove integration/i })
    fireEvent.click(btn)

    // Use getAllByText if it appears multiple times, or use a more specific selector
    expect(screen.getAllByText(/removing/i).length).toBeGreaterThan(0)

    act(() => {
      jest.advanceTimersByTime(600)
    })

    expect(mockRemoveIntegration).toHaveBeenCalledWith("1")
    expect(onSuccess).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it("shows error message when incorrect provider name is typed", () => {
    render(
      <RemoveConfirmModal
        isOpen
        onClose={onClose}
        integration={mockIntegration}
      />,
    )
    const input = screen.getByPlaceholderText("salesforce")
    fireEvent.change(input, { target: { value: "wrong" } })

    expect(screen.getByText(/does not match/i)).toBeInTheDocument()
  })

  it("closes and resets when cancel is clicked", () => {
    render(
      <RemoveConfirmModal
        isOpen
        onClose={onClose}
        integration={mockIntegration}
      />,
    )
    fireEvent.click(screen.getByText("Cancel"))
    expect(onClose).toHaveBeenCalled()
  })
})
