import type { editor as Editor } from "monaco-editor";
import { animate } from "@okikio/animate";

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

    const { Emitter } = await import("./components/SearchResults");
    Emitter.on("add-module", (v) => {
        let value = `` + editor?.getValue();
        editor.setValue(value + "\n" + v);
    });
})();

// esbuild bundler worker
import ESBUILD_WORKER_URL from "worker:./workers/esbuild.ts";
(() => {
    const timeFormatter = new Intl.RelativeTimeFormat('en', { style: 'narrow', numeric: 'auto' });

    // @ts-ignore
    const BundleWorker = new Worker(ESBUILD_WORKER_URL, {
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
})();