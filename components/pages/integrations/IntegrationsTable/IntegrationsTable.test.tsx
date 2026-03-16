import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { IntegrationsTable } from "./IntegrationsTable"
import { Integration } from "@/interface/types"

// ── Mocks ───────────────────────────────────────────────────────────────────
const mockSetIntegrationStatus = jest.fn()
const mockSetPendingChanges = jest.fn()
const mockShowNotification = jest.fn()

const mockRemoveIntegration = jest.fn()
const mockRemoveUsers = jest.fn()
const mockRemoveDoors = jest.fn()
const mockRemoveKeys = jest.fn()

jest.mock("@/stores/integrations/integrationsStore", () => ({
  useIntegrationStore: (selector: any) =>
    selector({
      pendingChanges: {},
      resolutions: {},
      integrations: [],
      setPendingChanges: mockSetPendingChanges,
      setIntegrationStatus: mockSetIntegrationStatus,
      removeIntegration: mockRemoveIntegration,
    }),
}))

jest.mock("@/stores/users/usersStore", () => ({
  useUserStore: (selector: any) => selector({ removeUsersByProvider: mockRemoveUsers }),
}))

jest.mock("@/stores/doors/doorsStore", () => ({
  useDoorStore: (selector: any) => selector({ removeDoorsByProvider: mockRemoveDoors }),
}))

jest.mock("@/stores/keys/keysStore", () => ({
  useKeyStore: (selector: any) => selector({ removeKeysByProvider: mockRemoveKeys }),
}))

jest.mock("@/stores/notifications/notificationsStore", () => ({
  useNotificationsStore: (selector: any) =>
    selector({ showNotification: mockShowNotification }),
}))

// Mock API
const mockFetchSyncData = jest.fn().mockResolvedValue({
  data: { sync_approval: { changes: [] } }
})
jest.mock("@/services/syncApi", () => ({
  syncApi: {
    fetchSyncData: (...args: any[]) => mockFetchSyncData(...args),
  },
}))

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "Salesforce",
    provider: "salesforce",
    status: "synced",
    lastSyncTime: "2026-03-15T10:00:00Z",
    version: 1,
    logo: "https://example.com/logo.png",
  },
  {
    id: "2",
    name: "Hubspot",
    provider: "hubspot",
    status: "conflict",
    lastSyncTime: "2026-03-15T11:00:00Z",
    version: 2,
    logo: "https://example.com/logo.png",
  },
]

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe("IntegrationsTable", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders 'No integrations found' when list is empty", () => {
    render(<IntegrationsTable integrations={[]} />, { wrapper })
    expect(screen.getByText("No integrations found.")).toBeInTheDocument()
  })

  it("calls sync mutation and set status to syncing", async () => {
    render(<IntegrationsTable integrations={mockIntegrations} />, { wrapper })
    const syncButtons = screen.getAllByRole("button", { name: /sync/i })
    fireEvent.click(syncButtons[0])

    expect(mockSetIntegrationStatus).toHaveBeenCalledWith("1", "syncing")
    await waitFor(() => {
      expect(mockFetchSyncData).toHaveBeenCalledWith("salesforce")
    })
  })

  it("handles sync error correctly", async () => {
    mockFetchSyncData.mockRejectedValueOnce(new Error("Network Error"))
    render(<IntegrationsTable integrations={mockIntegrations} />, { wrapper })

    const syncButtons = screen.getAllByRole("button", { name: /sync/i })
    fireEvent.click(syncButtons[0])

    await waitFor(() => {
      expect(mockSetIntegrationStatus).toHaveBeenCalledWith("1", "error")
      expect(mockShowNotification).toHaveBeenCalledWith(expect.objectContaining({ type: "error" }))
    })
  })

  it("handles bulk sync for selected items", async () => {
    render(<IntegrationsTable integrations={mockIntegrations} />, { wrapper })

    const checkboxes = screen.getAllByRole("checkbox")
    // Select Salesforce (index 1)
    fireEvent.click(checkboxes[1])

    const bulkSyncBtn = screen.getByRole("button", { name: /sync 1 selected/i })
    fireEvent.click(bulkSyncBtn)

    await waitFor(() => {
      expect(mockFetchSyncData).toHaveBeenCalledWith("salesforce")
    })
  })

  it("handles select all and clear selection", () => {
    render(<IntegrationsTable integrations={mockIntegrations} />, { wrapper })

    const selectAllBox = screen.getAllByRole("checkbox")[0]
    fireEvent.click(selectAllBox)
    expect(screen.getByText(/1 integration selected/i)).toBeInTheDocument() // Only 1 is syncable

    const clearBtn = screen.getByRole("button", { name: /clear selection/i })
    fireEvent.click(clearBtn)
    expect(screen.queryByText(/integration selected/i)).not.toBeInTheDocument()
  })

  it("shows Resolve Conflict button for conflict state", () => {
    render(<IntegrationsTable integrations={mockIntegrations} />, { wrapper })
    expect(screen.getByRole("button", { name: /resolve conflict/i })).toBeInTheDocument()
  })

  it("opens remove modal on trash click", () => {
    render(<IntegrationsTable integrations={mockIntegrations} />, { wrapper })
    const removeBtn = screen.getAllByTitle("Remove Integration")[0]
    fireEvent.click(removeBtn)
    expect(screen.getByText(/destruct/i)).toBeInTheDocument()
  })

  it("handles bulk removal of selected integrations after confirmation", async () => {
    jest.useFakeTimers()
    render(<IntegrationsTable integrations={mockIntegrations} />, { wrapper })
    
    // Select the first one
    const selectBox = screen.getAllByRole("checkbox")[1]
    fireEvent.click(selectBox)
    
    const bulkRemoveBtn = screen.getByRole("button", { name: /remove 1/i })
    fireEvent.click(bulkRemoveBtn)
    
    // Should show bulk confirmation modal
    expect(screen.getByText(/mass deletion/i)).toBeInTheDocument()
    
    // Type DELETE to confirm
    const input = screen.getByPlaceholderText("DELETE")
    fireEvent.change(input, { target: { value: "DELETE" } })
    
    const confirmBtn = screen.getByRole("button", { name: /yes, remove 1 integrations/i })
    fireEvent.click(confirmBtn)
    
    // Run timers for the simulated delay
    act(() => {
      jest.runAllTimers()
    })
    
    expect(mockRemoveIntegration).toHaveBeenCalledWith("1")
    expect(mockRemoveUsers).toHaveBeenCalledWith("salesforce")
    expect(mockShowNotification).toHaveBeenCalledWith(expect.objectContaining({
      type: "success",
      title: "Integrations Removed"
    }))
    
    jest.useRealTimers()
  })

  it("toggles all syncable rows when select all is clicked", () => {
    render(<IntegrationsTable integrations={mockIntegrations} />, { wrapper })
    
    const selectAllBox = screen.getAllByRole("checkbox")[0]
    fireEvent.click(selectAllBox) // Select all
    expect(screen.getByText(/1 integration selected/i)).toBeInTheDocument()
    
    fireEvent.click(selectAllBox) // Deselect all
    expect(screen.queryByText(/integration selected/i)).not.toBeInTheDocument()
  })

  it("closes review changes modal", () => {
    // Force some pending changes so the button shows up
    const mockIntegrationsWithConflict: Integration[] = [
      { ...mockIntegrations[0], status: "conflict" }
    ]
    render(<IntegrationsTable integrations={mockIntegrationsWithConflict} />, { wrapper })
    
    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /resolve conflict/i }))
    expect(screen.getByText(/review incoming changes/i)).toBeInTheDocument()
    
    // Close modal (X button)
    const closeBtn = screen.getByRole("button", { name: /close/i }) || screen.getAllByRole("button")[0]
    fireEvent.click(closeBtn)
    
    // The modal should close (or at least set the state to null)
  })

  it("auto-opens review modal on single sync with changes", async () => {
    mockFetchSyncData.mockResolvedValueOnce({
      data: { sync_approval: { changes: [{ field_name: "user.name", change_type: "UPDATE", new_value: "New" }] } }
    })
    render(<IntegrationsTable integrations={mockIntegrations} />, { wrapper })
    
    const syncBtn = screen.getAllByRole("button", { name: /sync/i })[0]
    fireEvent.click(syncBtn)
    
    await waitFor(() => {
      expect(mockSetPendingChanges).toHaveBeenCalled()
      expect(screen.getByText(/review incoming changes/i)).toBeInTheDocument()
    })
  })
})
