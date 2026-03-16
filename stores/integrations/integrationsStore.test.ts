import { useIntegrationStore } from "./integrationsStore"
import { Integration, ResolutionHistoryEntry } from "@/interface/types"

describe("integrationStore", () => {
  beforeEach(() => {
    useIntegrationStore.setState({
      activeIntegration: null,
      integrations: [
        {
          id: "int_1",
          name: "Salesforce CRM",
          provider: "salesforce",
          status: "synced",
          lastSyncTime: new Date().toISOString(),
          version: 1,
          logo: "",
        },
      ],
      pendingChanges: {},
      resolutions: {},
      conflictHistory: {},
    })
  })

  it("should add an integration", () => {
    const newInt: Integration = { id: "new", name: "New", provider: "hubspot", status: "synced", lastSyncTime: "", version: 1, logo: "" }
    useIntegrationStore.getState().addIntegration(newInt)
    expect(useIntegrationStore.getState().integrations).toContainEqual(newInt)
  })

  it("should set active integration", () => {
    const integration = useIntegrationStore.getState().integrations[0]
    useIntegrationStore.getState().setActiveIntegration(integration)
    expect(useIntegrationStore.getState().activeIntegration).toBe(integration)
  })

  it("should remove an integration", () => {
    useIntegrationStore.getState().removeIntegration("int_1")
    expect(useIntegrationStore.getState().integrations).toHaveLength(0)
  })

  it("should bump version", () => {
    const initialVersion = useIntegrationStore.getState().integrations[0].version
    useIntegrationStore.getState().bumpIntegrationVersion("int_1")
    expect(useIntegrationStore.getState().integrations[0].version).toBe(initialVersion + 1)
  })

  it("should set integration status", () => {
    useIntegrationStore.getState().setIntegrationStatus("int_1", "error")
    expect(useIntegrationStore.getState().integrations[0].status).toBe("error")
  })


  it("should set pending changes and resolutions", () => {
    const changes = [{ id: "c1", field_name: "name", change_type: "UPDATE" as const, current_value: "A", new_value: "B" }]
    useIntegrationStore.getState().setPendingChanges("int_1", changes)
    expect(useIntegrationStore.getState().pendingChanges["int_1"]).toEqual(changes)
    expect(useIntegrationStore.getState().resolutions["int_1"]).toEqual({})
  })

  it("should set and clear resolutions", () => {
    useIntegrationStore.getState().setResolution("int_1", "email", "local")
    expect(useIntegrationStore.getState().resolutions["int_1"]["email"]).toBe("local")

    useIntegrationStore.getState().clearResolutions("int_1")
    expect(useIntegrationStore.getState().resolutions["int_1"]).toBeUndefined()
    expect(useIntegrationStore.getState().pendingChanges["int_1"]).toBeUndefined()
  })
})
