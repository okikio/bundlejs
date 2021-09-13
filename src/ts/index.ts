import { animate } from "@okikio/animate";
import { debounce } from "./util/debounce";

import type { editor as Editor } from "monaco-editor";
import ESBUILD_WORKER_URL from "worker:./workers/esbuild.ts";

const parseInput = (value: string) => {
    const host = "https://api.npms.io";
    let urlScheme = `${host}/v2/search?q=${encodeURIComponent(value)}&size=10`;
    let version = "";

    let exec = /([\S]+)@([\S]+)/g.exec(value);
    if (exec) {
        let [, pkg, ver] = exec;
        version = ver;
        urlScheme = `${host}/v2/search?q=${encodeURIComponent(pkg)}&size=10`;
    }

    return { url: urlScheme, version }
};

// SarchResults solidjs component
(async () => {
    const searchInput = document.querySelector(".search input") as HTMLInputElement;
    searchInput?.addEventListener?.("keydown", debounce(() => {
        let { value } = searchInput;
        if (value.length <= 0) return;

        let { url, version } = parseInput(value);

        (async () => {
            let response = await fetch(url);
            let result = await response.json();
            setState(
                // result.objects
                result?.results.map(obj => {
                    const { name, description, date, publisher } = obj.package;
                    return {
                        name, description,
                        date, version,
                        author: publisher.username
                    };
                }) ?? []
            );
        })();
    }, 125));

    const { renderComponent, setState } = await import("./components/SearchResults");
    const SearchContainerEl = document.querySelector(".search-container") as HTMLElement;
    const SearchResultContainerEl = SearchContainerEl.querySelector(".search-results-container") as HTMLElement;
    if (SearchResultContainerEl) renderComponent(SearchResultContainerEl);

    const clearBtn = document.querySelector(".search .clear");
    clearBtn?.addEventListener("click", () => {
        searchInput.value = "";
        setState([]);
    });
})();

// esbuild bundler worker
const timeFormatter = new Intl.RelativeTimeFormat('en', { style: 'narrow', numeric: 'auto' });

let fileSizeEl = document.querySelector(".file-size");
let RunBtn = document.querySelector("#run");
let bundleTime = document.querySelector("#bundle-time");

// @ts-ignore
const BundleWorker = new Worker(ESBUILD_WORKER_URL, {
    name: "esbuild-worker",
    // type: "module"
});
   
let count = 0; 
let value = "";
let start = Date.now();
BundleWorker.onmessage = ({ data }) => {
    if (data.warn) {
        console.warn(data.warn + " \n");
        return;
    }

    if (data.ready) {
        fileSizeEl.textContent = `...`;
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

let editor: Editor.IStandaloneCodeEditor;
(async () => {
    let loadingContainerEl = document.querySelector(".center-container");
    let Fade = animate({
        target: loadingContainerEl,
        opacity: [1, 0],
        delay: 1000,
        easing: "ease-in",
        duration: 500,
        autoplay: false
    });

    // Monaco Code Editor
    let Monaco = await import("./modules/monaco");
    editor = Monaco.build();

    // Fade away the loading screen
    Fade.play();
    await Fade;

    loadingContainerEl?.remove();
    Fade.stop();

    loadingContainerEl = null;
    Fade = null;

    RunBtn.addEventListener("click", () => {
        value = `` + editor?.getValue();
    
        fileSizeEl.innerHTML = `<div class="loading"></div>`;
        bundleTime.textContent = ``;
    
        start = Date.now();
        BundleWorker.postMessage(value);
    });
    
    const { Emitter } = await import("./components/SearchResults");
    Emitter.on("add-module", (v) => {
        let value = `` + editor?.getValue();
        editor.setValue(value + "\n" + v);
    });
})();

