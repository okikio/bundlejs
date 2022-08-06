import type { editor as Editor } from "monaco-editor";
import type { App, HistoryManager, IHistoryItem } from "@okikio/native";
import { BundleConfigOptions, EasyDefaultConfig } from "./configs/bundle-options";

import { USE_SHAREDWORKER, PRODUCTION_MODE } from "../../env";

// import { setupTypeAcquisition } from "@typescript/ata";
// import ts from "typescript";

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
  addLogs, clearLogs, setStickToBottom, SET_MAX_LOGS,
  type TypeLog
} from "./components/Console";

import { hit } from "countapi-js";
import { decode, encode } from "./util/encode-decode";

import { parseInput } from "./util/parse-query";

import SANDBOX_WORKER_URL from "worker:./workers/sandbox.ts";
import ESBUILD_WORKER_URL from "worker:./workers/esbuild.ts";
import WebWorker, { WorkerConfig } from "./util/WebWorker";

// import * as Monaco from "./modules/monaco";
import { getRequest } from "./util/fetch-and-cache";
import { deepAssign } from "./util/deep-equal";
import serialize from "./util/serialize-javascript";

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
BundleWorker?.start?.(); // Only SharedWorkers support the start method, so optionally call the method if it is supported

export const channel = new MessageChannel();
export const SandboxWorkerConfig = [SANDBOX_WORKER_URL, { name: 'sandbox' } as WorkerOptions] as const;
export const SANDBOX_WORKER = USE_SHAREDWORKER ? new WebWorker(...SandboxWorkerConfig) : new Worker(...SandboxWorkerConfig) as WebWorker;

try {
  SANDBOX_WORKER?.start?.();
  channel.port1.start();
  channel.port2.start();
  SANDBOX_WORKER.postMessage({ port: channel.port1 }, [channel.port1]);
  BundleWorker.postMessage({ port: channel.port2 }, [channel.port2]);
} catch (err) {
  console.log(err);
}

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
let consoleLog = (type: TypeLog["type"], log = "") => {
  // Ignore empty log messages
  if (log && log?.length > 0) {
    let [title, ...message] = log
      .replace(/\n/g, "\n")
      .split(/\n/);

    // If there is a break line in the console log message, then create a group console log
    // only group info logs and normal console logs, ignore errors and warnings
    let groupLogs = message && message.length > 0 && !/error|warning/.test(type);
    if (groupLogs) {
      if (/info/.test(type)) {
        // Info logs are green
        let logColors = { "error": "#f87171", "warning": "#facc15", "info": "#86efac" };
        console.groupCollapsed("%c" + title, `color: ${logColors[type]};`);
      } else {
        console.groupCollapsed(title);
      }
    }

    // Log according to the type of message given
    let value = groupLogs ? message.join("\n") : log;
    switch (type) {
      case "error":
        console.error(value);
        break;
      case "warning":
        console.warn(value);
        break;
      case "info":
        // Info logs are green
        console.info("%c" + value, "color: green;");
        break;
      default:
        console.log(value);
    }

    if (groupLogs)
      console.groupEnd();

  }
};

// Bundle Events
BundleEvents.on({
  loaded() {
    if (initialized)
      BundleEvents.emit("ready");

    monacoLoadedFirst = true;
  },
  init() {
    initialized = true;

    if (fileSizeEl)
      fileSizeEl.forEach(el => (el.textContent = `...`)); // `Wait...`

    if (monacoLoadedFirst)
      BundleEvents.emit("ready");
  },
  async ready() {
    console.log("Ready");

    // If the URL contains share details make sure to use those details
    // e.g. config, query, etc...
    if (oldShareURL.search) {
      const searchParams = oldShareURL
        .searchParams;

      let plaintext = searchParams.get("text");
      let query = searchParams.get("query") || searchParams.get("q");
      let share = searchParams.get("share");
      let bundle = searchParams.get("bundle");
      let config = searchParams.get("config") ?? "{}";
      if (query || share || plaintext || config) {
        if (bundle != null) {
          // fileSizeEl.forEach(el => (el.textContent = `Wait!`));

          let initialConfig = `export default ${config}`;
          BundleEvents.emit("bundle", initialConfig);
        }

        isInitial = false;
      }
    }
  },
  log(details) {
    let { type, message } = details;
    message = [].concat(message ?? []);

    // Log to devtools
    if (!/error|warning/.test(type))
      message.forEach(log => consoleLog(type, log));

    // Add logs to the virtual console
    let logs = message.map((msg = "") => {
      msg = (msg ?? "")
        .replace(/(https?:\/\/[^\s\)\:]+)((?:\:\d+){0,})/g, `<a href="$1" target="_blank" rel="noopener">$1</a>$2`);
      let [title, ...message] = msg.split(/\n/);
      return ({ type, title, message: (message ?? []).join("<br>") });
    });

    addLogs(logs);
  },

  info(details) { },
  warning(details) {
    let { type, message } = details;
    (Array.isArray(message) ? message : [message]).forEach(warn => {
      consoleLog("warning", warn);
    });
  },
  error(details) {
    let { type, message } = details;
    (Array.isArray(message) ? message : [message]).forEach(err => {
      consoleLog("error", err);
    });
    fileSizeEl.forEach(el => (el.textContent = `ERROR`));
  },
});

export const replaceState = (url: string | URL, historyManager: HistoryManager) => {
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

export const pushState = (url: string | URL, historyManager: HistoryManager) => {
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

export const getConfig = async (config: string) => {
  return new Promise(resolve => {
    SANDBOX_WORKER.postMessage(config);
    SANDBOX_WORKER.onmessage = ({ data }: MessageEvent<string>) => {
      resolve(
        typeof data === "object" &&
          !Array.isArray(data) &&
          !Number.isNaN(data) ? (data ?? {}) : {}
      );
    }
  });
}

// Load all heavy main content
export const build = async (app: App) => {
  const historyManager = app.get("HistoryManager") as HistoryManager;
  fileSizeEl = fileSizeEl ?? Array.from(document.querySelectorAll(".file-size"));

  let editor: Editor.IStandaloneCodeEditor;
  let inputModel: Editor.ITextModel;
  let outputModel: Editor.ITextModel;
  let configModel: Editor.ITextModel;

  let setIframeHTML = (iframe: HTMLIFrameElement, newHTML: string) => {
    iframe?.contentWindow?.document?.open();

    if (newHTML) {
      if (iframe?.contentWindow?.document?.documentElement)
        iframe.contentWindow.document.documentElement.innerHTML = newHTML;
      else
        iframe?.contentWindow?.document?.write?.(newHTML);
    }

    iframe?.contentWindow?.document?.close();
  };

  let iframeLoader = document.querySelector(".analyzer-loader") as HTMLIFrameElement;

  // bundles using esbuild and returns the result
  BundleEvents.on({
    bundle(config: string) {
      if (!initialized) return;
      value = `` + inputModel?.getValue();

      fileSizeEl.forEach(el => (el.innerHTML = `<div class="loading"></div>`));

      start = Date.now();
      postMessage({ event: "build", details: { config, value } });

      (async () => {
        let configObj: BundleConfigOptions = {};
        try {
          configObj = await getConfig(config);
        } catch (e) {
          console.warn(e);
        }

        if (configObj?.analysis) {
          let content = iframeLoader?.querySelector(".loader-content") as HTMLDivElement;
          let loadingEl = iframeLoader?.querySelector(".loading") as HTMLDivElement;
          let iframe = document.querySelector("#analyzer") as HTMLIFrameElement;
          content?.classList?.add("hidden");

          iframeLoader?.classList?.remove("hidden");
          loadingEl?.classList?.remove("hidden");

          let IframeFadeInLoadingScreen = animate({
            target: iframeLoader,
            opacity: [0, 1],
            easing: "ease-out",
            duration: 50,
            autoplay: false
          });
          IframeFadeInLoadingScreen.play();
          IframeFadeInLoadingScreen.then(() => {
            setIframeHTML(iframe, ``);
          });
        }
      })();

    },
    result(details) {
      let { initialSize, size, content } = details;

      outputModel?.setValue?.(content);
      const bundleTime = `⌛ Bundled ${timeFormatter.format((Date.now() - start) / 1000, "seconds")}`;
      console.log(bundleTime);
      console.log(`Bundled size is`, initialSize + " -> ", size);
      addLogs([
        { title: bundleTime, type: "info" },
        { title: `Bundle size is ${initialSize} -> ${size}`, type: "info" }
      ]);
      fileSizeEl.forEach(el => (el.textContent = `` + size));
    },
    chart(details) {
      let { content: newHTML } = details;
      let loadingEl = iframeLoader?.querySelector(".loading") as HTMLDivElement;

      let iframe = document.querySelector("#analyzer") as HTMLIFrameElement;
      setIframeHTML(iframe, newHTML);

      let IframeFadeOutLoadingScreen = animate({
        target: iframeLoader,
        opacity: [1, 0],
        easing: "ease-in",
        duration: 50,
        autoplay: false
      });
      IframeFadeOutLoadingScreen.play();
      IframeFadeOutLoadingScreen.then(() => {
        iframeLoader?.classList?.add("hidden");
        loadingEl?.classList?.add("hidden");
      });
    }
  });

  const Monaco = await import("./modules/monaco");
  const { languages, inputModelResetValue, outputModelResetValue, configModelResetValue, Uri, Editor } = Monaco;
  const getShareableURL = async (model: typeof inputModel) => {
    try {
      const worker = await languages.typescript.getTypeScriptWorker();
      const thisWorker = await worker(model.uri);

      const config: Record<any, any> = await getConfig(configModel.getValue()) ?? {};

      // @ts-ignore
      return await thisWorker.getShareableURL(
        model.uri.toString(),

        // Potentially allow other non-default exports if export isn't defined 
        config
      );
    } catch (e) {
      console.warn(e)
    }
  };

  const formatDocument = async (model: typeof inputModel) => {
    const worker = await languages.typescript.getTypeScriptWorker();
    const thisWorker = await worker(model.uri);

    // @ts-ignore
    const formattedCode = await thisWorker.format(model.uri.toString());
    model.setValue(formattedCode);
  };

  const getModelType = () => {
    if (editor.getModel() == inputModel) return "input";
    else if (editor.getModel() == outputModel) return "output";
    else return "config";
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

    const editorBtns = (editor: Editor.IStandaloneCodeEditor) => {
      let el = editor.getDomNode();
      let app = el?.closest(".app");
      let parentEl = app.querySelector(".editor-btns");
      if (parentEl) {
        let btnContainer = parentEl.querySelector(".editor-btn-container");
        let hideBtn = parentEl.querySelector(".hide-btns");
        let clearBtn = parentEl.querySelector(".clear-btn");
        let prettierBtn = parentEl.querySelector(".prettier-btn");
        let downloadBtn = parentEl.querySelector(".download-btn");
        let resetBtn = parentEl.querySelector(".reset-btn");
        let copyBtn = parentEl.querySelector(".copy-btn");
        let codeWrapBtn = parentEl.querySelector(".code-wrap-btn");
        let editorInfo = parentEl.querySelector(".editor-info");

        btnContainer.classList.toggle("hide", window.matchMedia("(max-width: 640px)").matches);
        window
          .matchMedia("(max-width: 640px)")
          .addEventListener("change", (e) => {
            btnContainer.classList.toggle("hide", e.matches);
          });

        hideBtn.addEventListener("click", () => {
          btnContainer.classList.toggle("hide");
        });

        clearBtn.addEventListener("click", () => {
          editor.setValue("");
        });

        function downloadBlob(blob: Blob, name = 'file.txt') {
          // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
          const blobUrl = URL.createObjectURL(blob);

          // Create a link element
          const link = document.createElement("a");

          // Set link's href to point to the Blob URL
          link.href = blobUrl;
          link.download = name;

          // Append link to the body
          document.body.appendChild(link);

          // Dispatch click event on the link
          // This is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            })
          );

          // Remove link from body
          document.body.removeChild(link);
        }

        downloadBtn.addEventListener("click", () => {
          const model = editor.getModel();
          model.getLanguageId()
          const blob = new Blob([model.getValue()], {
            type: `${model.getLanguageId() == "typescript" ? "text/javascript" : "application/json"};charset=utf-8`
          });

          downloadBlob(blob, model?.uri?.authority ?? "download.ts");
        });

        prettierBtn.addEventListener("click", () => {
          editor.getAction("editor.action.formatDocument").run();
          const model = editor.getModel();
          if (/^(js|javascript|ts|typescript)/.test(model.getLanguageId())) {
            try {
              formatDocument(model);
            } catch (e) {
              console.warn(e)
            }
          }
        });

        resetBtn.addEventListener("click", () => {
          let modelType = getModelType();

          resetEditor(modelType);
          if (modelType == "input") isInitial = true;
        });

        copyBtn.addEventListener("click", () => {
          const range = editor.getModel().getFullModelRange();
          editor.setSelection(range);
          editor
            .getAction("editor.action.clipboardCopyWithSyntaxHighlightingAction")
            .run();

          // Show user a copied banner, to give them feedback
          (async () => {
            let opts = {
              target: editorInfo,
              fillMode: "both",
            };

            await animate({
              ...opts,
              translateY: [100, "-120%"],
              opacity: [0, 1],
              duration: 500,
              easing: "ease-out",
            });

            await animate({
              ...opts,
              translateY: ["-120%", 100],
              opacity: [1, 0],
              delay: 1000,
            });
          })();
        });

        codeWrapBtn.addEventListener("click", () => {
          let wordWrap = editor.getRawOptions()["wordWrap"];
          editor.updateOptions({ wordWrap: wordWrap == "on" ? "off" : "on" });
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

    (async () => {
      let newConfig = {};
      try {
        const searchParams = oldShareURL.searchParams;
        const config = searchParams.get("config") ?? "{}";
        newConfig = await getConfig(`export default ${config}`);
      } catch (e) { }

      const oldConfigFromURL = serialize(
        deepAssign({}, EasyDefaultConfig, newConfig),
        { unsafe: true, ignoreFunction: true, space: 2 }
      );

      configModel.setValue([
        '// Configure Bundle',
        `import type { BundleConfigOptions } from "@bundlejs/core/config"`,
        `export default (async function() {\n return ${oldConfigFromURL} as BundleConfigOptions;\n})()`
      ].join("\n"));

      await formatDocument(configModel);
    })();

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

    // Update the URL share query everytime user makes a change 
    editor.onDidChangeModelContent(
      debounce((e) => {
        let modelType = getModelType();
        if (modelType == "output") return;
        (async () => {
          try {
            // Set the max log limit for the virtual console, using the esbuild logLimit config option 
            if (modelType == "config") {
              let config = JSON.parse(editor.getValue()) as BundleConfigOptions;
              if (config?.esbuild?.logLimit) {
                SET_MAX_LOGS(config?.esbuild?.logLimit);
              }
            }
          } catch (e) { }

          replaceState(await getShareableURL(inputModel), historyManager);
          isInitial = false;

          // await getTypescriptTypes(inputModel);
        })();
      }, 1000)
    );
  })();

  // Share Button
  (() => {
    const shareBtn = Array.from(document.querySelectorAll(".btn-permalink.share-btn")) as HTMLButtonElement[];
    const shareInput = document.querySelector("#copy-input") as HTMLInputElement;
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
              setTimeout(() => { el.innerText = shareBtnValue; }, 600);
            } else {
              shareInput.value = await getShareableURL(inputModel);
              shareInput.select();
              document.execCommand("copy");

              let shareBtnValue = el.innerText;

              el.innerText = "Copied!";
              setTimeout(() => { el.innerText = shareBtnValue; }, 600);
            }
          } catch (error) {
            console.log('Error sharing', error);
          }
        })();
      });
    });
  })();

  // Add Module from Search Results
  (() => {
    // Listen to events for the results
    ResultEvents.on("add-module", (v) => {
      value = isInitial ? "// Click Build for the bundled, minified and compressed package size" : `` + inputModel?.getValue();
      inputModel?.setValue((value + "\n" + v).trim());
    });
  })();

  // Build buttons
  (() => {
    let BuildBtn = Array.from(document.querySelectorAll(".build-btn")) as HTMLElement[];

    // There are 2 build buttons, 1 for desktop, 1 for mobile
    // This allows both buttons to build the code
    BuildBtn.forEach(btn => {
      btn?.addEventListener("click", () => {
        (async () => {
          if (!initialized)
            fileSizeEl.forEach(el => (el.textContent = `Wait!`));

          BundleEvents.emit("bundle", configModel?.getValue());
          outputModel.setValue(outputModelResetValue);
          pushState(await getShareableURL(inputModel), historyManager);
        })();
      });
    });
  })();
};

// To speed up rendering, delay Monaco on the main page, only load none critical code
export const InitialRender = (shareURL: URL) => {
  oldShareURL = shareURL;
  fileSizeEl = fileSizeEl ?? Array.from(document.querySelectorAll(".file-size"));
  // BundleWorker?.start?.();

  if (initialized && fileSizeEl)
    fileSizeEl.forEach(el => (el.textContent = `...`));

  // SearchResults solidjs component
  (() => {
    const clearBtn = document.querySelector(".search .clear");
    const searchInput = document.querySelector(".search input") as HTMLInputElement;
    const SearchContainerEl = document.querySelector(".search-container") as HTMLElement;

    const SearchResultContainerEl = SearchContainerEl.querySelector(".search-results-container") as HTMLElement;
    if (SearchResultContainerEl) renderSearchResults(SearchResultContainerEl);

    const keyUp = debounce((e) => {
      e.stopPropagation();
      let { value } = searchInput;
      if (value.length <= 0) return;

      let { url, version } = parseInput(value);
      (async () => {
        try {
          let response = await getRequest(url);
          let result = await response.json();
          setState(
            // result?.results   ->   api.npms.io
            // result?.objects   ->   registry.npmjs.com
            result?.objects.map((obj) => {
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
            type: "error",
            name: "Error...",
            description: e?.message
          }]);
        }
      })();
    }, 250);

    searchInput?.addEventListener?.("keyup", keyUp);
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

  let dragHandleY = (target = ".flex-wrapper", section = ".drag-section#handle-2", handle = ".drag-handle") => {
    // Based on the tutorial at https://htmldom.dev/create-resizable-split-views/
    // Honestly, I am surprised that native dragging doesn't work for this use case
    const dragSection = document.querySelector(section) as HTMLElement;
    const dragHandle = dragSection.querySelector(handle) as HTMLElement;
    const targetEl = document.querySelector(target) as HTMLElement;

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
  };

  // Drag handle - Resizable Full height
  dragHandleY();

  // Drag handle - (Analyzer iframe) Resizable Full height
  dragHandleY("#analyzer", ".drag-section#handle-3");

  // Console solidjs component
  (async () => {
    const ConsoleEl = document.querySelector(".console code") as HTMLElement;
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
      ConsoleEl?.scrollTo?.(0, ConsoleEl.scrollHeight);
    });

    const scrollUpBtn = document.querySelector(".console-btns .console-to-top-btn");
    scrollUpBtn?.addEventListener("click", () => {
      ConsoleEl?.scrollTo?.(0, 0);
      setStickToBottom(false);
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
