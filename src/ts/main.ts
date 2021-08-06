import { importShim } from "./util/dynamic-import";
import * as Default from "./modules/default";

import { animate } from "@okikio/animate";
import { hit } from "countapi-js";

import type { editor as Editor } from "monaco-editor";

let loadingContainerEl = document.querySelector(".center-container");
let fileSizeEl = document.querySelector(".file-size");
let RunBtn = document.querySelector("#run");
let bundleTime = document.querySelector("#bundle-time");
let Fade = animate({
    target: loadingContainerEl,
    opacity: [1, 0],
    delay: 1000,
    easing: "ease-in",
    duration: 500,
    autoplay: false
});

let editor: Editor.IStandaloneCodeEditor;

// The default navbar, etc... that is needed
Default.build();

// countapi-js hit counter. It counts the number of time the website is loaded
// (async () => {
//     try {
//         let { value } = await hit('bundle.js.org', 'visits');
//         let visitCounterEl = document.querySelector("#visit-counter");
//         if (visitCounterEl) visitCounterEl.textContent = `(${value} Page Visits)`;
//     } catch (err) {
//         console.warn("Visit Counter Error (please create a new issue in the repo)", err);
//     }
// })();

// Monaco Code Editor
(async () => {
    let Monaco = await import("./modules/monaco");
    editor = Monaco.build();

    // Fade away the loading screen
    Fade.play();
    await Fade;

    loadingContainerEl?.remove();
    Fade.stop();

    loadingContainerEl = null;
    Fade = null;
})();

// SarchResults solidjs component
(async () => {
    const searchInput = document.querySelector(".search input") as HTMLInputElement;
    const host = "https://registry.npmjs.com/";
    const parseInput = (input: string) => {
        let value = input; // sanitize
        let exec = /([\S]+)@([\S]+)/g.exec(value);
        let search = `${value}`.replace(/^@/, "");
        let urlScheme = `${host}/-/v1/search?text=${search}&size=10&boost-exact=false`;
        let version = "";

        if (exec) {
            let [, pkg, ver] = exec;
            version = ver;
            urlScheme = `${host}/-/v1/search?text=${pkg}&size=10&boost-exact=false`;
        }

        return { url: urlScheme, version }
    };

    let canSearch = true;
    searchInput?.addEventListener?.("input", () => {
        if (canSearch) {
            canSearch = false;

            // Set a timeout to debounce the keyup event
            requestAnimationFrame(() => {
                let { value } = searchInput;
                let { url, version } = parseInput(value);

                (async () => {
                    let response = await fetch(url);
                    let result = await response.json();
                    setState(
                        result.objects.map(obj => {
                            const { name, description, date, publisher } = obj.package;
                            return {
                                name, description,
                                date, version,
                                author: publisher.username
                            };
                        })
                    );
                })();

                canSearch = true;
            });
        }
    });

    const { renderComponent, setState, Emitter } = await import("./components/SearchResults");
    renderComponent(document.querySelector(".search-results-container"));

    Emitter.on("add-module", (v) => {
        let value = `` + editor?.getValue();
        editor.setValue(value + "\n" + v);
    });

    let clearBtn = document.querySelector(".search .clear");
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        setState([]);
    });
})();

// highlight.js for code highlighting
(async () => {
    let { hljs } = await import("./modules/highlightjs");
    hljs.highlightAll();
})();

// esbuild bundler worker
import ESBUILD_WORKER_URL from "worker:./workers/esbuild.ts";

(() => {
    let timeFormatter = new Intl.RelativeTimeFormat('en', { style: 'narrow', numeric: 'auto' });

    // @ts-ignore
    let BundleWorker = new Worker(ESBUILD_WORKER_URL, {
        name: "esbuild-worker",
        type: "module"
    });

    let count = 0;
    let value = "";
    let start = Date.now();

    RunBtn.addEventListener("click", () => {
        value = `` + editor?.getValue();

        fileSizeEl.innerHTML = `<div class="loading"></div>`;
        bundleTime.textContent = ``;

        start = Date.now();
        BundleWorker.postMessage(value);
    });

    BundleWorker.onmessage = ({ data }) => {
        if (data.warn) {
            console.warn(data.type + " \n", data.warn);
            fileSizeEl.textContent = `Try Again`;
            return;
        }

        if (data.error) {
            console.error(data.type + " (please create a new issue in the repo)\n", data.error);
            fileSizeEl.textContent = `Error`;
            return;
        }

        let { size, content } = data.value;

        if (count > 10) {
            console.clear();
            count = 0;
        }

        let splitInput = value.split("\n");
        console.groupCollapsed(`${size} =>`, `${splitInput[0]}${splitInput.length > 1 ? "\n..." : ""}`);
        console.groupCollapsed("Input Code: ");
        console.log(value);
        console.groupEnd();
        console.groupCollapsed("Bundled Code: ");
        console.log(content);
        console.groupEnd();
        console.groupEnd();
        count++;

        bundleTime.textContent = `Bundled ${timeFormatter.format((Date.now() - start) / 1000, "seconds")}`;
        fileSizeEl.textContent = `` + size;
    };
})();