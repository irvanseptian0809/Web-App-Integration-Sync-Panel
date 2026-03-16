import type { StorybookConfig } from "@storybook/react-vite"
import path from "path"

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../"),
        "next/link": path.resolve(__dirname, "./next-link-mock.tsx"),
        "next/navigation": path.resolve(__dirname, "./next-navigation-mock.ts"),
      }
    }
    config.define = {
      ...config.define,
      "process.env": "({})",
      "process": "({ env: {} })",
      global: "window",
    }
    return config
  },
}

export default config
