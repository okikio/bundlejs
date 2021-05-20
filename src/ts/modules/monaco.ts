import { editor as Editor, languages, Range } from "monaco-editor";
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
    let inputEl = document.querySelector("#editor") as HTMLElement;
    let inputEditor: Editor.IStandaloneCodeEditor;

    languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
        noSuggestionDiagnostics: false
    });

    // Compiler options
    languages.typescript.javascriptDefaults.setCompilerOptions({
        "moduleResolution": languages.typescript.ModuleResolutionKind.NodeJs,
        "target": languages.typescript.ScriptTarget.ES2020,
        "module": languages.typescript.ModuleKind.ES2015,
        "lib": [
            "es2019",
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

    inputEditor = Editor.create(inputEl, {
        value: `export * from "@okikio/native";`,
        minimap: {
            enabled: false,
        },
        scrollbar: {
            // Subtle shadows to the left & top. Defaults to true.
            useShadows: false,
            vertical: "auto",
        },
        "roundedSelection": true,
        "scrollBeyondLastLine": false,
        smoothScrolling: true,
        theme: themeGet(),
        automaticLayout: true,
        language: "javascript",
    });

    document.addEventListener("theme-change", () => {
        Editor.setTheme(themeGet());
    });

    return inputEditor;
};