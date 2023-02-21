import glob from "tiny-glob";
import fs from "fs/promises";

import path from "path";

import { rehype } from "rehype";
import { h, s } from "hastscript";

export function redirectURLs(url) {
  if (/^\/docs/.test(url.path)) {
    return url.path.replace(/^\/docs\//, "/").replace(/\.md$/, "");
  } else if (/\.md$/.test(url.path)) {
    return url.path.replace(/\.md$/, "");
  } else if (/LICENSE$/i.test(url.path)) {
    return "https://github.com/okikio/bundlejs/tree/main/LICENSE";
  }
}

async function importPlugin(p) {
  if (typeof p === "string") {
    return await import(p);
  }

  return await p;
}

export function loadPlugins(items) {
  return items.map((p) => {
    return new Promise((resolve, reject) => {
      if (Array.isArray(p)) {
        const [plugin, opts] = p;
        return importPlugin(plugin)
          .then((m) => resolve([m.default, opts]))
          .catch((e) => reject(e));
      }

      return importPlugin(p)
        .then((m) => resolve([m.default]))
        .catch((e) => reject(e));
    });
  });
}

(async () => {
  const parser = rehype();
  parser.use(await Promise.all(
    loadPlugins([
      ["rehype-slug"],
      ["rehype-urls", redirectURLs],
      ["rehype-external-links", {
        target: "_blank",
        rel: ["noopener"],
        content: [
          // Based on the external icon from https://www.gitpod.io/blog/workspace-networking
          h("span.external-icon", [
            s("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "10",
              height: "10",
              viewBox: "0 0 14 14",
              fill: "none",
            }, [
              s("path", {
                d: "M1 13L13 1m0 0H5m8 0v7",
                "stroke": "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
              }),
            ]),
          ]),
          // `<span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1m0 0H5m8 0v7" stroke="#1155cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
        ],
      }]
    ])
  ));

  // const __dirname = path.resolve(path.dirname(""));
  // const currentPath = path.join(__dirname, p);
  
  const paths = await glob("packages/website/dist/docs/**/*.html");
  const allResults = await Promise.allSettled(
    paths.map(async (currentPath) => {
      const content = await fs.readFile(currentPath);
      const vfile = await parser.process(content.toString());
      const result = vfile.toString();

      return await fs.writeFile(currentPath, result, "utf-8");
    })
  );

  allResults.forEach(result => {
    if (result.status == "rejected")
      throw result.reason;
  });
})();