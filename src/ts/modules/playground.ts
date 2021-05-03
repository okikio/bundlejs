import { importShim } from "../util/dynamic-import";
import { editor as Editor } from "monaco-editor";
import GithubLight from "../util/github-light";
import GithubDark from "../util/github-dark";
import { themeGet } from "../theme";

export const debounce = (func: Function, timeout = 300) => {
    let timer: any;
    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
};

export const build = () => {
    let divEl = document.querySelector("#editor") as HTMLElement;
    let editor: Editor.IStandaloneCodeEditor;

    // Since packaging is done by you, you need
    // to instruct the editor how you named the
    // bundles that contain the web workers.
    (window as any).MonacoEnvironment = {
        getWorkerUrl: function (moduleId, label) {
            if (label === "json") {
                return "./js/json.min.js";
            }
            if (label === "css" || label === "scss" || label === "less") {
                return "./js/css.min.js";
            }
            if (label === "html" || label === "handlebars" || label === "razor") {
                return "./js/html.min.js";
            }
            if (label === "typescript" || label === "javascript") {
                return "./js/typescript.min.js";
            }

            return "./js/editor.min.js";
        },
    };

    // @ts-ignore
    Editor.defineTheme("dark", GithubDark);

    // @ts-ignore
    Editor.defineTheme("light", GithubLight);

    editor = Editor.create(divEl, {
        value: `export {};`,
        minimap: {
            enabled: false,
        },
        scrollbar: {
            // Subtle shadows to the left & top. Defaults to true.
            useShadows: false,
            vertical: "auto",
        },
        theme: themeGet(),
        automaticLayout: true,
        language: "typescript",
    });

    document.addEventListener("theme-change", () => {
        Editor.setTheme(themeGet());
    });

    try {
        (async () => {
            const { default: size } = await importShim("./esbuild.js");

            /**
             * We need to debounce a bit the compilation because
             * it takes ~15ms to compile with the web worker...
             * Also, real time feedback can be stressful
             */
            let timer = window.setInterval(() => {
                (async () => {
                    console.log("Cool");
                    console.log(await size(`export * as pkg from "@okikio/native";`));
                })();
                window.clearInterval(timer);
            }, 500);
        })();
    } catch (e) {
        console.warn(`Esbuild has failed to load...`, e);
    }
};
