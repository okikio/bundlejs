import { editor as Editor, languages } from "monaco-editor";

import GithubLight from "../util/github-light";
import GithubDark from "../util/github-dark";
import { themeGet } from "../theme";

export const initialValue = `\
// Click Run for the Bundled + Minified + Gzipped package size
export * from "@okikio/animate";`;

export const debounce = (func: Function, timeout = 300) => {
    let timer: any;
    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
};

export const build = () => {
    let inputEl = document.querySelector("#editor") as HTMLElement;
    let inputEditor: Editor.IStandaloneCodeEditor;

    languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
        noSuggestionDiagnostics: false
    });

    // Compiler options
    languages.typescript.typescriptDefaults.setCompilerOptions({
        "moduleResolution": languages.typescript.ModuleResolutionKind.NodeJs,
        "target": languages.typescript.ScriptTarget.ES2020,
        "module": languages.typescript.ModuleKind.ES2015,
        "noEmit": true,
        "lib": [
            "esnext",
            "dom",
            "node"
        ],
        "exclude": ["node_modules"],
        "resolveJsonModule": true,
        "isolatedModules": true,
        "allowNonTsExtensions": true,
        "esModuleInterop": true,
        "noResolve": true
    });

    // Read this on adding autocomplete to monaco:
    // https://blog.expo.io/building-a-code-editor-with-monaco-f84b3a06deaf
    // and
    // https://mono.software/2017/04/11/custom-intellisense-with-monaco-editor/
    // languages.registerHoverProvider('typescript', {
    //     provideHover: function (model, position) {
    //         // return xhr('../playground.html').then(function (res) {
    //         //     return {
    //         //         range: new Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
    //         //         contents: [
    //         //             { value: '**SOURCE**' },
    //         //             { value: '```html\n' + res.responseText.substring(0, 200) + '\n```' }
    //         //         ]
    //         //     }
    //         // });
    //     }
    // });

    // Since packaging is done by you, you need
    // to instruct the editor how you named the
    // bundles that contain the web workers.
    (window as any).MonacoEnvironment = {
        getWorker: function (moduleId, label) {
            if (label === "json") {
                return new Worker("./js/json.min.js", {
                    name: `${label}-worker`,
                    type: 'module'
                });
            }
            if (label === "css" || label === "scss" || label === "less") {
                return new Worker("./js/css.min.js", {
                    name: `${label}-worker`,
                    type: 'module'
                });
            }
            if (label === "html" || label === "handlebars" || label === "razor") {
                return new Worker("./js/html.min.js", {
                    name: `${label}-worker`,
                    type: 'module'
                });
            }
            if (label === "typescript" || label === "javascript") {
                return new Worker("./js/typescript.min.js", {
                    name: `${label}-worker`,
                    type: 'module'
                });
            }

            return new Worker("./js/editor.min.js", {
                name: "editor-worker",
                type: 'module'
            });
        },
    };

    // @ts-ignore
    Editor.defineTheme("dark", GithubDark);

    // @ts-ignore
    Editor.defineTheme("light", GithubLight);

    inputEditor = Editor.create(inputEl, {
        value: initialValue,
        minimap: {
            enabled: false,
        },
        scrollbar: {
            // Subtle shadows to the left & top. Defaults to true.
            useShadows: false,
            vertical: "auto",
        },
        wordWrap: "on",
        "roundedSelection": true,
        "scrollBeyondLastLine": false,
        smoothScrolling: true,
        theme: themeGet(),
        automaticLayout: true,
        language: "typescript",

        lineNumbers: "on"
    });

    document.addEventListener("theme-change", () => {
        Editor.setTheme(themeGet());
    });

    return inputEditor;
};
