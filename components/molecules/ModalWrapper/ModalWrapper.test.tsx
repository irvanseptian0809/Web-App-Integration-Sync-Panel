import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ModalWrapper } from "./ModalWrapper"

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  title: "Test Modal",
}

describe("ModalWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <ModalWrapper {...defaultProps} isOpen={false}>
        Body
      </ModalWrapper>,
    )
    expect(container.firstChild).toBeNull()
  })

  it("renders title when open", () => {
    render(<ModalWrapper {...defaultProps}>Body</ModalWrapper>)
    expect(screen.getByRole("heading", { name: "Test Modal" })).toBeInTheDocument()
  })

  it("renders description when provided", () => {
    render(
      <ModalWrapper {...defaultProps} description="This is a description">
        Content
      </ModalWrapper>,
    )
    expect(screen.getByText("This is a description")).toBeInTheDocument()
  })

  it("does not render description when not provided", () => {
    render(<ModalWrapper {...defaultProps}>Content</ModalWrapper>)
    expect(screen.queryByText("description")).not.toBeInTheDocument()
  })

  it("renders children content", () => {
    render(
      <ModalWrapper {...defaultProps}>
        <p>Child content</p>
      </ModalWrapper>,
    )
    expect(screen.getByText("Child content")).toBeInTheDocument()
  })

  it("renders footer when provided", () => {
    render(
      <ModalWrapper {...defaultProps} footer={<button>Save</button>}>
        Body
      </ModalWrapper>,
    )
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
  })

  it("calls onClose when X button is clicked", () => {
    const onClose = jest.fn()
    render(
      <ModalWrapper {...defaultProps} onClose={onClose}>
        Body
      </ModalWrapper>,
    )
    const closeBtn = screen.getAllByRole("button")[0]
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when Escape key is pressed", () => {
    const onClose = jest.fn()
    render(
      <ModalWrapper {...defaultProps} onClose={onClose}>
        Body
      </ModalWrapper>,
    )
    fireEvent.keyDown(window, { key: "Escape" })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("sets body overflow to hidden when open", () => {
    render(<ModalWrapper {...defaultProps}>Body</ModalWrapper>)
    expect(document.body.style.overflow).toBe("hidden")
  })

  it("resets body overflow when unmounted", () => {
    const { unmount } = render(<ModalWrapper {...defaultProps}>Body</ModalWrapper>)
    unmount()
    expect(document.body.style.overflow).toBe("unset")
  })
})
