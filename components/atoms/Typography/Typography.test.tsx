import "@testing-library/jest-dom"
import React from "react"
import { render, screen } from "@testing-library/react"
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographySmall,
  TypographyMuted,
} from "./Typography"

describe("Typography", () => {
  describe("TypographyH1", () => {
    it("renders an h1 element", () => {
      render(<TypographyH1>Heading 1</TypographyH1>)
      expect(screen.getByRole("heading", { level: 1, name: "Heading 1" })).toBeInTheDocument()
    })

    it("applies heading classes", () => {
      render(<TypographyH1 data-testid="h1">H1</TypographyH1>)
      expect(screen.getByTestId("h1")).toHaveClass("text-4xl", "font-extrabold")
    })

    it("merges custom className", () => {
      render(<TypographyH1 className="custom">H1</TypographyH1>)
      expect(screen.getByRole("heading", { level: 1 })).toHaveClass("custom")
    })

    it("forwards ref", () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<TypographyH1 ref={ref}>H1</TypographyH1>)
      expect(ref.current?.tagName).toBe("H1")
    })
  })

  describe("TypographyH2", () => {
    it("renders an h2 element", () => {
      render(<TypographyH2>Heading 2</TypographyH2>)
      expect(screen.getByRole("heading", { level: 2, name: "Heading 2" })).toBeInTheDocument()
    })

    it("applies heading classes", () => {
      render(<TypographyH2 data-testid="h2">H2</TypographyH2>)
      expect(screen.getByTestId("h2")).toHaveClass("text-3xl", "font-semibold")
    })
  })

  describe("TypographyH3", () => {
    it("renders an h3 element", () => {
      render(<TypographyH3>Heading 3</TypographyH3>)
      expect(screen.getByRole("heading", { level: 3, name: "Heading 3" })).toBeInTheDocument()
    })

    it("applies heading classes", () => {
      render(<TypographyH3 data-testid="h3">H3</TypographyH3>)
      expect(screen.getByTestId("h3")).toHaveClass("text-2xl", "font-semibold")
    })
  })

  describe("TypographyP", () => {
    it("renders a paragraph element", () => {
      render(<TypographyP data-testid="p">Paragraph text</TypographyP>)
      const el = screen.getByTestId("p")
      expect(el.tagName).toBe("P")
      expect(el).toHaveTextContent("Paragraph text")
    })

    it("applies paragraph classes", () => {
      render(<TypographyP data-testid="p">P</TypographyP>)
      expect(screen.getByTestId("p")).toHaveClass("leading-7")
    })
  })

  describe("TypographySmall", () => {
    it("renders a small element", () => {
      render(<TypographySmall data-testid="small">Small text</TypographySmall>)
      const el = screen.getByTestId("small")
      expect(el.tagName).toBe("SMALL")
      expect(el).toHaveTextContent("Small text")
    })

    it("applies small text classes", () => {
      render(<TypographySmall data-testid="small">S</TypographySmall>)
      expect(screen.getByTestId("small")).toHaveClass("text-sm", "font-medium")
    })
  })

  describe("TypographyMuted", () => {
    it("renders a paragraph element with muted styles", () => {
      render(<TypographyMuted data-testid="muted">Muted text</TypographyMuted>)
      const el = screen.getByTestId("muted")
      expect(el.tagName).toBe("P")
      expect(el).toHaveClass("text-sm", "text-slate-500")
    })

    it("merges custom className", () => {
      render(<TypographyMuted className="extra" data-testid="muted">M</TypographyMuted>)
      expect(screen.getByTestId("muted")).toHaveClass("extra")
    })
  })
})
