import "@testing-library/jest-dom"
import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ResolutionHistoryTable } from "./ResolutionHistoryTable"
import { ResolutionHistoryEntry } from "@/interface/types"

const mockEntries: ResolutionHistoryEntry[] = [
  {
    id: "h1",
    integrationId: "1",
    resolvedAt: "2026-03-15T12:00:00Z",
    previousVersion: 1,
    resolvedVersion: 2,
    fields: [
      {
        fieldName: "email",
        previousValue: "old@example.com",
        resolvedValue: "new@example.com",
        choice: "remote",
      },
      {
        fieldName: "name",
        previousValue: "Old name",
        resolvedValue: "Old name",
        choice: "local",
      },
    ],
  },
]

describe("ResolutionHistoryTable", () => {
  it("renders 'No conflict resolutions recorded yet.' when empty", () => {
    render(<ResolutionHistoryTable entries={[]} />)
    expect(screen.getByText("No conflict resolutions recorded yet.")).toBeInTheDocument()
  })

  it("renders table headers", () => {
    render(<ResolutionHistoryTable entries={mockEntries} />)
    expect(screen.getByText("Resolved At")).toBeInTheDocument()
    expect(screen.getByText("Resolved Version")).toBeInTheDocument()
    expect(screen.getByText("Fields Changed")).toBeInTheDocument()
  })

  it("renders record with fields count", () => {
    render(<ResolutionHistoryTable entries={mockEntries} />)
    expect(screen.getByText("2 fields")).toBeInTheDocument()
  })

  it("expands to show field details when View details is clicked", () => {
    render(<ResolutionHistoryTable entries={mockEntries} />)
    
    const viewButton = screen.getByRole("button", { name: /view details/i })
    fireEvent.click(viewButton)
    
    expect(screen.getByText("email")).toBeInTheDocument()
    expect(screen.getByText("name")).toBeInTheDocument()
    expect(screen.getByText("new@example.com")).toBeInTheDocument()
    expect(screen.getByText("Kept local")).toBeInTheDocument()
  })

  it("handles pagination when entries > pageSize", () => {
    const manyEntries = Array.from({ length: 6 }, (_, i) => ({
      ...mockEntries[0],
      id: `h${i}`,
    }))
    render(<ResolutionHistoryTable entries={manyEntries} pageSize={5} />)
    
    expect(screen.getByText("Page 1 of 2 (6 records)")).toBeInTheDocument()
    const buttons = screen.getAllByRole("button")
    // The last button is ChevronRight (Next)
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton).not.toBeDisabled()
    
    fireEvent.click(nextButton)
    expect(screen.getByText("Page 2 of 2 (6 records)")).toBeInTheDocument()
  })
})
