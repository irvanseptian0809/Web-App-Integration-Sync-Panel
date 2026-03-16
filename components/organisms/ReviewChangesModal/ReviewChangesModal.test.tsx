import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ReviewChangesModal } from "./ReviewChangesModal"
import { Integration, SyncChange } from "@/interface/types"
import { useIntegrationStore } from "@/stores/integrations/integrationsStore"

// ── Mocks ───────────────────────────────────────────────────────────────────
jest.mock("@/stores/integrations/integrationsStore", () => ({
  useIntegrationStore: jest.fn(),
}))

const mockSetResolution = jest.fn()
const mockClearResolutions = jest.fn()
const mockBumpIntegrationVersion = jest.fn()
const mockSetIntegrationStatus = jest.fn()
const mockRecordResolution = jest.fn()

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
    current_value: "John",
    new_value: "John Doe",
  },
]

const defaultStore = {
  pendingChanges: { "1": mockChanges },
  resolutions: { "1": {} },
  integrations: [{ id: "1", version: 1, name: "Salesforce", provider: "salesforce" }],
  setResolution: mockSetResolution,
  clearResolutions: mockClearResolutions,
  bumpIntegrationVersion: mockBumpIntegrationVersion,
  setIntegrationStatus: mockSetIntegrationStatus,
  recordResolution: mockRecordResolution,
}

const mockIntegration: Integration = {
  id: "1",
  name: "Salesforce",
  provider: "salesforce",
  status: "conflict",
  lastSyncTime: "2026-03-15T10:00:00Z",
  version: 1,
  logo: "https://example.com/logo.png",
}

describe("ReviewChangesModal", () => {
  beforeEach(() => {
    jest.clearAllMocks()
      ; (useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) => selector(defaultStore))
  })

  it("renders nothing when closed", () => {
    const { container } = render(<ReviewChangesModal isOpen={false} integration={mockIntegration} onClose={jest.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it("renders with title when open", () => {
    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    expect(screen.getByText(/Review Incoming Changes: Salesforce/)).toBeInTheDocument()
  })

  it("shows validation error when trying to confirm without resolution", () => {
    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)

    const confirmBtn = screen.getByRole("button", { name: /confirm & apply merge/i })
    fireEvent.click(confirmBtn)

    expect(screen.getAllByText("Please select a resolution").length).toBeGreaterThan(0)
    expect(mockRecordResolution).not.toHaveBeenCalled()
  })

  it("successfully completes merge when all fields are resolved", () => {
    // Override store mock to simulate all resolved
    ; (useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultStore,
        resolutions: { "1": { email: "chg_1", name: "chg_2" } },
        integrations: [{ id: "1", version: 5, name: "Salesforce", provider: "salesforce" }],
      })
    )

    const onClose = jest.fn()
    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={onClose} />)

    const confirmBtn = screen.getByRole("button", { name: /confirm & apply merge/i })
    fireEvent.click(confirmBtn)

    expect(mockRecordResolution).toHaveBeenCalled()
    expect(mockClearResolutions).toHaveBeenCalledWith("1")
    expect(mockBumpIntegrationVersion).toHaveBeenCalledWith("1")
    expect(mockSetIntegrationStatus).toHaveBeenCalledWith("1", "synced")
    expect(onClose).toHaveBeenCalled()
  })

  it("skips history recording if all choices are local", () => {
    ; (useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultStore,
        resolutions: { "1": { email: "local", name: "local" } },
      })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    const confirmBtn = screen.getByRole("button", { name: /confirm & apply merge/i })
    fireEvent.click(confirmBtn)

    expect(mockRecordResolution).not.toHaveBeenCalled()
    expect(mockSetIntegrationStatus).toHaveBeenCalledWith("1", "synced")
  })
})
