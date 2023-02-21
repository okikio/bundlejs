import { defineConfig } from "astro/config";

import { FileSystemIconLoader } from "unplugin-icons/loaders";
import Icons from "unplugin-icons/vite";

import ServiceWorker from "astrojs-service-worker";
import Sitemap from "@astrojs/sitemap";
import SolidJS from "@astrojs/solid-js";
import Tailwind from "@astrojs/tailwind";
import MDX from "@astrojs/mdx";

const outDir = "./dist";

/**
 * https://github.com/rollup/plugins/blob/master/packages/json/src/index.js
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file at
 * https://github.com/rollup/plugins/blob/master/LICENSE
 */

import { rollup } from "rollup";
import dts from "rollup-plugin-dts";

const SPECIAL_QUERY_RE = /[\?&](?:worker|sharedworker|raw|url)\b/;
const dtsExtRE = /\?dts$/;

// strip UTF-8 BOM
export function stripBomTag(content) {
  if (content.charCodeAt(0) === 0xfeff) {
    return content.slice(1);
  }

  return content;
}

// Based on https://medium.com/@martin_hotell/typescript-library-tips-rollup-your-types-995153cc81c7
// ^ This was a great help
const generateDTS = async (id) => {
  const bundle = await rollup({
    // path to your declaration files root
    input: id, 
    plugins: [dts({
      respectExternal: true
    })],
  });

  const { output } = await bundle.generate({
    file: "dist/js/config.d.ts",
    format: "es"
  });

  const result = output?.[0]?.code;
  return result;
};

function DTS() {
  return {
    name: "vite:dts",
    async transform(dts, id) {
      if (!dtsExtRE.test(id)) return null;
      if (SPECIAL_QUERY_RE.test(id)) return null;

      id = id.replace(dtsExtRE, "");
      dts = stripBomTag(dts);

      try {
        if (!this.meta.watchMode) dts = await generateDTS(id);
        return `export default ${JSON.stringify(dts)}`;
      } catch (e) {
        const errorMessageList = /[\d]+/.exec(e.message);
        const position = errorMessageList && parseInt(errorMessageList[0], 10);
        const msg = position
          ? `, invalid DTS syntax found at line ${position}`
          : ".";
        this.error("Failed to parse DTS file" + msg, e.idx);

        return `export default ${JSON.stringify(dts)}`;
      }
    }
  };
}

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
      // @ts-ignore
      workbox: {
        skipWaiting: false,
        clientsClaim: false,

        // globDirectory: outDir,
        globPatterns: ["**/*.{html,js,css,svg,ttf,woff2,png,webp,jpg,jpeg,wasm,ico,json,xml}"], //
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
              /workbox\-(.*)\.js|\.(?:png|jpg|jpeg|svg|webp|map|ts|wasm|css)$|^https:\/\/(?:cdn\.polyfill\.io)/,
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
              /(?:chunks|assets|favicon|fonts|giscus)\/(.*)$/,
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
    worker: { format: "es" },
    ssr: { external: ["svgo"] },
    plugins: [
      DTS(),
      Icons({
        autoInstall: true,
        compiler: "solid",
        defaultClass: "icon",
        customCollections: {
          // a helper to load icons from the file system
          // files under `./assets/icons` with `.svg` extension will be loaded as it's file name
          // you can also provide a transform callback to change each icon (optional)
          "local": FileSystemIconLoader("./src/icons"),
        },
        iconCustomizer(collection, icon, props) {
          // customize this @iconify icon in this collection
          if (collection === "local") {
            props.width = "24";
            props.height = "24";
            props.viewBox = "0 0 1024 1024";
          }
        },
      })
    ]
  }
});