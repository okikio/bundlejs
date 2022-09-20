import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  build: {
    format: "file"
  },
  site: "https://bundle.js.org",
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }), 
    sitemap()
  ]
});