# bundle

<a href="https://www.producthunt.com/posts/bundle-6?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-bundle-6" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=300568&theme=dark" alt="bundle - An online npm package bundle size checker | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a> [![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/bundle/blob/main/README.md)

A small online tool for checking the gzipped and minified size of npm packages.

I used [monaco-editor](https://github.com/microsoft/monaco-editor) for the code-editor, [esbuild](https://github.com/evanw/esbuild) and [rollup](https://github.com/rollup/rollup) as bundler and treeshaker respectively, [pako](https://github.com/nodeca/pako) as a js port of the zlib and gzip libraries, [pretty-bytes](https://github.com/sindresorhus/pretty-bytes) to convert the gzip size to human readable values, and [countapi-js](https://github.com/mlomb/countapi-js) to keep track of the number of page visits, in a private and secure way.

This project was greatly influenced by hardfists [neo-tools](https://github.com/hardfist/neo-tools) and mizchi's [uniroll](https://github.com/mizchi/uniroll) project.

**bundle** is a quick and easy way to bundle your projects, minify and see it's gzip size. It's an online tool similar to [bundlephobia](https://bundlephobia.com), but **bundle** does all the bundling locally on you browser and can treeshake and bundle multiple packages (both commonjs and esm) together, all without having to install any npm packages and with typescript support.

The project isn't perfect, and I am still working on an autocomplete, hover intellisence, better mobile support and the high memory usage of **esbuild** and **monaco** as well as some edge case packages, e.g. **monaco-editor**.

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it. You can contribute to this project at [okikio/bundle](https://github.com/okikio/bundle).

**bundle** uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the style of commit, and the [Commitizen CLI](http://commitizen.github.io/cz-cli/) to make commits easier.

You can join the discussion on [github discussions](https://github.com/okikio/bundle/discussions).

## URL Queries & Shareable Links

You can now use search queries in **bundle**, all you need to do is add this to the url  
`?q={packages}&treeshake={methods to treeshake}`  

e.g.  
You want `react`, `react-dom`, `vue`, and `@okikio/animate`, but only want the `Animate` and `toStr` methods exported from `@okikio/animate`.  

You would add this to the url [bundle.js.org/?q=react,react-dom,vue,@okikio/animate&treeshake=[\*],[\*],[\*],[Animate,toStr]](https://bundle.js.org/?q=react,react-dom,vue,@okikio/animate&treeshake=[*],[*],[*],[Animate,toStr])  

If you only want a couple packages and don't care to treeshake, then all you need is something like this, [bundle.js.org?q=react,react-dom,vue,@okikio/animate](https://bundle.js.org/?q=react,react-dom,vue,@okikio/animate)

There is another way to share a reproduciable bundle, the sharable link. Shareble links look like this [/?share=PTAEGEBsEsGMGtQCUCuA7UAzA9gJ1AC4AWApqAELoAmkJVoA1KALLRrSbR2OgDiAXtAAOQ7kICGCcQHMyAZ2j8SAKBIAPIXgKgAVFlzYAtqABEAAWzxoV7MHHtD4giRMBuIA](https://bundle.js.org/?share=PTAEGEBsEsGMGtQCUCuA7UAzA9gJ1AC4AWApqAELoAmkJVoA1KALLRrSbR2OgDiAXtAAOQ7kICGCcQHMyAZ2j8SAKBIAPIXgKgAVFlzYAtqABEAAWzxoV7MHHtD4giRMBuIA) with the string value of the input code editor being compressed into a string and placed into the URL. 

In order to create a shareble link, you click the `Share` button, it copies the share url to your clipboard, and from there you can paste where you wish. 


## Badges

You can also add bundle badges, they look like this,

[![Open Bundle](./src/assets/bundle-badge-light.svg)](https://bundle.js.org/) [![Open Bundle](./src/assets/bundle-badge-dark.svg)](https://bundle.js.org/)

All you need to do is to add this to your `README.md`
```md
# Light Mode Badge 
[![Open Bundle](https://bundle.js.org/bundle-badge-light.svg)](https://bundle.js.org/)

# Dark Mode Badge 
[![Open Bundle](https://bundle.js.org/bundle-badge-dark.svg)](https://bundle.js.org/)
```

You can use the [URL Queries & Shareable Links](#url-queries--shareable-links) above, to create unique bundles, when users clicks on the badge.
