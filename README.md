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
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1631 472" width="128"><path fill="#00E9A3" d="M.42 412.98c78.1 78.1 204.74 78.1 282.84 0 78.1-78.11 78.1-204.74 0-282.85l-35.35 35.36c58.58 58.58 58.58 153.55 0 212.13-58.58 58.58-153.55 58.58-212.13 0L.42 412.98Z" /><path fill="#00E9A3" d="M71.13 342.26c39.06 39.06 102.37 39.06 141.42 0 39.06-39.05 39.06-102.36 0-141.42L177.2 236.2a50 50 0 0 1-70.71 70.7l-35.36 35.36Z"/><path fill="#00E9A3" d="M353.97 59.42c-78.1-78.1-204.73-78.1-282.84 0-78.1 78.1-78.1 204.74 0 282.84l35.36-35.35c-58.58-58.58-58.58-153.56 0-212.13 58.58-58.58 153.55-58.58 212.13 0l35.35-35.36Z"/><path fill="#00E9A3" d="M283.26 130.13c-39.05-39.05-102.37-39.05-141.42 0-39.05 39.06-39.05 102.37 0 141.42l35.36-35.35a50 50 0 0 1 70.7-70.71l35.36-35.36Z"/><path fill="#fff" fill-opacity=".8" d="M353.97 59.42c-78.1-78.1-204.73-78.1-282.84 0-78.1 78.1-78.1 204.74 0 282.84l35.36-35.35c-58.58-58.58-58.58-153.56 0-212.13 58.58-58.58 153.55-58.58 212.13 0l35.35-35.36Z"/><path fill="#fff" fill-opacity=".8" d="M283.26 130.13c-39.05-39.05-102.37-39.05-141.42 0-39.05 39.06-39.05 102.37 0 141.42l35.36-35.35a50 50 0 0 1 70.7-70.71l35.36-35.36Z"/><path fill="#fff" d="M588.11 264.18c0 24.93-17.79 37.29-34.83 37.29-18.54 0-30.9-13.1-30.9-33.88v-98.23h-38.56v104.2c0 39.3 22.37 61.57 54.54 61.57 24.5 0 41.76-12.89 49.22-31.21h1.7V333h37.4V169.36H588.1v94.82Zm72.23 130.18h38.56v-87.14h1.6c6.07 11.93 18.75 28.66 46.87 28.66 38.57 0 67.44-30.58 67.44-84.48 0-54.55-29.72-84.17-67.54-84.17-28.87 0-40.91 17.37-46.77 29.2h-2.24v-27.07h-37.92v225Zm37.81-143.18c0-31.75 13.64-52.3 38.46-52.3 25.68 0 38.89 21.83 38.89 52.3 0 30.68-13.42 53.06-38.89 53.06-24.6 0-38.46-21.31-38.46-53.06Zm273.02-38.56c-5.33-27.7-27.49-45.39-65.84-45.39-39.42 0-66.26 19.4-66.16 49.65-.1 23.86 14.6 39.63 46.02 46.13l27.92 5.86c15.02 3.3 22.05 9.37 22.05 18.64 0 11.19-12.15 19.6-30.47 19.6-17.69 0-29.19-7.67-32.5-22.37l-37.6 3.62c4.8 30.04 30.04 47.84 70.2 47.84 40.92 0 69.79-21.2 69.9-52.2-.11-23.34-15.14-37.61-46.03-44.32l-27.91-5.97c-16.62-3.73-23.23-9.48-23.12-18.96-.1-11.08 12.14-18.75 28.23-18.75 17.8 0 27.17 9.7 30.15 20.45l35.16-3.83Zm111.02-43.26h-32.27v-39.2h-38.57v39.2h-23.23v29.83h23.23v90.98c-.21 30.8 22.16 45.92 51.14 45.07 10.97-.32 18.53-2.45 22.69-3.84l-6.5-30.15a47.6 47.6 0 0 1-11.29 1.5c-9.7 0-17.47-3.42-17.47-18.97V199.2h32.27v-29.83Zm73.35 166.94c25.67 0 41.01-12.04 48.04-25.78h1.28V333h37.08V223.48c0-43.25-35.27-56.25-66.48-56.25-34.41 0-60.83 15.34-69.36 45.17l36.01 5.12c3.84-11.19 14.7-20.78 33.56-20.78 17.9 0 27.7 9.16 27.7 25.25v.64c0 11.08-11.61 11.61-40.48 14.7-31.75 3.41-62.11 12.9-62.11 49.75 0 32.18 23.54 49.22 54.76 49.22Zm10.01-28.34c-16.09 0-27.59-7.35-27.59-21.51 0-14.81 12.89-21 30.15-23.44 10.12-1.39 30.36-3.94 35.37-8v19.29c0 18.22-14.71 33.66-37.93 33.66Zm238.5-95.34c-5.33-27.7-27.49-45.39-65.84-45.39-39.42 0-66.27 19.4-66.16 49.65-.11 23.86 14.6 39.63 46.02 46.13l27.92 5.86c15.02 3.3 22.05 9.37 22.05 18.64 0 11.19-12.15 19.6-30.47 19.6-17.69 0-29.19-7.67-32.49-22.37l-37.61 3.62c4.79 30.04 30.04 47.84 70.21 47.84 40.9 0 69.78-21.2 69.88-52.2-.1-23.34-15.13-37.61-46.02-44.32l-27.91-5.97c-16.62-3.73-23.23-9.48-23.12-18.96-.11-11.08 12.14-18.75 28.23-18.75 17.79 0 27.17 9.7 30.15 20.45l35.16-3.83Zm67.88 24.5c0-23.65 14.7-37.29 35.37-37.29 20.24 0 32.17 12.9 32.17 34.95V333h38.57V228.81c0-39.52-22.38-61.58-56.36-61.58-25.14 0-41.12 11.4-48.69 29.94h-1.91v-82.35h-37.72V333h38.57v-95.88Z"/></svg>
</a>

<a href="https://vercel.com?utm_source=github&utm_medium=github&utm_campaign=bundlejs">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 284 65" width="128"><path d="M141.68 16.25c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42a11.44 11.44 0 0 1-8.54 3.5c-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm117.14-14.5c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42a11.44 11.44 0 0 1-8.54 3.5c-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm-39.03 3.5c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9v-46h9zM37.59.25l36.95 64H.64l36.95-64zm92.38 5-27.71 48-27.71-48h10.39l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10v14.8h-9v-34h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"/></svg>
</a>

<a href="https://sheetjs.com/?utm_source=opencollective&utm_medium=github&utm_campaign=bundle"><img src="https://opencollective.com/bundle/organization/0/avatar.svg?avatarHeight=128"></a>
<a href="https://opencollective.com/bundle/individuals/0/website"><img src="https://opencollective.com/bundle/individuals/0/avatar.svg"></a>
<a href="https://opencollective.com/bundle/organization/1/website"><img src="https://opencollective.com/bundle/organization/1/avatar.svg"></a>