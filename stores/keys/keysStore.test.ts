import { useKeyStore } from "./keysStore"
import { Key } from "@/interface/types"

describe("keyStore", () => {
  beforeEach(() => {
    useKeyStore.setState({
      keys: [
        {
          id: "k1",
          user_id: "u1",
          door_id: "d1",
          key_type: "Physical",
          access_start: new Date().toISOString(),
          access_end: new Date(Date.now() + 86400000 * 365).toISOString(),
          status: "active",
          created_at: new Date().toISOString(),
        },
      ],
    })
  })

  it("should add a key", () => {
    const newKey: Key = {
      id: "k2",
      user_id: "u2",
      door_id: "d2",
      key_type: "Digital",
      access_start: new Date().toISOString(),
      access_end: new Date().toISOString(),
      status: "active",
      created_at: new Date().toISOString(),
    }
    useKeyStore.getState().addKey(newKey)
    expect(useKeyStore.getState().keys).toContainEqual(newKey)
  })

  it("should update a key", () => {
    const updatedKey = { ...useKeyStore.getState().keys[0], key_type: "Updated Key Type" }
    useKeyStore.getState().updateKey(updatedKey)
    expect(useKeyStore.getState().keys[0].key_type).toBe("Updated Key Type")
  })

  it("should remove keys by provider", () => {
    useKeyStore.getState().addKey({
      id: "k3",
      user_id: "u3",
      door_id: "d3",
      key_type: "Physical",
      access_start: "",
      access_end: "",
      status: "active",
      created_at: "",
      provider: "hubspot"
    })
    useKeyStore.getState().removeKeysByProvider("hubspot")
    expect(useKeyStore.getState().keys.find((k) => k.provider === "hubspot")).toBeUndefined()
  })

  it("should set keys", () => {
    const newKeys = [{ id: "kx", user_id: "ux", door_id: "dx", key_type: "Digital", access_start: "", access_end: "", status: "active", created_at: "" }] as Key[]
    useKeyStore.getState().setKeys(newKeys)
    expect(useKeyStore.getState().keys).toEqual(newKeys)
  })

  it("should remove a key", () => {
    const keyId = "k1"
    useKeyStore.getState().removeKey(keyId)
    expect(useKeyStore.getState().keys.find((k) => k.id === keyId)).toBeUndefined()
  })
})
