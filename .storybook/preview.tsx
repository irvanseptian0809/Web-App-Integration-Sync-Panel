import React from "react"
import type { Preview } from "@storybook/react"

// Polyfills for process and global
if (typeof window !== "undefined") {
  (window as any).global = window;
  (window as any).process = (window as any).process || { env: {} };
  (window as any).process.env = (window as any).process.env || {};
  (window as any).process.env.NODE_ENV = (window as any).process.env.NODE_ENV || "development";
}
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"
import "../app/globals.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

// Mock router instance
const mockRouter = {
  back: () => {},
  forward: () => {},
  push: () => {},
  replace: () => {},
  refresh: () => {},
  prefetch: () => {},
}

const preview: Preview = {
  parameters: {
    layout: "centered",
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <AppRouterContext.Provider value={mockRouter as any}>
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </AppRouterContext.Provider>
    ),
  ],
}

export default preview
