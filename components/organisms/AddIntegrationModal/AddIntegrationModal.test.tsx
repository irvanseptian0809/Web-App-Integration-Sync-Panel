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

jest.mock("@/stores/integrationStore", () => ({
  useIntegrationStore: (selector: any) =>
    selector({
      addIntegration: mockAddIntegration,
      integrations: mockIntegrations,
    }),
}))

jest.mock("@/stores/notificationStore", () => ({
  useNotificationStore: (selector: any) =>
    selector({ showNotification: mockShowNotification }),
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
})
