import { animate } from "@okikio/animate";
import { EventEmitter } from "@okikio/emitter";

import { debounce } from "./util/debounce";
import { compressToURL } from '@amoutonbrady/lz-string';

import { ResultEvents, renderComponent, setState } from "./components/SearchResults";

import type { editor as Editor } from "monaco-editor";
import ESBUILD_WORKER_URL from "worker:./workers/esbuild.ts";

const parseInput = (value: string) => {
    const host = "https://api.npms.io";
    let urlScheme = `${host}/v2/search?q=${encodeURIComponent(value)}&size=30`;
    let version = "";

    let exec = /([\S]+)@([\S]+)/g.exec(value);
    if (exec) {
        let [, pkg, ver] = exec;
        version = ver;
        urlScheme = `${host}/v2/search?q=${encodeURIComponent(pkg)}&size=30`;
    }

    return { url: urlScheme, version }
};

// esbuild bundler worker
const timeFormatter = new Intl.RelativeTimeFormat('en', { style: 'narrow', numeric: 'auto' });

let fileSizeEl = document.querySelector(".file-size");
let RunBtn = document.querySelector("#run");
let bundleTime = document.querySelector("#bundle-time");

// @ts-ignore
let count = 0;
let value = "";
let start = Date.now();

const BundleEvents = new EventEmitter();
const WorkerArgs = { name: "esbuild-worker" };
const AdvancedWorker = ("SharedWorker" in globalThis) && new SharedWorker(ESBUILD_WORKER_URL, WorkerArgs);
const BundleWorker = AdvancedWorker?.port || new Worker(ESBUILD_WORKER_URL, WorkerArgs);

let initialized = false;
let bundleFromUrl = () => {
    if (location.search && initialized) {
        const searchParams = (new URL(String(document.location))).searchParams;
        let query = searchParams.get("query") || searchParams.get("q");
        let share = searchParams.get("share");
        let bundle = searchParams.get("bundle");
        if (query || share || bundle) {
            fileSizeEl.textContent = `Wait...`;
            BundleEvents.emit("bundle");
        }
    }
}

let editor: Editor.IStandaloneCodeEditor;
let output: Editor.IStandaloneCodeEditor;
(async () => {
    let loadingContainerEl = Array.from(document.querySelectorAll(".center-container"));
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
    [editor, output] = Monaco.build();

    // Fade away the loading screen
    Fade.play();
    await Fade;

    loadingContainerEl.forEach(x => x?.remove());
    Fade.stop();

    loadingContainerEl = null;
    Fade = null;

    let oldShareLink;
    let generateShareLink = () => {
        if (value == editor?.getValue()) {
            return oldShareLink ?? String(new URL(`/?share=${compressToURL(value)}`, document.location.origin));
        }

        value = `` + editor?.getValue();
        return (oldShareLink = String(new URL(`/?share=${compressToURL(value)}`, document.location.origin)));
    }

    editor.onDidChangeModelContent(debounce((e) => {
        window.history.replaceState({}, '', generateShareLink());
    }, 300));

    const shareBtn = document.querySelector(".btn-share#share") as HTMLButtonElement;
    const shareInput = document.querySelector("#copy-input") as HTMLInputElement;
    shareBtn?.addEventListener("click", () => {
        shareInput.value = generateShareLink();
        shareInput.select();
        document.execCommand("copy");

        let shareBtnValue = shareBtn.innerText;

        shareBtn.innerText = "Copied!";
        setTimeout(() => {
            shareBtn.innerText = shareBtnValue;
        }, 600);
    });

    // Listen to events for the results
    ResultEvents
        .on("add-module", (v) => {
            value = `` + editor?.getValue();
            editor.setValue(value + v + "\n");
        });

    // bundles using esbuild and returns the result
    BundleEvents
        .on("bundle", () => {
            console.log("Bundle")
            value = `` + editor?.getValue();

            fileSizeEl.innerHTML = `<div class="loading"></div>`;
            bundleTime.textContent = ``;

            start = Date.now();
            BundleWorker.postMessage(value);
        });

    bundleFromUrl();

    RunBtn.addEventListener("click", () => {
        BundleEvents.emit("bundle");
    });
})();

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

    const SearchContainerEl = document.querySelector(".search-container") as HTMLElement;
    const SearchResultContainerEl = SearchContainerEl.querySelector(".search-results-container") as HTMLElement;
    if (SearchResultContainerEl) renderComponent(SearchResultContainerEl);

    const clearBtn = document.querySelector(".search .clear");
    clearBtn?.addEventListener("click", () => {
        searchInput.value = "";
        setState([]);
    });
})();

// Bundle Events
BundleEvents.on({
    init() {
        console.log("Initialized");
    },
    ready() {
        console.log("Ready");
        initialized = true;
        fileSizeEl.textContent = `...`;
        bundleFromUrl();
    },
    warn(details) {
        let { type, message } = details;
        console.warn(`${type}\n${message}`);
    },
    error(details) {
        let { type, error } = details;
        console.error(`${type} (please create a new issue in the repo)\n`, error);
        fileSizeEl.textContent = `Error`;
    },
    result(details) {
        let { size, content } = details;
        if (count > 10) {
            console.clear();
            count = 0;
        }

        // let splitInput = value.split("\n");
        // console.groupCollapsed(`${size} =>`, `${splitInput[0]}${splitInput.length > 1 ? "\n..." : ""}`);
        // console.groupCollapsed("Input Code: ");
        // console.log(value);
        // console.groupEnd();
        // console.groupCollapsed("Bundled Code: ");
        // console.log(content);
        // console.groupEnd();
        // console.groupEnd();
        // count++;
        output?.setValue?.(content);

        bundleTime.textContent = `Bundled ${timeFormatter.format((Date.now() - start) / 1000, "seconds")}`;
        fileSizeEl.textContent = `` + size;
    }
});

// Emit bundle events based on WebWorker messages
BundleWorker.addEventListener("message", ({ data }: MessageEvent<{ event: string; details: any }>) => {
    let { event, details } = data;
    BundleEvents.emit(event, details);
});

window.addEventListener('pageshow', function (event) {
    if (AdvancedWorker && !event.persisted) {
        (BundleWorker as MessagePort)?.start?.();
    }
});

window.addEventListener('pagehide', function (event) {
    if (event.persisted === true) {
        console.log('This page *might* be entering the bfcache.');
    } else {
        console.log('This page will unload normally and be discarded.');
        (BundleWorker as MessagePort)?.close?.();
    }
});