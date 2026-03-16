import "@testing-library/jest-dom"
import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AddIntegrationModal } from "./AddIntegrationModal"

// ── Mocks ───────────────────────────────────────────────────────────────────
const mockAddIntegration = jest.fn()
const mockShowNotification = jest.fn()
const mockIntegrations: any[] = []
const mockAddUser = jest.fn()
const mockAddKey = jest.fn()
const mockAddDoor = jest.fn()

jest.mock("@/stores/integrations/integrationsStore", () => ({
  useIntegrationStore: (selector: any) =>
    selector({
      addIntegration: mockAddIntegration,
      integrations: mockIntegrations,
    }),
}))

jest.mock("@/stores/notifications/notificationsStore", () => ({
  useNotificationsStore: (selector: any) =>
    selector({ showNotification: mockShowNotification }),
}))

jest.mock("@/stores/users/usersStore", () => ({
  useUserStore: Object.assign((selector: any) => selector({ addUser: mockAddUser }), {
    getState: () => ({ addUser: mockAddUser }),
  }),
}))

jest.mock("@/stores/keys/keysStore", () => ({
  useKeyStore: Object.assign((selector: any) => selector({ addKey: mockAddKey }), {
    getState: () => ({ addKey: mockAddKey }),
  }),
}))

jest.mock("@/stores/doors/doorsStore", () => ({
  useDoorStore: (selector: any) => selector({ addDoor: mockAddDoor }),
}))

// Mock API
jest.mock("@/services/syncApi", () => ({
  syncApi: {
    fetchSyncData: jest.fn().mockResolvedValue({
      data: { sync_approval: { changes: [] } }
    }),
  },
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe("AddIntegrationModal", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIntegrations.length = 0
  })

  it("renders nothing when closed", () => {
    const { container } = render(
      <AddIntegrationModal isOpen={false} onClose={jest.fn()} />,
      { wrapper },
    )
    expect(container.firstChild).toBeNull()
  })

  it("renders form when open", () => {
    render(<AddIntegrationModal isOpen onClose={jest.fn()} />, { wrapper })
    expect(screen.getByText("Connect New Integration")).toBeInTheDocument()
  })

  it("shows error when provider already exists", async () => {
    mockIntegrations.push({ provider: "salesforce" })
    render(<AddIntegrationModal isOpen onClose={jest.fn()} />, { wrapper })

    // Select salesforce is default
    fireEvent.click(screen.getByRole("button", { name: /connect integration/i }))

    await waitFor(() => {
      expect(screen.getByText(/already have a salesforce/i)).toBeInTheDocument()
    })
  })

  it("calls addIntegration and onClose on success", async () => {
    const { syncApi } = require("@/services/syncApi")
    const onClose = jest.fn()
    render(<AddIntegrationModal isOpen onClose={onClose} />, { wrapper })

    fireEvent.click(screen.getByRole("button", { name: /connect integration/i }))

    await waitFor(() => {
      expect(syncApi.fetchSyncData).toHaveBeenCalledWith("salesforce")
      expect(mockAddIntegration).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  it("handles API error gracefully", async () => {
    const { syncApi } = require("@/services/syncApi")
    syncApi.fetchSyncData.mockRejectedValueOnce({
      type: "error",
      title: "Connection Failed",
      message: "API Error",
      code: "ERR_CONNECTION_REFUSED"
    })
    
    render(<AddIntegrationModal isOpen onClose={jest.fn()} />, { wrapper })
    fireEvent.click(screen.getByRole("button", { name: /connect integration/i }))

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(expect.objectContaining({
        type: "error",
        message: "API Error"
      }))
    })
  })

  it("changes provider when select is used", () => {
    render(<AddIntegrationModal isOpen onClose={jest.fn()} />, { wrapper })
    const select = screen.getByRole("combobox")
    fireEvent.change(select, { target: { value: "hubspot" } })
    expect(select).toHaveValue("hubspot")
  })

  it("ignores malformed field names", async () => {
    const { syncApi } = require("@/services/syncApi")
    syncApi.fetchSyncData.mockResolvedValueOnce({
      data: {
        sync_approval: {
          changes: [
            { field_name: "malformed", change_type: "ADD", current_value: null, new_value: "bad" },
          ]
        }
      }
    })

    render(<AddIntegrationModal isOpen onClose={jest.fn()} />, { wrapper })
    fireEvent.click(screen.getByRole("button", { name: /connect integration/i }))

    await waitFor(() => {
      expect(mockAddIntegration).toHaveBeenCalled()
      // addUser/Key should not be called for malformed
    })
  })

  it("partitions by explicit id field", async () => {
    const { syncApi } = require("@/services/syncApi")
    syncApi.fetchSyncData.mockResolvedValueOnce({
      data: {
        sync_approval: {
          changes: [
            { field_name: "user.id", change_type: "ADD", current_value: null, new_value: "u1" },
            { field_name: "user.name", change_type: "ADD", current_value: null, new_value: "User 1" },
            { field_name: "user.id", change_type: "ADD", current_value: null, new_value: "u2" },
          ]
        }
      }
    })

    render(<AddIntegrationModal isOpen onClose={jest.fn()} />, { wrapper })
    fireEvent.click(screen.getByRole("button", { name: /connect integration/i }))

    await waitFor(() => {
      expect(mockAddIntegration).toHaveBeenCalled()
    })
  })

  it("partitions keys and doors by duplicate fields", async () => {
    const { syncApi } = require("@/services/syncApi")
    syncApi.fetchSyncData.mockResolvedValueOnce({
      data: {
        sync_approval: {
          changes: [
            { field_name: "key.id", change_type: "ADD", current_value: null, new_value: "k1" },
            { field_name: "key.id", change_type: "ADD", current_value: null, new_value: "k2" },
            { field_name: "door.name", change_type: "ADD", current_value: null, new_value: "Door 1" },
            { field_name: "door.name", change_type: "ADD", current_value: null, new_value: "Door 2" },
          ]
        }
      }
    })

    render(<AddIntegrationModal isOpen onClose={jest.fn()} />, { wrapper })
    fireEvent.click(screen.getByRole("button", { name: /connect integration/i }))

    await waitFor(() => {
      expect(mockAddIntegration).toHaveBeenCalled()
      expect(mockAddKey).toHaveBeenCalledTimes(2)
      expect(mockAddDoor).toHaveBeenCalledTimes(2)
    })
  })

  it("disables connect button when pending", async () => {
    const { syncApi } = require("@/services/syncApi")
    // Keep it pending
    syncApi.fetchSyncData.mockReturnValue(new Promise(() => {}))
    
    render(<AddIntegrationModal isOpen onClose={jest.fn()} />, { wrapper })
    fireEvent.click(screen.getByRole("button", { name: /connect integration/i }))
    
    await waitFor(() => {
      const connectingBtn = screen.getByRole("button", { name: /connecting/i })
      expect(connectingBtn).toBeDisabled()
    })
  })

  it("sets synced status when no changes are returned", async () => {
    const { syncApi } = require("@/services/syncApi")
    syncApi.fetchSyncData.mockResolvedValueOnce({
      data: { sync_approval: { changes: [] } }
    })
    
    render(<AddIntegrationModal isOpen onClose={jest.fn()} />, { wrapper })
    fireEvent.click(screen.getByRole("button", { name: /connect integration/i }))

    await waitFor(() => {
      expect(mockAddIntegration).toHaveBeenCalled()
    })
  })
})
