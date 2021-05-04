import { importShim } from "../util/dynamic-import";

import { editor as Editor, languages } from "monaco-editor";
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

    // Compiler options
    languages.typescript.typescriptDefaults.setCompilerOptions({
        "moduleResolution": languages.typescript.ModuleResolutionKind.NodeJs,
        "target": languages.typescript.ScriptTarget.ES2020,
        "module": languages.typescript.ModuleKind.ES2015,
        "lib": [
            "ES2019",
            "DOM",
            "DOM.Iterable"
        ],
        "resolveJsonModule": true,
        "isolatedModules": true,
        "allowNonTsExtensions": true,
        "esModuleInterop": true,
        "noResolve": true
    });


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
        value: `// @ts-ignore\nexport * from "rollup";`,
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

};
