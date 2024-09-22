import { cloudflareDevProxyVitePlugin, vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import adapter from "@hono/vite-dev-server/cloudflare"
import serverAdapter from "hono-remix-adapter/vite"

export default defineConfig({
  plugins: [
    cloudflareDevProxyVitePlugin(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    serverAdapter({
      adapter,
      entry:"./server/index.ts"
    }),
    tsconfigPaths(),
  ],
});