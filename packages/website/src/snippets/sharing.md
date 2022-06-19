---
title: Sharing
id: sharing
priority: 1
setup: |
  import Details from "../components/Details.tsx";
  import Anchor from "../components/Anchor.astro";
---

You can now use search queries in **bundlejs**, all you need to do is add this to the url  
`?q={packages}&treeshake={methods to treeshake}`  
  
e.g.  
You want `react`, `react-dom`, `vue`, and `@okikio/animate`, but only want the `Animate` and `toStr` methods exported from `@okikio/animate`.  
  
You would add this to the url [`?q=react,react-dom,vue,@okikio/animate&treeshake=[*],[*],[*],[&#123;Animate,toStr&#125;]`](/?q=react,react-dom,vue,@okikio/animate&treeshake=[*],[*],[*],[&#123;Animate,toStr&#125;])
  
If you only want a couple packages and don't care to treeshake, then all you need is something like this, [?q=react,react-dom,vue,@okikio/animate](/?q=react,react-dom,vue,@okikio/animate) . There is another way to share a reproduciable bundle, the sharable link. Shareble links look like this [/?share=PTAEGEBs...](/?share=PTAEGEBsEsGMGtQCUCuA7UAzA9gJ1AC4AWApqAELoAmkJVoA1KALLRrSbR2OgDiAXtAAOQ7kICGCcQHMyAZ2j8SAKBIAPIXgKgAVFlzYAtqABEAAWzxoV7MHHtD4giRMBuIA) with the string value of the input code editor being compressed into a string and placed into the URL.  
  
In order to create a shareble link, you click the `Share` button, it copies the share url to your clipboard, and from there you can paste where you wish.  
  
<!-- 
**Auto-bundling shared URL's**

If you would like to bundle your code when the share URL is loaded, add `bundle` to the url, e.g. [/?bundle&q=@okikio/animate](/?q=@okikio/animate&bundle) or [/?bundle&share=PTAEGEBs...](/?bundle&share=PTAEGEBsEsGMGtQCUCuA7UAzA9gJ1AC4AWApqAELoAmkJVoA1KALLRrSbR2OgDiAXtAAOQ7kICGCcQHMyAZ2j8SAKBIAPIXgKgAVFlzYAtqABEAAWzxoV7MHHtD4giRMBuIA) -->

<Details
  class="inline-details bg-white border border-gray-300 dark:bg-elevated dark:border-gray-700 rounded-md"
  summary="Auto-bundling shared URL's"
  >

<!-- client:load -->

  If you would like to bundle your code when the share URL is loaded, add <code>bundle</code> to the url, e.g. <Anchor href="/?q=@okikio/animate&amp;bundle">/?bundle&q=@okikio/animate</Anchor> or <Anchor href="/?bundle&amp;share=PTAEGEBsEsGMGtQCUCuA7UAzA9gJ1AC4AWApqAELoAmkJVoA1KALLRrSbR2OgDiAXtAAOQ7kICGCcQHMyAZ2j8SAKBIAPIXgKgAVFlzYAtqABEAAWzxoV7MHHtD4giRMBuIA">/?bundle&share=PTAEGEBs...</Anchor>

</Details>