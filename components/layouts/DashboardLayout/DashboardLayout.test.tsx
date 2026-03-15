import "@testing-library/jest-dom"
import React from "react"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { DashboardLayout } from "./DashboardLayout"

describe("DashboardLayout", () => {
  it("renders children correctly", () => {
    render(
      <DashboardLayout>
        <div data-testid="child">Body Content</div>
      </DashboardLayout>,
    )
    expect(screen.getByTestId("child")).toBeInTheDocument()
    expect(screen.getByText("Body Content")).toBeInTheDocument()
  })

  it("renders the header with app name", () => {
    render(<DashboardLayout>Content</DashboardLayout>)
    expect(screen.getByText("portier sync")).toBeInTheDocument()
  })

  it("renders the footer with copyright", () => {
    render(<DashboardLayout>Content</DashboardLayout>)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear} portier`, "i"))).toBeInTheDocument()
  })

  it("renders the user avatar", () => {
    render(<DashboardLayout>Content</DashboardLayout>)
    expect(screen.getByAltText("User")).toBeInTheDocument()
  })
})
