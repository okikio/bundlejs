import glob from "tiny-glob";
import { unified } from "unified";

import fs from "fs/promises";
import path from "path";

import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";

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

const __dirname = path.resolve(path.dirname(""));
(async () => {
    const plugins = [
        ["rehype-slug"],
        ["rehype-urls", redirectURLs],
        ["rehype-accessible-emojis"],
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
        }],
    ];

    let parser = unified()
        .use(rehypeParse)
        .use(rehypeStringify);

    const loadedRehypePlugins = await Promise.all(loadPlugins(plugins));
    loadedRehypePlugins.forEach(([plugin, opts]) => {
        parser.use(plugin, opts);
    });

    const paths = await glob("docs/**/*.html");
    let result;
    try {
        paths.forEach((p) => {
            (async () => {
                const currentPath = path.join(__dirname, p);
                const content = await fs.readFile(currentPath);
                const vfile = await parser
                    .process(content.toString());
                result = vfile.toString();
                await fs.writeFile(currentPath, result, "utf-8");
            })();
        });
    } catch (err) {
        throw err;
    }
})();