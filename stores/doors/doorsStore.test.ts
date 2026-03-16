import { useDoorStore } from "./doorsStore"
import { Door } from "@/interface/types"

describe("doorStore", () => {
  beforeEach(() => {
    useDoorStore.setState({
      doors: [
        {
          id: "d1",
          name: "Main Entrance",
          location: "Ground Floor",
          device_id: "dev_001",
          status: "online",
          battery_level: 85,
          last_seen: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ],
    })
  })

  it("should add a door", () => {
    const newDoor: Door = {
      id: "d3",
      name: "Office Door",
      location: "Level 1",
      device_id: "dev_003",
      status: "online",
      battery_level: 100,
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    useDoorStore.getState().addDoor(newDoor)
    expect(useDoorStore.getState().doors).toContainEqual(newDoor)
  })

  it("should update a door", () => {
    const updatedDoor = { ...useDoorStore.getState().doors[0], name: "Main Entrance Updated" }
    useDoorStore.getState().updateDoor(updatedDoor)
    expect(useDoorStore.getState().doors[0].name).toBe("Main Entrance Updated")
  })

  it("should remove doors by provider", () => {
    const doorId = "d1"
    useDoorStore.getState().addDoor({
      id: "d4",
      name: "Test",
      location: "Loc",
      device_id: "dev_004",
      status: "online",
      battery_level: 50,
      last_seen: "",
      created_at: "",
      provider: "hubspot"
    })
    useDoorStore.getState().removeDoorsByProvider("hubspot")
    expect(useDoorStore.getState().doors.find((d) => d.provider === "hubspot")).toBeUndefined()
  })
})
