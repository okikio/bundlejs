---
title: Usage
id: usage
priority: 0
---
When bundling packages that also export CSS and other external files, [bundlejs](https://bundlejs.com) now checks the gzip/brotli size of these external files, even though it won't output any code. Keep this in mind this isn't a bug, however, if it causes confusion I am willing to change this behaviour.

Treeshaking is available, but not all CDNs support access to each packages package.json so there might be slight package version conflicts. The only verified CDN with access to the package.json is [unpkg.com](https://unpkg.com).

Check the console for error messages and warnings.

You can use custom protocols to specify which CDN the module should come from.

* esm.run:react -> [https://esm.run/react](https://esm.run/react)
* esm.sh:react -> [https://cdn.esm.sh/react](https://cdn.esm.sh/react)
* esm:react -> [https://cdn.esm.sh/react](https://cdn.esm.sh/react)
* skypack:react -> [https://cdn.skypack.dev/react](https://cdn.skypack.dev/react)
* unpkg:react -> [https://unpkg.com/react](https://unpkg.com/react)
* deno:preact -> [https://deno.land/x/preact](https://deno.land/x/preact)
* jsdelivr:react -> [https://cdn.jsdelivr.net/npm/react](https://cdn.jsdelivr.net/npm/react)
* jsdelivr.gh:.../react-dom/index.js -> [https://cdn.jsdelivr.net/gh/.../react-dom/index.js](https://cdn.jsdelivr.net/gh/facebook/react/packages/react-dom/index.js)
* github:.../react/index.js -> [https://raw.githubusercontent.com/.../react/index.js](https://raw.githubusercontent.com/facebook/react/main/packages/react/index.js)

e.g.

```ts
import { toStr } from "skypack:@okikio/animate";
// or
export * from "esm:@okikio/animate";
// or
export { animate } from "https://cdn.skypack.dev/@okikio/animate";
```

\* If an error occurs try using a different CDN, by default **bundlejs** uses [unpkg.com](https://unpkg.com) but you can use the others.

\* For some packages an error occurs where the default export is excluded from the treeshaken bundle, the solution for this is to manually include the default export like so,

```ts
export * from "solid-dismiss";
// and
export { default } from "solid-dismiss";
```
