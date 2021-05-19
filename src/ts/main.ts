import { importShim } from "./util/dynamic-import";
import * as Default from "./modules/default";
import { animate } from "@okikio/animate";

// The default navbar, etc... that is needed
Default.build();

let loadingContainer = document.querySelector(".center-container");
let Fade = animate({
    target: loadingContainer,
    opacity: [1, 0],
    easing: "ease-out",
    duration: 700,
    // endDelay: 200,
    autoplay: false
});

// Monaco Code Editor
(async () => {
    let Monaco = await importShim("./monaco.min.js");
    Monaco.build();

    // Fade away the loading screen
    Fade.play();
    await Fade;

    loadingContainer?.remove();
    Fade.stop();

    loadingContainer = null;
    Fade = null;
})();

// Esbuild Bundler
(async () => {
    let { default: size } = await importShim("./esbuild.min.js");
    console.log(await size(`export * from "esbuild";`));
})();