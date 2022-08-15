import { defineConfig } from "astro/config";

import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from "unplugin-icons/vite";

import Sitemap from "@astrojs/sitemap";
import SolidJS from "@astrojs/solid-js";
import Tailwind from "@astrojs/tailwind";
import MDX from "@astrojs/mdx";

import { outDir } from "./shared.config.cjs";

// https://astro.build/config
export default defineConfig({
  outDir,
  build: { format: "file" },
  site: "https://bundlejs.com",
  markdown: {
    shikiConfig: {
      theme: "github-dark",
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
    worker: { format: "es" },
    ssr: { external: ["svgo"] },
    plugins: [
      Icons({
        autoInstall: true,
        compiler: "solid",
        defaultClass: "icon",
        customCollections: {
          // a helper to load icons from the file system
          // files under `./assets/icons` with `.svg` extension will be loaded as it's file name
          // you can also provide a transform callback to change each icon (optional)
          'local': FileSystemIconLoader('./src/icons'),
        },
        iconCustomizer(collection, icon, props) {
          // customize this @iconify icon in this collection
          if (collection === 'local') {
            props.width = '24';
            props.height = '24';
            props.viewBox = "0 0 1024 1024";
          }
        },
      })
    ]
  }
});