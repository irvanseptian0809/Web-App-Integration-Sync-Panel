"use client"

import "@testing-library/jest-dom"
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import UserDetailPage from "./page"
import { useUserStore } from "@/stores/users/usersStore"
import { useKeyStore } from "@/stores/keys/keysStore"
import { useParams, useRouter } from "next/navigation"

// --- Mocks ---
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}))

jest.mock("@/stores/users/usersStore", () => ({
  useUserStore: jest.fn(),
}))

jest.mock("@/stores/keys/keysStore", () => ({
  useKeyStore: jest.fn(),
}))

jest.mock("zustand/react/shallow", () => ({
  useShallow: (fn: any) => fn,
}))

describe("UserDetailPage", () => {
  const mockPush = jest.fn()
  const mockParams = { id: "u1" }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useParams as jest.Mock).mockReturnValue(mockParams)
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it("renders 'User not found' when user does not exist", () => {
    ;(useUserStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ users: [] })
    )
    ;(useKeyStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ keys: [] })
    )

    render(<UserDetailPage />)
    expect(screen.getByText(/user not found/i)).toBeInTheDocument()
    
    fireEvent.click(screen.getByText(/back to users/i))
    expect(mockPush).toHaveBeenCalledWith("/users")
  })

  it("renders user information correctly when found", () => {
    const mockUser = {
      id: "u1",
      name: "Alice Wonderland",
      email: "alice@test.com",
      role: "Wonderer",
      status: "active",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    }
    const mockKeys = [
      { id: "k1", user_id: "u1", status: "active" },
      { id: "k2", user_id: "u1", status: "active" },
    ]

    ;(useUserStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ users: [mockUser] })
    )
    ;(useKeyStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ keys: mockKeys })
    )

    render(<UserDetailPage />)
    
    expect(screen.getByText("Alice Wonderland")).toBeInTheDocument()
    expect(screen.getByText("alice@test.com")).toBeInTheDocument()
    expect(screen.getByText("Wonderer")).toBeInTheDocument()
    // Check key count
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("handles missing optional fields gracefully", () => {
    const mockUserMinimal = {
      id: "u1",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    }
    ;(useUserStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ users: [mockUserMinimal] })
    )
    ;(useKeyStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ keys: [] })
    )

    render(<UserDetailPage />)
    
    expect(screen.getByText("Unnamed User")).toBeInTheDocument()
    expect(screen.getAllByText("—").length).toBeGreaterThan(0)
  })
})
