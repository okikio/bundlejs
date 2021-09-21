import { animate } from "@okikio/animate";
import { EventEmitter } from "@okikio/emitter";

import { debounce } from "./util/debounce";
import { compressToURL } from "@amoutonbrady/lz-string";

import {
    ResultEvents,
    renderComponent,
    setState,
} from "./components/SearchResults";

import type { editor as Editor } from "monaco-editor";
import ESBUILD_WORKER_URL from "worker:./workers/esbuild.ts";
import WebWorker from "./util/WebWorker";

const BundleEvents = new EventEmitter();

let fileSizeEl = document.querySelector(".file-size");
let RunBtn = document.querySelector("#run");
let bundleTime = document.querySelector("#bundle-time");

let value = "";
let start = Date.now();
let initialized = false;

let editor: Editor.IStandaloneCodeEditor;
let output: Editor.IStandaloneCodeEditor;

const WorkerArgs = { name: "esbuild-worker" };
const timeFormatter = new Intl.RelativeTimeFormat("en", {
    style: "narrow",
    numeric: "auto",
});

let  monacoLoadedFirst = false;

// Bundle Events
BundleEvents.on({
    loaded() {
        monacoLoadedFirst = true;

        if (initialized)
            BundleEvents.emit("ready");
    },
    init() {
        console.log("Initalized");
        initialized = true;
        fileSizeEl.textContent = `...`;

        if (monacoLoadedFirst)
            BundleEvents.emit("ready");
    },
    ready() {
        console.log("Ready");
        if (location.search) {
            const searchParams = new URL(String(document.location))
                .searchParams;
            let plaintext = searchParams.get("text");
            let query = searchParams.get("query") || searchParams.get("q");
            let share = searchParams.get("share");
            let bundle = searchParams.get("bundle");
            if (query || share || bundle || plaintext) {
                fileSizeEl.textContent = `Wait...`;
                BundleEvents.emit("bundle");
            }
        }
    },
    warn(details) {
        let { type, message } = details;
        console.warn(`${type}\n${message}`);
    },
    error(details) {
        let { type, error } = details;
        console.error(
            `${type} (please create a new issue in the repo)\n`,
            error
        );
        fileSizeEl.textContent = `Error`;
    },
    result(details) {
        let { size, content } = details;

        output?.setValue?.(content);
        bundleTime.textContent = `Bundled ${timeFormatter.format(
            (Date.now() - start) / 1000,
            "seconds"
        )}`;
        fileSizeEl.textContent = `` + size;
    },
});

(async () => {
    let loadingContainerEl = Array.from(
        document.querySelectorAll(".center-container")
    );
    let FadeLoadingScreen = animate({
        target: loadingContainerEl,
        opacity: [1, 0],
        easing: "ease-in",
        duration: 500,
        autoplay: false,
        fillMode: "both",
    });

    // Monaco Code Editor
    let Monaco = await import("./modules/monaco");
    [editor, output] = Monaco.build();

    await new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, 100);
    });

    [editor.getDomNode(), output.getDomNode()].forEach((el) => {
        el?.parentElement?.classList.add("show");
    });

    FadeLoadingScreen.play(); // Fade away the loading screen
    await FadeLoadingScreen;

    const editorBtns = Array.from(document.querySelectorAll(".editor-btns"));
    if (editorBtns) {
        editorBtns?.[1].classList.add("delay");
        setTimeout(() => {
            editorBtns?.[1].classList.remove("delay");
        }, 1600);
    }

    loadingContainerEl.forEach((x) => x?.remove());
    FadeLoadingScreen.stop();

    BundleEvents.emit("loaded");

    loadingContainerEl = null;
    FadeLoadingScreen = null;

    let oldShareLink: string;
    let generateShareLink = () => {
        if (value == editor?.getValue()) {
            return (
                oldShareLink ??
                String(
                    new URL(
                        `/?share=${compressToURL(value)}`,
                        document.location.origin
                    )
                )
            );
        }

        value = `` + editor?.getValue();
        return (oldShareLink = String(
            new URL(`/?share=${compressToURL(value)}`, document.location.origin)
        ));
    };

    editor.onDidChangeModelContent(
        debounce((e) => {
            window.history.replaceState({}, "", generateShareLink());
        }, 300)
    );

    const shareBtn = document.querySelector(
        ".btn-share#share"
    ) as HTMLButtonElement;
    const shareInput = document.querySelector(
        "#copy-input"
    ) as HTMLInputElement;
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
    ResultEvents.on("add-module", (v) => {
        value = `` + editor?.getValue();
        editor.setValue(value + "\n" + v);
    });

    RunBtn.addEventListener("click", () => {
        BundleEvents.emit("bundle");
    });
})();

// SarchResults solidjs component
(async () => {
    const parseInput = (value: string) => {
        const host = "https://api.npms.io";
        let urlScheme = `${host}/v2/search?q=${encodeURIComponent(
            value
        )}&size=30`;
        let version = "";

        let exec = /([\S]+)@([\S]+)/g.exec(value);
        if (exec) {
            let [, pkg, ver] = exec;
            version = ver;
            urlScheme = `${host}/v2/search?q=${encodeURIComponent(
                pkg
            )}&size=30`;
        }

        return { url: urlScheme, version };
    };

    const searchInput = document.querySelector(
        ".search input"
    ) as HTMLInputElement;
    searchInput?.addEventListener?.(
        "keydown",
        debounce(() => {
            let { value } = searchInput;
            if (value.length <= 0) return;

            let { url, version } = parseInput(value);
            (async () => {
                let response = await fetch(url);
                let result = await response.json();
                setState(
                    // result.objects
                    result?.results.map((obj) => {
                        const { name, description, date, publisher } =
                            obj.package;
                        return {
                            name,
                            description,
                            date,
                            version,
                            author: publisher?.username,
                        };
                    }) ?? []
                );
            })();
        }, 125)
    );

    const SearchContainerEl = document.querySelector(
        ".search-container"
    ) as HTMLElement;
    const SearchResultContainerEl = SearchContainerEl.querySelector(
        ".search-results-container"
    ) as HTMLElement;
    if (SearchResultContainerEl) renderComponent(SearchResultContainerEl);

    const clearBtn = document.querySelector(".search .clear");
    clearBtn?.addEventListener("click", () => {
        searchInput.value = "";
        setState([]);
    });
})();

// @ts-ignore
globalThis.requestIdleCallback =
    globalThis.requestIdleCallback ??
    function (cb) {
        let start = Date.now();
        return setTimeout(function () {
            cb({
                didTimeout: false,
                timeRemaining: function () {
                    return Math.max(0, 50 - (Date.now() - start));
                },
            });
        }, 1);
    };

globalThis.requestIdleCallback(
    () => {
        const BundleWorker = new WebWorker(ESBUILD_WORKER_URL, WorkerArgs);

        // bundles using esbuild and returns the result
        BundleEvents.on("bundle", () => {
            if (!initialized) return;
            console.log("Bundle");
            value = `` + editor?.getValue();

            fileSizeEl.innerHTML = `<div class="loading"></div>`;
            bundleTime.textContent = ``;

            start = Date.now();
            BundleWorker.postMessage(value);
        });

        // Emit bundle events based on WebWorker messages
        BundleWorker.addEventListener(
            "message",
            ({ data }: MessageEvent<{ event: string; details: any }>) => {
                let { event, details } = data;
                BundleEvents.emit(event, details);
            }
        );

        window.addEventListener("pageshow", function (event) {
            if (!event.persisted) {
                BundleWorker?.start();
            }
        });

        window.addEventListener("pagehide", function (event) {
            if (event.persisted === true) {
                console.log("This page *might* be entering the bfcache.");
            } else {
                console.log("This page will unload normally and be discarded.");
                BundleWorker?.close();
            }
        });
    },
    { timeout: 2000 }
);
