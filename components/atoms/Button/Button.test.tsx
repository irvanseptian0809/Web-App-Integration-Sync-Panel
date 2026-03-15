import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "./Button"

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("calls onClick when clicked", () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click</Button>)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("does not call onClick when disabled", () => {
    const onClick = jest.fn()
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    )
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies default variant classes", () => {
    render(<Button>Default</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-blue-600", "text-white")
  })

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole("button")).toHaveClass("border", "border-slate-200")
  })

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole("button")).toHaveClass("hover:bg-slate-100")
  })

  it("applies destructive variant classes", () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-red-500", "text-white")
  })

  it("applies sm size classes", () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-8", "text-xs")
  })

  it("applies lg size classes", () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-10", "px-8")
  })

  it("applies icon size classes", () => {
    render(<Button size="icon">I</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-9", "w-9")
  })

  it("forwards ref to underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("merges custom className", () => {
    render(<Button className="custom-btn">Custom</Button>)
    expect(screen.getByRole("button")).toHaveClass("custom-btn")
  })

  it("has displayName set", () => {
    expect(Button.displayName).toBe("Button")
  })
})
