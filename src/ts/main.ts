import { importShim } from "./util/dynamic-import";
import * as Default from "./modules/default";
import { animate } from "@okikio/animate";
import { editor as Editor } from "monaco-editor";

// The default navbar, etc... that is needed
Default.build();

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
    let Monaco = await importShim("./monaco.min.js");
    editor = Monaco.build();

    // Fade away the loading screen
    Fade.play();
    await Fade;

    loadingContainerEl?.remove();
    Fade.stop();

    loadingContainerEl = null;
    Fade = null;
})();

// esbuild Bundler
let timeFormatter = new Intl.RelativeTimeFormat('en', { style: 'narrow', numeric: 'auto' });

// @ts-ignore
export const Esbuild = new Worker("./js/esbuild.min.js");

(async () => {
    let count = 0;

    RunBtn.addEventListener("click", () => {
        let value = `` + editor?.getValue();
        if (value) {
            (async () => {
                fileSizeEl.innerHTML = `<div class="loading"></div>`;

                try {
                    let start = Date.now();
                    bundleTime.textContent = ``;
                    Esbuild.postMessage(value);
                    let { size, content } = await new Promise<{ content: string, size: string }>((resolve, reject) => {
                        Esbuild.onmessage = ({ data }) => {
                            if (data.error) reject(data.error);
                            else resolve(data);
                        };
                    });

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
                } catch (error) {
                    console.warn(error);
                    fileSizeEl.textContent = `Error`;
                }
            })();
        }
    });
})();