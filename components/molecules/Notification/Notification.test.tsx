import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"

// ── Mocks ───────────────────────────────────────────────────────────────────
const mockHideNotification = jest.fn()
let mockStore = {
  isOpen: false,
  type: "success" as any,
  title: "Test Title",
  message: "Test Message",
  code: undefined as string | undefined,
  hideNotification: mockHideNotification,
}

jest.mock("@/stores/notifications/notificationsStore", () => ({
  useNotificationsStore: (selector?: (s: typeof mockStore) => unknown) =>
    selector ? selector(mockStore) : mockStore,
}))

import { Notification } from "./Notification"

describe("Notification", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockStore.isOpen = false
    mockStore.type = "success"
    mockStore.title = "Test Title"
    mockStore.message = "Test Message"
    mockStore.code = undefined
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders nothing when isOpen is false", () => {
    mockStore.isOpen = false
    const { container } = render(<Notification />)
    expect(container.firstChild).toBeNull()
  })

  it("renders title and message when open", () => {
    mockStore.isOpen = true
    mockStore.title = "Success!"
    mockStore.message = "Operation completed."
    render(<Notification />)
    expect(screen.getByText("Success!")).toBeInTheDocument()
    expect(screen.getByText("Operation completed.")).toBeInTheDocument()
  })

  it("renders error code when provided", () => {
    mockStore.isOpen = true
    mockStore.type = "error"
    mockStore.code = "ERR_500"
    render(<Notification />)
    expect(screen.getByText(/ERR_500/)).toBeInTheDocument()
  })

  it("calls hideNotification when dismiss button clicked", () => {
    mockStore.isOpen = true
    render(<Notification />)
    const closeBtn = screen.getByRole("button")
    fireEvent.click(closeBtn)
    expect(mockHideNotification).toHaveBeenCalledTimes(1)
  })

  it("auto-dismisses after 5 seconds", () => {
    mockStore.isOpen = true
    render(<Notification />)
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(mockHideNotification).toHaveBeenCalledTimes(1)
  })

  it("renders success type with correct icons/classes", () => {
    mockStore.isOpen = true
    mockStore.type = "success"
    render(<Notification />)
    const notification = screen.getByRole("alert")
    expect(notification).toHaveClass("bg-emerald-50")
  })

  it("renders error type with correct icons/classes", () => {
    mockStore.isOpen = true
    mockStore.type = "error"
    render(<Notification />)
    const notification = screen.getByRole("alert")
    expect(notification).toHaveClass("bg-red-50")
  })

  it("renders warning type with correct icons/classes", () => {
    mockStore.isOpen = true
    mockStore.type = "warning"
    render(<Notification />)
    const notification = screen.getByRole("alert")
    expect(notification).toHaveClass("bg-amber-50")
  })

  it("renders info type with correct icons/classes", () => {
    mockStore.isOpen = true
    mockStore.type = "info"
    render(<Notification />)
    const notification = screen.getByRole("alert")
    expect(notification).toHaveClass("bg-blue-50")
  })
})
