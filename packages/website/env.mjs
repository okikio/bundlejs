export const ENABLE_ALL = Boolean(import.meta?.env?.ENABLE_ALL) ?? true;
export const ENABLE_SW = ENABLE_ALL ?? Boolean(import.meta?.env?.ENABLE_SW) ?? true;
export const USE_SHAREDWORKER = ENABLE_ALL ?? Boolean(import.meta?.env?.USE_SHAREDWORKER) ?? true;
export const PRODUCTION_MODE = ENABLE_ALL ?? Boolean(import.meta?.env?.PRODUCTION_MODE) ?? true;


// ServiceWorker({
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