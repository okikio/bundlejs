---
setup: |
  import Snippets from "./Snippets.astro";
  import ProductHunt from "../ProductHunt.astro";
  import VisitCounter from "./VisitCounter/VisitCounter.astro";
---

> 📑 Official [Docs](https://blog.okikio.dev/documenting-an-online-bundler-bundlejs) for `bundlejs` are now available.

> ✨ Update ✨ [bundlejs.com](https://bundlejs.com) is the new official domain for `bundlejs`.

<Snippets />
  
> **Note** You can also use [bundlesize.com](https://bundlesize.com) to access `bundlejs`.

> Special thanks to [@sheetjs](https://sheetjs.com) and [@daniguardio\_la](https://daniguardio.la/) for donating to `bundle` on [OpenCollective](https://opencollective.com/bundle).


<!-- [👋 00000 visits](https://analytics.bundlejs.com/share/jWI51PxZ/bundle) -->
<div class="flex flex-col py-6 gap-8">
  <VisitCounter />

  <div class="flex justify-center">
    <ProductHunt />
  </div>
</div>