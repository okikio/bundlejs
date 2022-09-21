import { defineConfig } from "astro/config";

import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from "unplugin-icons/vite";

import ServiceWorker from "astrojs-service-worker";
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
    MDX(),

    ServiceWorker({
      registration: { autoRegister: false },
      workbox: {
        skipWaiting: false,
        clientsClaim: false,

        // globDirectory: outDir,
        globPatterns: ["**/*.{html,js,css,svg,ttf,woff2,png,jpg,jpeg,wasm,ico,json}"], //
        ignoreURLParametersMatching: [/index\.html\?(.*)/, /\\?(.*)/],
        cleanupOutdatedCaches: true,

        // Define runtime caching rules.
        runtimeCaching: [
          {
            // Match any request that starts with https://api.producthunt.com, https://api.countapi.xyz, https://opencollective.com, etc...
            urlPattern:
              /^https:\/\/((?:api\.producthunt\.com)|(?:api\.countapi\.xyz)|(?:opencollective\.com)|(?:giscus\.bundlejs\.com)|(?:bundlejs\.com\/take-measurement))/,
            // Apply a network-first strategy.
            handler: "NetworkFirst",
            method: "GET",
            options: {
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          },
          {
            // Match any request that ends with .png, .jpg, .jpeg, .svg, etc....
            urlPattern:
              /workbox\-(.*)\.js|\.(?:png|jpg|jpeg|svg|webp|map|wasm|json|ts|css)$|^https:\/\/(?:cdn\.polyfill\.io)/,
            // Apply a stale-while-revalidate strategy.
            handler: "StaleWhileRevalidate",
            method: "GET",
            options: {
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache `monaco-editor` etc...
            urlPattern:
              /chunks\/(.*)$/,
            // Apply a network-first strategy.
            handler: "CacheFirst",
            method: "GET",
            options: {
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          },
        ]
      }
    })
  ],
  vite: {
    server: {
      port: 3000,
      hmr: { port: 3001 }
    },
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