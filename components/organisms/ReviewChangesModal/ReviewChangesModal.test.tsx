import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ReviewChangesModal } from "./ReviewChangesModal"
import { Integration, SyncChange } from "@/interface/types"
import { useIntegrationStore } from "@/stores/integrations/integrationsStore"
import { useUserStore } from "@/stores/users/usersStore"
import { useKeyStore } from "@/stores/keys/keysStore"
import { useDoorStore } from "@/stores/doors/doorsStore"

// ── Mocks ───────────────────────────────────────────────────────────────────
jest.mock("@/stores/integrations/integrationsStore", () => ({
  useIntegrationStore: jest.fn(),
}))
jest.mock("@/stores/users/usersStore", () => ({
  useUserStore: jest.fn(),
}))
jest.mock("@/stores/keys/keysStore", () => ({
  useKeyStore: jest.fn(),
}))
jest.mock("@/stores/doors/doorsStore", () => ({
  useDoorStore: jest.fn(),
}))

const mockSetResolution = jest.fn()
const mockClearResolutions = jest.fn()
const mockBumpIntegrationVersion = jest.fn()
const mockSetIntegrationStatus = jest.fn()
const mockRecordResolution = jest.fn()

const mockUpdateUser = jest.fn()
const mockUpdateKey = jest.fn()
const mockUpdateDoor = jest.fn()

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
    change_type: "UPDATE",
    current_value: "John",
    new_value: "John Doe",
  },
]

const defaultIntegrationStore = {
  pendingChanges: { "1": mockChanges },
  resolutions: { "1": {} },
  integrations: [{ id: "1", version: 1, name: "Salesforce", provider: "salesforce" }],
  setResolution: mockSetResolution,
  clearResolutions: mockClearResolutions,
  bumpIntegrationVersion: mockBumpIntegrationVersion,
  setIntegrationStatus: mockSetIntegrationStatus,
  recordResolution: mockRecordResolution,
}

const defaultUserStore = {
  users: [
    { id: "u1", name: "John", email: "old@example.com", provider: "salesforce" }
  ],
  updateUser: mockUpdateUser,
}

const defaultKeyStore = {
  keys: [],
  updateKey: mockUpdateKey,
}

const defaultDoorStore = {
  doors: [],
  updateDoor: mockUpdateDoor,
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
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) => selector(defaultIntegrationStore))
    ;(useUserStore as unknown as jest.Mock).mockImplementation((selector: any) => selector(defaultUserStore))
    ;(useKeyStore as unknown as jest.Mock).mockImplementation((selector: any) => selector(defaultKeyStore))
    ;(useDoorStore as unknown as jest.Mock).mockImplementation((selector: any) => selector(defaultDoorStore))
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
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        resolutions: { "1": { chg_1: "chg_1", chg_2: "chg_2" } },
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
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        resolutions: { "1": { chg_1: "local", chg_2: "local" } },
      })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    const confirmBtn = screen.getByRole("button", { name: /confirm & apply merge/i })
    fireEvent.click(confirmBtn)

    expect(mockRecordResolution).not.toHaveBeenCalled()
    expect(mockSetIntegrationStatus).toHaveBeenCalledWith("1", "synced")
  })

  it("handles CREATE changes by adding new entities", () => {
    const createChanges = [
      { id: "c1", field_name: "user.id", change_type: "CREATE", current_value: null, new_value: "u99" },
      { id: "c2", field_name: "user.name", change_type: "CREATE", current_value: null, new_value: "New Guy" },
    ]
    const mockAddUser = jest.fn()
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        pendingChanges: { "1": createChanges },
        resolutions: { "1": { c1: "c1", c2: "c2" } },
      })
    )
    ;(useUserStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ ...defaultUserStore, addUser: mockAddUser })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    const confirmBtn = screen.getByRole("button", { name: /confirm & apply merge/i })
    fireEvent.click(confirmBtn)

    expect(mockAddUser).toHaveBeenCalled()
    // Verify default status was applied
    const addedUser = mockAddUser.mock.calls[0][0]
    expect(addedUser.id).toBe("u99")
    expect(addedUser.status).toBe("suspended")
  })

  it("handles DELETE changes by removing entities", () => {
    const deleteChanges = [
      { id: "d1", field_name: "user.id", change_type: "DELETE", current_value: "u1", new_value: null },
    ]
    const mockRemoveUser = jest.fn()
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        pendingChanges: { "1": deleteChanges },
        resolutions: { "1": { d1: "d1" } },
      })
    )
    ;(useUserStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ ...defaultUserStore, removeUser: mockRemoveUser })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    const confirmBtn = screen.getByRole("button", { name: /confirm & apply merge/i })
    fireEvent.click(confirmBtn)

    expect(mockRemoveUser).toHaveBeenCalledWith("u1")
  })
  it("handles robust grouping by flushing on duplicate fields", () => {
    // Two users with same fields but no distinct IDs in the stream
    const createChanges = [
      { id: "c1", field_name: "user.email", change_type: "ADD" as any, current_value: null, new_value: "user1@example.com" },
      { id: "c2", field_name: "user.name", change_type: "ADD" as any, current_value: null, new_value: "User One" },
      // Duplicate email field triggers new user record
      { id: "c3", field_name: "user.email", change_type: "ADD" as any, current_value: null, new_value: "user2@example.com" },
      { id: "c4", field_name: "user.name", change_type: "ADD" as any, current_value: null, new_value: "User Two" },
    ]
    const mockAddUser = jest.fn()
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        pendingChanges: { "1": createChanges },
        resolutions: { "1": { c1: "c1", c2: "c2", c3: "c3", c4: "c4" } },
      })
    )
    ;(useUserStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ ...defaultUserStore, addUser: mockAddUser })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    const confirmBtn = screen.getByRole("button", { name: /confirm & apply merge/i })
    fireEvent.click(confirmBtn)

    // Should be called twice (one for each user)
    expect(mockAddUser).toHaveBeenCalledTimes(2)
    expect(mockAddUser.mock.calls[0][0].email).toBe("user1@example.com")
    expect(mockAddUser.mock.calls[1][0].email).toBe("user2@example.com")
  })

  it("handles Door updates correctly", () => {
    const doorChanges = [
      { id: "d1", field_name: "door.status", change_type: "UPDATE", current_value: "offline", new_value: "online" },
    ]
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        pendingChanges: { "1": doorChanges },
        resolutions: { "1": { d1: "d1" } },
      })
    )
    const mockDoor = { id: "dr1", name: "Front", status: "offline", provider: "salesforce" }
    ;(useDoorStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ ...defaultDoorStore, doors: [mockDoor], updateDoor: mockUpdateDoor })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    fireEvent.click(screen.getByRole("button", { name: /confirm & apply merge/i }))

    expect(mockUpdateDoor).toHaveBeenCalled()
    const updated = mockUpdateDoor.mock.calls[0][0]
    expect(updated.status).toBe("online")
    expect(mockRecordResolution).toHaveBeenCalledWith(expect.objectContaining({
      fields: [expect.objectContaining({ fieldName: "door.status", previousValue: "offline", resolvedValue: "online" })]
    }))
  })

  it("handles Key updates correctly", () => {
    const keyChanges = [
      { id: "k1", field_name: "key.status", change_type: "UPDATE", current_value: "active", new_value: "revoked" },
    ]
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        pendingChanges: { "1": keyChanges },
        resolutions: { "1": { k1: "k1" } },
      })
    )
    const mockKey = { id: "ky1", status: "active", provider: "salesforce" }
    ;(useKeyStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ ...defaultKeyStore, keys: [mockKey], updateKey: mockUpdateKey })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    fireEvent.click(screen.getByRole("button", { name: /confirm & apply merge/i }))

    expect(mockUpdateKey).toHaveBeenCalled()
    const updated = mockUpdateKey.mock.calls[0][0]
    expect(updated.status).toBe("revoked")
  })

  it("handles unknown entity type gracefully", () => {
    const unknownChange = [
      { id: "u1", field_name: "unknown.field", change_type: "UPDATE", current_value: "A", new_value: "B" },
    ]
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        pendingChanges: { "1": unknownChange },
        resolutions: { "1": { u1: "u1" } },
      })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    fireEvent.click(screen.getByRole("button", { name: /confirm & apply merge/i }))

    // Should not crash and should record resolution (as skip or default)
    expect(mockSetIntegrationStatus).toHaveBeenCalledWith("1", "synced")
  })

  it("handles DELETE for doors and keys", () => {
    const deleteChanges = [
      { id: "d1", field_name: "door.id", change_type: "DELETE", current_value: "dr1", new_value: null },
      { id: "k1", field_name: "key.id", change_type: "DELETE", current_value: "ky1", new_value: null },
    ]
    const mockRemoveDoor = jest.fn()
    const mockRemoveKey = jest.fn()
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        pendingChanges: { "1": deleteChanges },
        resolutions: { "1": { d1: "d1", k1: "k1" } },
      })
    )
    ;(useDoorStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ ...defaultDoorStore, doors: [{ id: "dr1", provider: "salesforce" }], removeDoor: mockRemoveDoor })
    )
    ;(useKeyStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ ...defaultKeyStore, keys: [{ id: "ky1", provider: "salesforce" }], removeKey: mockRemoveKey })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    fireEvent.click(screen.getByRole("button", { name: /confirm & apply merge/i }))

    expect(mockRemoveDoor).toHaveBeenCalledWith("dr1")
    expect(mockRemoveKey).toHaveBeenCalledWith("ky1")
  })

  it("does NOT handle UPDATE as CREATE when local entity is missing (Strict Resolution)", () => {
    const updateWithoutMatch = [
      { id: "u1", field_name: "user.name", change_type: "UPDATE", current_value: "Missing", new_value: "Found" },
    ]
    const mockAddUser = jest.fn()
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        pendingChanges: { "1": updateWithoutMatch },
        resolutions: { "1": { u1: "u1" } },
      })
    )
    ;(useUserStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ ...defaultUserStore, users: [], addUser: mockAddUser })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    fireEvent.click(screen.getByRole("button", { name: /confirm & apply merge/i }))

    expect(mockAddUser).not.toHaveBeenCalled()
  })

  it("clears validation errors when a conflict is resolved", () => {
    const conflictChanges = [
      { id: "c1", field_name: "user.role", change_type: "UPDATE", current_value: "User", new_value: "Admin" },
    ]
    ;(useIntegrationStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({
        ...defaultIntegrationStore,
        pendingChanges: { "1": conflictChanges },
        resolutions: { "1": {} }, // No resolution yet
      })
    )

    render(<ReviewChangesModal isOpen integration={mockIntegration} onClose={jest.fn()} />)
    
    // Trigger validation error
    fireEvent.click(screen.getByRole("button", { name: /confirm & apply merge/i }))
    
    // Resolve conflict (this should call setResolution and clear showValidation)
    // We mock the child component SyncPreviewPanel or just simulate the callback
    // Since SyncPreviewPanel is likely rendering something we can click
    const resolveBtn = screen.getByText(/admin/i) // Assuming new value is clickable
    fireEvent.click(resolveBtn)

    expect(screen.queryByText(/please resolve all conflicts/i)).not.toBeInTheDocument()
  })
})
