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

(async () => {
    let { init, size } = await importShim("./esbuild.min.js");
    await init();
    RunBtn.addEventListener("click", () => {
        let value = `` + editor?.getValue();
        if (value) {
            (async () => {
                fileSizeEl.innerHTML = `<div class="loading"></div>`;
                try {
                bundleTime.textContent = ``;

                let start = Date.now();
                let fileSize = await size(value);

                    bundleTime.textContent = `Bundled ${timeFormatter.format((Date.now() - start) / 1000, "seconds")}`;
                    fileSizeEl.textContent = `` + fileSize;
                } catch (e) {
                    console.warn(e);
                    fileSizeEl.textContent = `Error`;
                }
            })();
        }
    });
})();
