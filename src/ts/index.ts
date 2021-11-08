import { animate } from "@okikio/animate";
import { EventEmitter } from "@okikio/emitter";

import { debounce } from "./util/debounce";
import { compressToURL } from "@amoutonbrady/lz-string";

import {
    ResultEvents,
    renderComponent,
    setState,
    parseInput
} from "./components/SearchResults";

import * as Monaco from "./modules/monaco";

import { hit } from "countapi-js";
import { decode, encode } from "./util/encode-decode";

import type { editor as Editor } from "monaco-editor";

import ESBUILD_WORKER_URL from "worker:./workers/esbuild.ts";
import WebWorker from "./util/WebWorker";

const BundleEvents = new EventEmitter();

let fileSizeEl = document.querySelector(".file-size");
let RunBtn = document.querySelector("#run");
let bundleTime = document.querySelector("#bundle-time");

let value = "";
let start = Date.now();

let editor: Editor.IStandaloneCodeEditor;
let output: Editor.IStandaloneCodeEditor;

const WorkerArgs = { name: "esbuild-worker" };
const timeFormatter = new Intl.RelativeTimeFormat("en", {
    style: "narrow",
    numeric: "auto",
});

let monacoLoadedFirst = false;
let initialized = false;

// The editor's content hasn't changed 
let isInitial = true;



// Bundle worker
(() => {
    const BundleWorker = new WebWorker(ESBUILD_WORKER_URL, WorkerArgs);
    const postMessage = (obj: any) => {
        let messageStr = JSON.stringify(obj);
        let encodedMessage = encode(messageStr);
        BundleWorker.postMessage(encodedMessage , [encodedMessage.buffer]); 
    };  

    // bundles using esbuild and returns the result
    BundleEvents.on("bundle", () => {
        if (!initialized) return;
        console.log("Bundle");
        value = `` + editor?.getValue();

        fileSizeEl.innerHTML = `<div class="loading"></div>`;
        bundleTime.textContent = `Bundled in ...`;

        start = Date.now();
        postMessage({ event: "build", details: value });
    });

    // Emit bundle events based on WebWorker messages
    BundleWorker.addEventListener("message", ({ data }: MessageEvent<BufferSource>) => {
        let { event, details } = JSON.parse(decode(data)); 
        BundleEvents.emit(event, details);
    });

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
            BundleWorker?.terminate();
        }
    });
})();

// Bundle Events
export let oldShareURL = new URL(String(document.location));
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
        if (oldShareURL.search) {
            const searchParams = oldShareURL
                .searchParams;
            let plaintext = searchParams.get("text");
            let query = searchParams.get("query") || searchParams.get("q");
            let share = searchParams.get("share");
            let bundle = searchParams.get("bundle");
            if (query || share || plaintext) {
                if (bundle != null) {
                    fileSizeEl.textContent = `Wait...`;
                    BundleEvents.emit("bundle");
                }
                
                isInitial = false;
            }
        }
    },
    warn(details) {
        let { type, message } = details;
        console.warn(`${message.length} ${type}(s)`);
        message.forEach(msg => {
            console.warn(msg);
        });
    },
    error(details) {
        let { type, error } = details;
        console.error(`${error.length} ${type}(s) (if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)`);
        error.forEach(err => {
            console.error(err);
        });
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

export default () => { 
    // Fix PJAX, force replacing the original shared URL
    if (oldShareURL) {
        window.history.replaceState({}, "", oldShareURL);
    }

    // SearchResults solidjs component
    (async () => {
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
                    try {
                        let response = await fetch(url);
                        let result = await response.json();
                        setState(                        
                            // result?.results   ->   api.npms.io
                            // result?.objects   ->   registry.npmjs.com
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
                    } catch (e) {
                        console.error(e);
                        setState([{
                            type: "Error...",
                            description: e?.message
                        }]);
                    }
                })();
            }, 250)
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

    // Monaco
    (async () => {
        let flexWrapper = document.querySelector(".flex-wrapper") as HTMLElement;
        let loadingContainerEl = Array.from(
            document.querySelectorAll(".center-container")
        );
        let FadeLoadingScreen = animate({
            target: loadingContainerEl,
            opacity: [1, 0],
            easing: "ease-in",
            duration: 300,
            autoplay: false,
            fillMode: "both",
        });

        // Monaco Code Editor
        // let Monaco = await import("./modules/monaco");
        [editor, output] = Monaco.build();

        FadeLoadingScreen.play(); // Fade away the loading screen
        await FadeLoadingScreen;

        [editor.getDomNode(), output.getDomNode()].forEach((el) => {
            el?.parentElement?.classList.add("show");
        });

        FadeLoadingScreen.stop();
        loadingContainerEl.forEach((x) => x?.remove());

        flexWrapper.classList.add("loaded");

        const editorBtns = Array.from(
            document.querySelectorAll(".editor-btns")
        );
        if (editorBtns) {
            editorBtns?.[1].classList.add("delay");
            setTimeout(() => {
                editorBtns?.[1].classList.remove("delay");
            }, 1600);
        }

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
                new URL(
                    `/?share=${compressToURL(value)}`,
                    document.location.origin
                )
            ));
        };

        editor.onDidChangeModelContent(
            debounce((e) => {
                window.history.replaceState({}, "", generateShareLink());
                isInitial = false;
            }, 1000)
        );

        const shareBtn = document.querySelector(
            ".btn-share#share"
        ) as HTMLButtonElement;
        const shareInput = document.querySelector(
            "#copy-input"
        ) as HTMLInputElement;
        shareBtn?.addEventListener("click", () => {
            if (navigator.share) {
                let shareBtnValue = shareBtn.innerText;

                navigator.share({
                    title: 'bundle',
                    text: '',
                    url: generateShareLink(),
                })
                    .then(() => {
                        shareBtn.innerText = "Shared!";
                        setTimeout(() => {
                            shareBtn.innerText = shareBtnValue;
                        }, 600);
                    })
                    .catch((error) => console.log('Error sharing', error));
            } else {
                shareInput.value = generateShareLink();
                shareInput.select();
                document.execCommand("copy");

                let shareBtnValue = shareBtn.innerText;

                shareBtn.innerText = "Copied!";
                setTimeout(() => {
                    shareBtn.innerText = shareBtnValue;
                }, 600);
            }
        });

        // Listen to events for the results
        ResultEvents.on("add-module", (v) => {
            value = isInitial ? "// Click Run for the Bundled + Minified + Gzipped package size" : `` + editor?.getValue();
            editor.setValue(value + "\n" + v);
        });

        RunBtn.addEventListener("click", () => {
            window.history.pushState({}, "", generateShareLink());
            BundleEvents.emit("bundle");
        });
    })();

    // countapi-js hit counter. It counts the number of time the website is loaded
    (async () => {
        try {
            let { value } = await hit("bundle.js.org", "visits");
            let visitCounterEl = document.querySelector("#visit-counter");
            if (visitCounterEl)
                visitCounterEl.textContent = `👋 ${value} visits`;
        } catch (err) {
            console.warn(
                "Visit Counter Error (please create a new issue in the repo)",
                err
            );
        }
    })();
};