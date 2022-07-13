import { defineConfig } from "astro/config";

import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";

import Sitemap from "@astrojs/sitemap";
import SolidJS from "@astrojs/solid-js";
import Tailwind from "@astrojs/tailwind";

import { PRODUCTION_MODE } from "./env.mjs";
import { outDir } from "./shared.config.cjs";

import { lookupCollection } from "@iconify/json";
import { s as svg } from "hastscript";

const { icons: fluentIcons } = await lookupCollection("fluent");

/**
 * @param {string} icon
 * @param {typeof fluentIcons} iconlist
 * @returns SVG Element
 */
function createSVG(icon, iconlist = fluentIcons) {
  let IconData = iconlist[icon];
  return svg("svg", {
    width: IconData.width,
    height: IconData.height,
    viewBox: `0 0 ${IconData.width} ${IconData.height}`,
    class: "icon",
    "rehype-icon": icon,
  }, [IconData.body]);
}

// https://astro.build/config
export default defineConfig({
  outDir,
  build: { format: "file" },
  site: "https://bundlejs.com",
  markdown: {
    rehypePlugins: [
      "rehype-slug",
      ["rehype-autolink-headings", {
        behavior: "append",
        properties: {
          ariaHidden: true, tabIndex: -1,
          "custom-slug-link": "",
        },
        content: [createSVG("link-24-regular")],
        test: [ "h2", "h3", "h4", "h5", "h6", "details", "summary", "astro-root", ],
      }],
      ["rehype-external-links", {
        target: "_blank",
        rel: ["noopener"],
        content: [createSVG("arrow-up-right-24-regular")],
      }],
    ],
    shikiConfig: {
      theme: "github-dark",
      langs: [],
      wrap: false,
    },
  },
  integrations: [
    SolidJS(),
    Tailwind({
      config: {
        applyBaseStyles: false
      }
    }),
    Sitemap(),
  ],
  experimental: { integrations: true },
  vite: {
    worker: {
      format: "es",
      rollupOptions: {
        output: {
          format: "es",
          inlineDynamicImports: true
        }
      }
    },
    build: {
      assetsInlineLimit: 0,
    },
    ssr: { external: ["svgo", "github-slugger"] },
    plugins: [
      AutoImport({
        resolvers: [
          IconsResolver({
            prefix: "Icon",
            extension: "tsx",
          }),
        ],
      }),
      Icons({
        autoInstall: true,
        compiler: "solid",
        defaultClass: "icon",
      })
    ],
  },
});
