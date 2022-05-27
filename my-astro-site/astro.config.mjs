import { defineConfig } from "astro/config";
import serviceWorker from 'astro-service-worker';

import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';

import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import { outDir } from "./shared.config.js";

// https://astro.build/config
export default defineConfig({
  outDir,
  build: {
    // Example: Generate `page.html` instead of `page/index.html` during build.
    format: "file",
  },
  site: "https://bundlejs.com",
  markdown: {
    // remarkPlugins: [],
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "github-dark",
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: false,
    },
  },
  integrations: [
    solid(),
    tailwind({
      config: { applyBaseStyles: false },
    }),
    sitemap(),
    // serviceWorker({
    //   workbox: {
    //       globDirectory: destFolder,
    //       globPatterns: [
    //           "**/*.{html,js,css}",
    //           "/js/*.ttf",
    //           "/favicon/*.svg",
    //           "!/js/index.min.css",
    //       ],

    //       ignoreURLParametersMatching: [/index\.html\?(.*)/, /\\?(.*)/],
    //       cleanupOutdatedCaches: true,

    //       // Define runtime caching rules.
    //       runtimeCaching: [
    //           {
    //               // Match any request that starts with https://api.producthunt.com, https://api.countapi.xyz, https://opencollective.com, etc...
    //               urlPattern:
    //                   /^https:\/\/((?:api\.producthunt\.com)|(?:api\.countapi\.xyz)|(?:opencollective\.com)|(?:discus\.bundlejs\.com)|(?:analytics\.bundlejs\.com))/,

    //               // Apply a network-first strategy.
    //               handler: "NetworkFirst",
    //               method: "GET",
    //               options: {
    //                 cacheableResponse: {
    //                   statuses: [0, 200]
    //                 },
    //               }
    //           },
    //           {
    //               // Match any request that ends with .png, .jpg, .jpeg, .svg, etc....
    //               urlPattern:
    //                   /workbox\-(.*).js|\.(?:png|jpg|jpeg|svg|webp|map|wasm|json|ts|css)$|^https:\/\/(?:cdn\.polyfill\.io)/,

    //               // Apply a stale-while-revalidate strategy.
    //               handler: "StaleWhileRevalidate",
    //               method: "GET",
    //               options: {
    //                   cacheableResponse: {
    //                       statuses: [0, 200]
    //                   }
    //               }
    //           },
    //         ]
    //   }
    // })
  ],
  vite: {
    ssr: {
      external: ["svgo"]
    },
    plugins: [
      AutoImport({
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
            extension: 'tsx',
          }),
        ],
      }),
      Icons({
        // expiremental
        autoInstall: true,
        compiler: 'solid',
        defaultClass: "icon"
      })
    ],
  },
});
