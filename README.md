# [bundlejs](https://bundlejs.com)

> ✨ WOOOOOOH!! ✨ The bundlejs api is now out at [deno.bundlejs.com](https://deno.bundlejs.com) and/or [edge.bundlejs.com](https://edge.bundlejs.com), bundle your code and get a badge. 
> 
> Check out the [announcement tweet](https://twitter.com/jsbundle/status/1634455567321255936?s=20)

> I see a badge, you see a badge, we all see badges!!!
> 
> [![spring-easing's badge](https://deno.bundlejs.com/?q=spring-easing&badge=detailed&badge-style=for-the-badge)](https://bundlejs.com/?q=spring-easing)
> 

> To create a badge just replace the domain `bundlejs.com` domain with `deno.bundlejs.com` and add `/?badge`, yeah, that simple

<a href="https://www.producthunt.com/posts/bundle-6?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-bundle-6" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=300568&theme=dark" alt="bundle - An online npm package bundle size checker | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a> [![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/bundle/blob/main/README.md)

A small online tool for checking the minified gzip/brotli size of npm packages.

I used [monaco-editor](https://github.com/microsoft/monaco-editor) for the code-editor, [esbuild](https://github.com/evanw/esbuild) as bundler and treeshaker respectively, [denoflate](https://github.com/hazae41/denoflate) as a wasm port of gzip, [deno\_brotli](https://github.com/denosaurs/deno_brotli) as a wasm port of brotli, [deno\_lz4](https://github.com/denosaurs/deno_lz4) as a wasm port of lz4, [bytes](https://github.com/visionmedia/bytes.js) to convert the compressed size to human readable values, [esbuild-visualizer](https://github.com/btd/esbuild-visualizer) to visualize and analyze your esbuild bundle to see which modules are taking up space, [umami](https://github.com/mikecao/umami) for private, publicly available analytics and general usage stats all without cookies, and [countapi-js](https://github.com/mlomb/countapi-js) to keep track of the number of page visits, in a private and secure way.  
  
This project was greatly influenced by [@hardfists](https://github.com/hardfist) [neo-tools](https://github.com/hardfist/neo-tools) and [@mizchi's](https://github.com/mizchi) [uniroll](https://github.com/mizchi/uniroll) projects.  

**bundlejs** is a quick and easy way to bundle your projects, minify and see it's gzip size. It's an online tool similar to [bundlephobia](https://bundlephobia.com), but **bundle** does all the bundling locally on you browser and can treeshake and bundle multiple packages (both commonjs and esm) together, all without having to install any npm packages and with typescript support.

The project isn't perfect, and I am still working on an autocomplete, hover intellisence, better mobile support and the high memory usage of **esbuild** and **monaco** as well as some edge case packages, e.g. **monaco-editor**.

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it. You can contribute to this project at [okikio/bundle](https://github.com/okikio/bundle).

**bundle** uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the style of commit, and the [Commitizen CLI](http://commitizen.github.io/cz-cli/) to make commits easier.

You can join the discussion on [github discussions](https://github.com/okikio/bundle/discussions).

> Some of bundlejs.com's latest features were inspired by [egoist/play-esbuild](https://github.com/egoist/play-esbuild) and [hyrious/esbuild-repl](https://github.com/hyrious/esbuild-repl), check them out they each use esbuild in different ways.

## URL Queries & Shareable Links

You can now use search queries in **bundle**, all you need to do is add this to the url  
`?q={packages}&treeshake={methods to treeshake}`  

e.g.  
You want `react`, `react-dom`, `vue`, and `@okikio/animate`, but only want the `Animate` and `toStr` methods exported from `@okikio/animate`.  

You would add this to the url [bundlejs.com/?q=react,react-dom,vue,@okikio/animate&treeshake=[\*],[\*],[\*],[{Animate,toStr}]](https://bundlejs.com/?q=react,react-dom,vue,@okikio/animate&treeshake=[*],[*],[*],[{Animate,toStr}])  

If you only want a couple packages and don't care to treeshake, then all you need is something like this, [bundlejs.com?q=react,react-dom,vue,@okikio/animate](https://bundlejs.com/?q=react,react-dom,vue,@okikio/animate)

There is another way to share a reproduciable bundle, the sharable link. Shareble links look like this [/?share=PTAEGEB...](https://bundlejs.com/?share=PTAEGEBsEsGMGtQCUCuA7UAzA9gJ1AC4AWApqAELoAmkJVoA1KALLRrSbR2OgDiAXtAAOQ7kICGCcQHMyAZ2j8SAKBIAPIXgKgAVFlzYAtqABEAAWzxoV7MHHtD4giRMBuIA) with the string value of the input code editor being compressed into a string and placed into the URL. 

In order to create a shareble link, you click the `Share` button, it copies the share url to your clipboard, and from there you can paste where you wish. 

> If you would like to bundle your code when the share URL is loaded, add `bundle` to the url, e.g. [/?bundle&q=@okikio/animate](https://bundlejs.com/?q=@okikio/animate&bundle) or [/?bundle&share=PTAEGEBs...](https://bundlejs.com/?bundle&share=PTAEGEBsEsGMGtQCUCuA7UAzA9gJ1AC4AWApqAELoAmkJVoA1KALLRrSbR2OgDiAXtAAOQ7kICGCcQHMyAZ2j8SAKBIAPIXgKgAVFlzYAtqABEAAWzxoV7MHHtD4giRMBuIA)


## Badges

You can also add bundle badges, they look like this,

[![Open Bundle](./src/assets/badge-light.svg)](https://bundlejs.com/) [![Open Bundle](./src/assets/badge-dark.svg)](https://bundlejs.com/)

All you need to do is to add this to your `README.md`
```md
# Light Mode Badge 
[![Open Bundle](https://bundlejs.com/badge-light.svg)](https://bundlejs.com/)

# Dark Mode Badge 
[![Open Bundle](https://bundlejs.com/badge-dark.svg)](https://bundlejs.com/)
```

Another options is to use the API, e.g.

[![spring-easing's badge](https://deno.bundlejs.com/?q=spring-easing&badge=detailed&badge-style=for-the-badge)](https://bundlejs.com/?q=spring-easing)

```md
[![spring-easing's badge](https://deno.bundlejs.com/?q=spring-easing&badge=detailed&badge-style=for-the-badge)](https://bundlejs.com/?q=spring-easing)
```

You can use the [URL Queries & Shareable Links](#url-queries--shareable-links) above, to create unique bundles, when users clicks on the badge.


## Backers & Sponsors

Backers & Sponsors are awesome people and organizations who use, enjoy, and donate to the project. The list of backers who love and support this project are,

<!---
<a href="https://opencollective.com/bundle"><img src="https://opencollective.com/bundle/individuals.svg?width=890"></a>
<a href="https://opencollective.com/bundle"><img src="https://opencollective.com/bundle/organizations.svg?width=890"></a>
<object type="image/svg+xml" data="https://opencollective.com/collective/tiers/backers.svg?avatarHeight=36&width=600"></object>
-->

<a href="https://upstash.com?utm_source=github&utm_medium=github&utm_campaign=bundlejs">
  <img src="./src/assets/sponsors/upstash-long.svg" height="64" />
</a>

<a href="https://vercel.com?utm_source=github&utm_medium=github&utm_campaign=bundlejs">
  <img src="./src/assets/sponsors/vercel-long.svg" height="64" />
</a>

<a href="https://sheetjs.com/?utm_source=opencollective&utm_medium=github&utm_campaign=bundle"><img src="https://opencollective.com/bundle/organization/0/avatar.svg?avatarHeight=128"></a>
<a href="https://opencollective.com/bundle/individuals/0/website"><img src="https://opencollective.com/bundle/individuals/0/avatar.svg"></a>
<a href="https://opencollective.com/bundle/organization/1/website"><img src="https://opencollective.com/bundle/organization/1/avatar.svg"></a>