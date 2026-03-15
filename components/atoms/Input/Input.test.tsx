import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Input } from "./Input"

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("renders with correct type attribute", () => {
    render(<Input type="email" data-testid="email-input" />)
    expect(screen.getByTestId("email-input")).toHaveAttribute("type", "email")
  })

  it("renders placeholder text", () => {
    render(<Input placeholder="Enter text..." />)
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument()
  })

  it("calls onChange handler when value changes", () => {
    const onChange = jest.fn()
    render(<Input onChange={onChange} data-testid="input" />)
    fireEvent.change(screen.getByTestId("input"), { target: { value: "test" } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled data-testid="input" />)
    expect(screen.getByTestId("input")).toBeDisabled()
  })

  it("forwards ref to the underlying input element", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("merges custom className", () => {
    render(<Input className="my-input" data-testid="input" />)
    expect(screen.getByTestId("input")).toHaveClass("my-input")
  })

  it("renders with default styling classes", () => {
    render(<Input data-testid="input" />)
    expect(screen.getByTestId("input")).toHaveClass("flex", "h-9", "w-full", "rounded-md")
  })

  it("has displayName set", () => {
    expect(Input.displayName).toBe("Input")
  })
})
