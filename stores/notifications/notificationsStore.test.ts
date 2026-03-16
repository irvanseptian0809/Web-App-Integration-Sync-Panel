import { useNotificationsStore } from "./notificationsStore"

describe("notificationsStore", () => {
  beforeEach(() => {
    useNotificationsStore.setState({
      isOpen: false,
      type: "info",
      title: "",
      message: "",
      code: undefined,
    })
  })

  it("should show a notifications", () => {
    useNotificationsStore.getState().showNotification({
      type: "success",
      title: "Success",
      message: "Operation completed",
      code: "200",
    })

    const state = useNotificationsStore.getState()
    expect(state.isOpen).toBe(true)
    expect(state.type).toBe("success")
    expect(state.title).toBe("Success")
    expect(state.message).toBe("Operation completed")
    expect(state.code).toBe("200")
  })

  it("should hide a notifications", () => {
    useNotificationsStore.setState({ isOpen: true })
    useNotificationsStore.getState().hideNotification()
    expect(useNotificationsStore.getState().isOpen).toBe(false)
  })
})
