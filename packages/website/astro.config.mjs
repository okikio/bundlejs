import { defineConfig } from "astro/config";

import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";

import Sitemap from "@astrojs/sitemap";
import SolidJS from "@astrojs/solid-js";
import Tailwind from "@astrojs/tailwind";
import MDX from "@astrojs/mdx";

import { PRODUCTION_MODE } from "./env.mjs";
import { outDir } from "./shared.config.cjs";

// https://astro.build/config
export default defineConfig({
  outDir,
  build: {
    format: "file"
  },
  site: "https://bundlejs.com",
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      langs: [],
      wrap: false
    }
  },
  integrations: [
    SolidJS(),
    Tailwind({
      config: { applyBaseStyles: false }
    }),
    Sitemap(),
    MDX()
  ],
  vite: {
    worker: {
      format: "es",
    },
    ssr: {
      external: ["svgo"]
    },
    plugins: [
      // AutoImport({
      //   resolvers: [
      //     IconsResolver({
      //       prefix: "Icon",
      //       extension: "tsx"
      //     })
      //   ]
      // }),
      Icons({
        autoInstall: true,
        compiler: "solid",
        defaultClass: "icon"
      })
    ]
  }
});