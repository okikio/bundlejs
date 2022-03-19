import { USE_SHAREDWORKER, PRODUCTION_MODE } from "../../env";

import { animate } from "@okikio/animate";
import { EventEmitter } from "@okikio/emitter";

import { debounce } from "./util/debounce";
import {
    ResultEvents,
    renderComponent as renderSearchResults,
    setState
} from "./components/SearchResults";
import {
    renderComponent as renderConsole,
    addLogs, clearLogs
} from "./components/Console";

import { hit } from "countapi-js";
import { decode, encode } from "./util/encode-decode";

import { parseInput } from "./util/parse-query";

import ESBUILD_WORKER_URL from "worker:./workers/esbuild.ts";
import WebWorker, { WorkerConfig } from "./util/WebWorker";

import * as Monaco from "./modules/monaco";

import type { editor as Editor } from "monaco-editor";
import type { App, HistoryManager, IHistoryItem } from "@okikio/native";

export let oldShareURL = new URL(String(document.location));
export const BundleEvents = new EventEmitter();

let value = "";
let start = Date.now();

const timeFormatter = new Intl.RelativeTimeFormat("en", {
    style: "narrow",
    numeric: "auto",
});

let monacoLoadedFirst = false;
let initialized = false;

// The editor's content hasn't changed 
let isInitial = true;

// Bundle worker
const BundleWorkerConfig = WorkerConfig(ESBUILD_WORKER_URL, "esbuild-worker");
export const BundleWorker = USE_SHAREDWORKER ? new WebWorker(...BundleWorkerConfig) : new Worker(...BundleWorkerConfig) as WebWorker;
BundleWorker?.start?.();

export const postMessage = (obj: { event: string, details: any }) => {
    let messageStr = JSON.stringify(obj);
    let encodedMessage = encode(messageStr);
    BundleWorker.postMessage(encodedMessage, [encodedMessage.buffer]);
};

// Emit bundle events based on WebWorker messages
BundleWorker.addEventListener("message", ({ data }: MessageEvent<BufferSource>) => {
    let { event, details } = JSON.parse(decode(data));
    BundleEvents.emit(event, details);
});

window.addEventListener("pageshow", function (event) {
    if (!event.persisted) {
        BundleWorker?.start?.();
    }
});

window.addEventListener("pagehide", function (event) {
    if (event.persisted === true) {
        console.log("This page *might* be entering the bfcache.");
    } else {
        console.log("This page will unload normally and be discarded.");
        BundleWorker?.terminate?.();
    }
});

let fileSizeEl: HTMLElement[];

// Bundle Events
BundleEvents.on({
    loaded() {
        monacoLoadedFirst = true;

        if (initialized)
            BundleEvents.emit("ready");
    },
    init(details) {
        initialized = true;
        if (fileSizeEl)
            fileSizeEl.forEach(el => (el.textContent = `Wait...`));

        if (monacoLoadedFirst)
            BundleEvents.emit("ready");
    },
    ready() {
        console.log("Ready");
        if (fileSizeEl)
            fileSizeEl.forEach(el => (el.textContent = `...`));

        if (oldShareURL.search) {
            const searchParams = oldShareURL
                .searchParams;
            let plaintext = searchParams.get("text");
            let query = searchParams.get("query") || searchParams.get("q");
            let share = searchParams.get("share");
            let bundle = searchParams.get("bundle");
            let config = searchParams.get("config") ?? "{}";
            if (query || share || plaintext) {
                if (bundle != null) {
                    fileSizeEl.forEach(el => (el.textContent = `Wait!`));
                    BundleEvents.emit("bundle", config);
                }

                isInitial = false;
            }
        }
    },
    log(details) {  
        let { type, messages } = details;
        messages = [].concat(messages ?? []);
        if (!/error|warning/.test(type))
            messages.forEach(log => console.log(log));
        let logs = messages.map(msg => {
            msg = msg.replace(/(https?:\/\/[^\s\)]+)/g, `<a href="$1" target="_blank" rel="noopener">$1</a>`);
            let [title, ...message] = msg.split(/\n/);
            return ({ type, title, message: message.join("\n") });
        });

        addLogs(logs);
    },
    warn(details) {
        let { type, message } = details;
        console.warn(`${message.length} ${type}(s)`);
        (Array.isArray(message) ? message : [message]).forEach(msg => {
            console.warn(msg);
        });
    },
    error(details) {
        let { type, error } = details;
        console.error(`${error.length} ${type}(s) (if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)`);
        (Array.isArray(error) ? error : [error]).forEach(err => {
            console.error(err);
        });
        fileSizeEl.forEach(el => (el.textContent = `ERROR`));
    },
});

// Load all heavy main content
export const build = (app: App) => {
    fileSizeEl = fileSizeEl ?? Array.from(document.querySelectorAll(".file-size"));

    let editor: Editor.IStandaloneCodeEditor;
    let inputModel: Editor.ITextModel;
    let outputModel: Editor.ITextModel;
    let configModel: Editor.ITextModel;

    // bundles using esbuild and returns the result
    BundleEvents.on({
        bundle(config: string) {
            if (!initialized) return;
            value = `` + inputModel?.getValue();

            fileSizeEl.forEach(el => (el.innerHTML = `<div class="loading"></div>`));

            start = Date.now();
            postMessage({ event: "build", details: { config, value } });
        },
        result(details) {
            let { initialSize, size, content } = details;

            outputModel?.setValue?.(content);  
            const bundleTime = `⌛ Bundled ${timeFormatter.format(
                (Date.now() - start) / 1000,
                "seconds"
            )}`;
            console.log(bundleTime);
            console.log(`Bundled size is`, initialSize + " -> ", size);
            addLogs([
                {
                    title: bundleTime
                },
                {
                    title: `Bundle size is ${initialSize} -> ${size}`
                }
            ])
            fileSizeEl.forEach(el => (el.textContent = `` + size));
        }
    });

    let historyManager = app.get("HistoryManager") as HistoryManager;
    let replaceState = (url) => {
        if (url) {
            let { last } = historyManager;
            let state = {
                ...last,
                url: url.toString()
            }

            historyManager.states.pop();
            historyManager.states.push({ ...state });

            let item: IHistoryItem = {
                index: historyManager.pointer,
                states: [...historyManager.states]
            };

            window.history.replaceState(item, "", state.url);
        }
    }

    let pushState = (url) => {
        if (url) {
            let { last } = historyManager;
            let state = {
                ...last,
                url: url.toString()
            }

            let len = historyManager.length;
            historyManager.states.push({ ...state });
            historyManager.pointer = len;

            let item: IHistoryItem = {
                index: historyManager.pointer,
                states: [...historyManager.states]
            };

            window.history.pushState(item, "", state.url);
        }
    }

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
            duration: 50,
            autoplay: false,
            fillMode: "both",
        });

        const { languages, inputModelResetValue, outputModelResetValue, configModelResetValue } = Monaco;
        const getShareableURL = async (model: typeof inputModel) => {
            try {
                const worker = await languages.typescript.getTypeScriptWorker();
                const thisWorker = await worker(model.uri);

                // @ts-ignore
                return await thisWorker.getShareableURL(model.uri.toString(), configModel.getValue());
            } catch (e) {
                console.warn(e)
            }
        };

        const resetEditor = (editorModel = "input") => { 
            let resetValue: string;
            switch (editorModel) {
                case "input":
                    resetValue = inputModelResetValue;
                    break;
                case "output":
                    resetValue = outputModelResetValue;
                    break;
                default:
                    resetValue = configModelResetValue;
                    break;
            }

            editor.setValue(resetValue);
        }

        const editorBtns = (editor: Editor.IStandaloneCodeEditor) => {
            let el = editor.getDomNode();
            let app = el?.closest(".app");
            let parentEl = app.querySelector(".editor-btns");
            if (parentEl) {
                let btnContainer = parentEl.querySelector(".editor-btn-container");
                let hideBtn = parentEl.querySelector(".hide-btns");
                let clearBtn = parentEl.querySelector(".clear-btn");
                let prettierBtn = parentEl.querySelector(".prettier-btn");
                let resetBtn = parentEl.querySelector(".reset-btn");
                let copyBtn = parentEl.querySelector(".copy-btn");
                let codeWrapBtn = parentEl.querySelector(".code-wrap-btn");
                let editorInfo = parentEl.querySelector(".editor-info");

                btnContainer.classList.toggle("hide", window.matchMedia("(max-width: 640px)").matches);
                window.matchMedia("(max-width: 640px)")
                    .addEventListener("change", (e) => {
                        btnContainer.classList.toggle("hide", e.matches);
                    });

                hideBtn.addEventListener("click", () => {
                    btnContainer.classList.toggle("hide");
                });

                clearBtn.addEventListener("click", () => {
                    editor.setValue("");
                });

                prettierBtn.addEventListener("click", () => {
                    editor.getAction("editor.action.formatDocument").run();
                    const model = editor.getModel();
                    if (/^(js|javascript|ts|typescript)/.test(model.getLanguageId())){
                        try {
                            (async () => {
                                const worker = await languages.typescript.getTypeScriptWorker();
                                const thisWorker = await worker(model.uri);

                                // @ts-ignore
                                const formattedCode = await thisWorker.format(model.uri.toString());
                                editor.setValue(formattedCode);
                            })();
                        } catch (e) {
                            console.warn(e)
                        }
                    }
                });

                resetBtn.addEventListener("click", () => {
                    let modelType: string;
                    if (editor.getModel() == inputModel) modelType = "input";
                    else if (editor.getModel() == outputModel) modelType = "output";
                    else modelType = "config";

                    resetEditor(modelType);
                    if (editor.getModel() != outputModel && editor.getModel() == configModel) {
                        isInitial = true;
                    }
                });

                copyBtn.addEventListener("click", () => {
                    const range = editor.getModel().getFullModelRange();
                    editor.setSelection(range);
                    editor
                        .getAction(
                            "editor.action.clipboardCopyWithSyntaxHighlightingAction"
                        )
                        .run();

                    (async () => {
                        await animate({
                            target: editorInfo,
                            translateY: [100, "-120%"],
                            opacity: [0, 1],
                            fillMode: "both",
                            duration: 500,
                            easing: "ease-out",
                        });

                        await animate({
                            target: editorInfo,
                            translateY: ["-120%", 100],
                            opacity: [1, 0],
                            fillMode: "both",
                            delay: 1000,
                        });
                    })();
                });

                codeWrapBtn.addEventListener("click", () => {
                    let wordWrap: "on" | "off" =
                        editor.getRawOptions()["wordWrap"] == "on" ? "off" : "on";
                    editor.updateOptions({ wordWrap });
                });
            }
            
            let editorTabs = document.querySelector(".tab-btns");
            if (editorTabs) {
                let inputEditorBtn = editorTabs.querySelector(".input-btn");
                let outputEditorBtn = editorTabs.querySelector(".output-btn");
                let settingEditorBtn = editorTabs.querySelector(".settings-btn");
                inputEditorBtn?.addEventListener("click", () => {
                    inputEditorBtn.classList.add("active");
                    outputEditorBtn.classList.remove("active");
                    settingEditorBtn.classList.remove("active");
                    editor?.setModel(inputModel);
                });
                outputEditorBtn?.addEventListener("click", () => {
                    inputEditorBtn.classList.remove("active");
                    outputEditorBtn.classList.add("active");
                    settingEditorBtn.classList.remove("active");
                    editor?.setModel(outputModel);
                });
                settingEditorBtn?.addEventListener("click", () => {
                    inputEditorBtn.classList.remove("active");
                    outputEditorBtn.classList.remove("active");
                    settingEditorBtn.classList.add("active");
                    editor?.setModel(configModel);
                });
            }
        };

        // Build the Code Editor
        [editor, inputModel, outputModel, configModel] = Monaco.build(oldShareURL);

        FadeLoadingScreen.play(); // Fade away the loading screen
        await FadeLoadingScreen;

        editor.getDomNode()?.parentElement?.classList.add("show");

        // Add editor buttons to both editors
        editorBtns(editor);

        FadeLoadingScreen.stop();
        loadingContainerEl.forEach((x) => x?.remove());

        flexWrapper.classList.add("loaded");
        BundleEvents.emit("loaded");

        loadingContainerEl = null;
        FadeLoadingScreen = null;

        editor.onDidChangeModelContent(
            debounce((e) => {
                (async () => {
                    replaceState(await getShareableURL(inputModel));
                    isInitial = false;
                })();
            }, 1000)
        );

        const shareBtn = Array.from(document.querySelectorAll(
            ".btn-permalink#share"
        )) as HTMLButtonElement[];
        const shareInput = document.querySelector(
            "#copy-input"
        ) as HTMLInputElement;
        shareBtn.forEach(el => {
            el?.addEventListener("click", () => {
                (async () => {
                    try {
                        if (navigator.share) {
                            let shareBtnValue = el.innerText;
                            isInitial = false;
                            await navigator.share({
                                title: 'bundle',
                                text: '',
                                url: await getShareableURL(inputModel),
                            });

                            el.innerText = "Shared!";
                            setTimeout(() => {
                                el.innerText = shareBtnValue;
                            }, 600);
                        } else {
                            shareInput.value = await getShareableURL(inputModel);
                            shareInput.select();
                            document.execCommand("copy");

                            let shareBtnValue = el.innerText;

                            el.innerText = "Copied!";
                            setTimeout(() => {
                                el.innerText = shareBtnValue;
                            }, 600);
                        }
                    } catch (error) {
                        console.log('Error sharing', error);
                    }
                })();
            });
        });

        // Listen to events for the results
        ResultEvents.on("add-module", (v) => {
            value = isInitial ? "// Click Build for the Bundled + Minified + Gzipped package size" : `` + inputModel?.getValue();
            inputModel?.setValue((value + "\n" + v).trim());
        });

        let BuildBtn = Array.from(document.querySelectorAll("#build")) as HTMLElement[];
        BuildBtn.forEach(btn => {
            btn?.addEventListener("click", () => {
                (async () => {
                    if (!initialized)
                        fileSizeEl.forEach(el => (el.textContent = `Wait!`));
                    BundleEvents.emit("bundle", configModel?.getValue());
                    outputModel.setValue(outputModelResetValue);
                    pushState(await getShareableURL(inputModel));
                })();
            });
        });
    })();
};

// To speed up rendering, delay Monaco on the main page, only load none critical code
export const InitialRender = (shareURL: URL) => {
    oldShareURL = shareURL;
    fileSizeEl = fileSizeEl ?? Array.from(document.querySelectorAll(".file-size"));
    BundleWorker?.start?.();

    if (initialized && fileSizeEl)
        fileSizeEl.forEach(el => (el.textContent = `...`));

    // SearchResults solidjs component
    (async () => {
        const searchInput = document.querySelector(
            ".search input"
        ) as HTMLInputElement;
        let searchFn = debounce(() => {
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
        }, 100)
        searchInput?.addEventListener?.("keydown", (e) => {
            // e.preventDefault();
            e.stopPropagation();
            searchFn(e);
        });

        const SearchContainerEl = document.querySelector(
            ".search-container"
        ) as HTMLElement;
        const SearchResultContainerEl = SearchContainerEl.querySelector(
            ".search-results-container"
        ) as HTMLElement;
        if (SearchResultContainerEl) renderSearchResults(SearchResultContainerEl);

        const clearBtn = document.querySelector(".search .clear");
        clearBtn?.addEventListener("click", () => {
            searchInput.value = "";
            setState([]);
        });
    })();

    // Drag handle - Resiable split editors
    (() => { 
        // Based on the tutorial at https://htmldom.dev/create-resizable-split-views/
        // Honestly, I am surprised that native dragging doesn't work for this use case
        const dragSection = document.querySelector(".drag-section") as HTMLElement;
        const dragHandle = dragSection.querySelector(".drag-handle") as HTMLElement;

        const parentEl = dragSection.parentElement as HTMLElement;
        const leftSide = dragSection.previousElementSibling as HTMLElement;
        const rightSide = dragSection.nextElementSibling as HTMLElement;

        // The current position of mouse
        let x = 0;
        let y = 0;
        
        // Width & Height of left side
        let leftWidth = 0;
        let leftHeight = 0;
        
        let parentRect = parentEl.getBoundingClientRect();
        let parentWidth = parentRect.width;
        let parentHeight = parentRect.height;

        window.matchMedia("(min-width: 640px)")
            .addEventListener("change", (e) => {
                leftSide.style.removeProperty(e.matches ? 'height' : 'width');
        });
        let drag = (e: MouseEvent) => { 
            // How far the mouse has been moved
            const dx = e.clientX - x;
            const dy = e.clientY - y;
            
            if (window.matchMedia("(min-width: 640px)").matches) {
                const newLeftWidth = ((leftWidth + dx) * 100) / parentWidth;
                leftSide.style.width = `${newLeftWidth}%`;
                document.body.style.cursor = 'col-resize';
            } else { 
                const newLeftHeight = ((leftHeight + dy) * 100) / parentHeight;
                leftSide.style.height = `${newLeftHeight}%`;
                document.body.style.cursor = 'row-resize';
            }

            leftSide.style.userSelect = 'none';
            leftSide.style.pointerEvents = 'none';
        
            rightSide.style.userSelect = 'none';
            rightSide.style.pointerEvents = 'none';
        }

        let stopDrag = () => { 
            dragHandle.style.removeProperty('cursor');
            document.body.style.removeProperty('cursor');
        
            leftSide.style.removeProperty('user-select');
            leftSide.style.removeProperty('pointer-events');
        
            rightSide.style.removeProperty('user-select');
            rightSide.style.removeProperty('pointer-events');
            
            document.removeEventListener('pointermove', drag);
            document.removeEventListener('pointerup', stopDrag);
        }
        
        // Handle the mousedown event
        // that's triggered when user drags the resizer
        const pointerDown = (e: MouseEvent) => {
            // Get the current mouse position
            x = e.clientX;
            y = e.clientY;

            let { width, height } = leftSide.getBoundingClientRect();
            leftWidth = width;
            leftHeight = height;

            // Attach the listeners to `document`
            document.addEventListener('pointermove', drag);
            document.addEventListener('pointerup', stopDrag);
        };
        
        dragHandle.addEventListener('pointerdown', pointerDown);

        window.addEventListener('resize', debounce(() => { 
            parentRect = parentEl.getBoundingClientRect();
            parentWidth = parentRect.width;
            parentHeight = parentRect.height;
        }, 50));
        
        new ResizeObserver(debounce(() => {
            parentRect = parentEl.getBoundingClientRect();
            parentWidth = parentRect.width;
            parentHeight = parentRect.height;
        }, 50)).observe(parentEl);
    })();

    // Drag handle - Resizable Full height
    (() => { 
        // Based on the tutorial at https://htmldom.dev/create-resizable-split-views/
        // Honestly, I am surprised that native dragging doesn't work for this use case
        const dragSection = document.querySelector(".drag-section#handle-2") as HTMLElement;
        const dragHandle = dragSection.querySelector(".drag-handle") as HTMLElement;
        const targetEl = document.querySelector(".flex-wrapper") as HTMLElement;

        // The current position of mouse
        let y = 0;
        
        // Height of left side
        let height = 0;
        let drag = (e: MouseEvent) => { 
            // How far the mouse has been moved
            const dy = e.clientY - y;
            const newHeight = height + dy;
            targetEl.style.height = `${newHeight}px`;
            document.body.style.cursor = 'row-resize';

            targetEl.style.userSelect = 'none';
            targetEl.style.pointerEvents = 'none';
        }

        let stopDrag = () => { 
            dragHandle.style.removeProperty('cursor');
            document.body.style.removeProperty('cursor');
        
            targetEl.style.removeProperty('user-select');
            targetEl.style.removeProperty('pointer-events');
            
            document.removeEventListener('pointermove', drag);
            document.removeEventListener('pointerup', stopDrag);
        }
        
        // Handle the mousedown event
        // that's triggered when user drags the resizer
        const pointerDown = (e: MouseEvent) => {
            // Get the current mouse position
            y = e.clientY;
            height = targetEl.getBoundingClientRect().height;

            // Attach the listeners to `document`
            document.addEventListener('pointermove', drag);
            document.addEventListener('pointerup', stopDrag);
        };
        
        dragHandle.addEventListener('pointerdown', pointerDown);
    })();

    // Console solidjs component
    (async () => {
        const ConsoleEl = document.querySelector(
            ".console code"
        ) as HTMLElement;
        if (ConsoleEl) {
            ConsoleEl.innerHTML = "";
            renderConsole(ConsoleEl);
        }

        const clearBtn = document.querySelector(".console-btns .clear-console-btn");
        clearBtn?.addEventListener("click", () => {
            clearLogs();
        });

        const foldBtn = document.querySelector(".console-btns .fold-unfold-console-btn");
        foldBtn?.addEventListener("click", () => {
            const details = Array.from(document.querySelectorAll(".console details"));
            details.forEach((el) => {
                el.toggleAttribute("open");
            });
        });

        const scrollDownBtn = document.querySelector(".console-btns .console-to-bottom-btn");
        scrollDownBtn?.addEventListener("click", () => {
            if (ConsoleEl) { 
                ConsoleEl.scrollTo(0, ConsoleEl.scrollHeight);
            }
        });

        const scrollUpBtn = document.querySelector(".console-btns .console-to-top-btn");
        scrollUpBtn?.addEventListener("click", () => {
            if (ConsoleEl) { 
                ConsoleEl.scrollTo(0, 0);
            }
        });
    })();

    // countapi-js hit counter. It counts the number of time the website is loaded
    (async () => {
        if (!PRODUCTION_MODE) return;
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
}
