---
layout: ../layouts/ContentLayout.astro
title: FAQ - bundlejs
description: Frequently Asked Questions. I frequently get asked what was the point in building bundlejs, this is a short, quick, and simple summary of frequently asked questions and my reasons for building bundlejs.
---
## FAQ

I frequently get asked what was the point in building bundlejs, this is a short, quick, and simple summary of frequently asked questions and my reasons for building bundlejs.


### What is the advantage over [bundlephobia](https://bundlephobia.com)?

There are a couple reasons for this, but the main one is that `bundlephobia` wasn't reliable enough.


### What do you mean wasn't reliable enough?

Right now `bundlephobia`, is a bit hit or miss when it comes to treeshaking. So, I built **bundlejs.com**, which can treeshake bundles accurately.  
  
For example, try treeshaking the `Event` class from `@okikio/emitter` using [bundlephobia](https://bundlephobia.com/package/@okikio/emitter) and try treeshaking the `Event` class using [bundlejs.com](/?bundle&q=@okikio/emitter&treeshake=Event). 

```ts
export { Event } from "@okikio/emitter"; 
``` 

will notice a major package size disparity. This is only one example and I am sure others exist, I hope the above example illustrates my point.  
Another problem with `bundlephobia` is the lack of good error reporting if (for whatever reason) `bundlephobia` isn't able to bundle your package, it logs this to the console, 

```ts
{
    "code": "BuildError",
    "message": "Failed to build this package.",
    "details": {
        "name": "BuildError"
    }
} 
```

this just isn't very useful for debugging.  


On the other hand, since, `bundlejs.com` runs locally right on your computer, when an error occurs it logs the exact error you would see when using [esbuild](https://esbuild.github.io/) or other bundlers in your build process, making it much easier to know exactly what is wrong with your js bundle.

  

### Wait, locally as in no external servers?

Yes, locally right on your browser, I used [esbuild-wasm](https://esbuild.github.io/getting-started/#wasm) for the main bundler and [rollup](https://rollupjs.org/guide/en/) for more accurate treeshaking.

  

### Can it bundle multiple packages and treeshake them?

Yes. `bundlejs.com` can treeshake all packages, and it can do so accurately.