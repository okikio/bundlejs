import * as monaco from "monaco-editor";
import GithubLight from "../util/light.json";
import GithubDark from "../util/dark.json";
import { themeGet } from "./theme";

export const build = () => {
    let divEl = document.querySelector("#editor") as HTMLElement;
    let editor: monaco.editor.IStandaloneCodeEditor;

    // Since packaging is done by you, you need
    // to instruct the editor how you named the
    // bundles that contain the web workers.
    // @ts-ignore
    globalThis.MonacoEnvironment = {
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
    monaco.editor.defineTheme("dark", GithubDark);

    // @ts-ignore
    monaco.editor.defineTheme("light", GithubLight);
    
    editor = monaco.editor.create(divEl, {
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
        language: "typescript",
    });

    document.addEventListener("theme-change", () => {
        monaco.editor.setTheme(themeGet());
    });
};