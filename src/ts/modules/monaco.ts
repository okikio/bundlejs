// import { editor as Editor, languages } from "monaco-editor";

import "../../../node_modules/monaco-editor/esm/vs/language/typescript/monaco.contribution.js";
// import 'monaco-editor/esm/vs/language/css/monaco.contribution';
// import 'monaco-editor/esm/vs/language/json/monaco.contribution';
// import 'monaco-editor/esm/vs/language/html/monaco.contribution';

// import 'monaco-editor/esm/vs/basic-languages/monaco.contribution.js';
import "../../../node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js";

// export * from 'monaco-editor/esm/vs/editor/edcore.main';

// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js';
import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js";
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js';
import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js";
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js';

import "../../../node_modules/monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
// import '../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/anchorSelect/anchorSelect.js';
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js";
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js';
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions.js";
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/colorContributions.js';
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/comment/comment.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/dnd/dnd.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/find/findController.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/folding/folding.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/format/formatActions.js";
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/documentSymbols/documentSymbols.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/inlineCompletions/ghostTextController.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoSymbol/goToCommands.js';
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition.js";
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoError/gotoError.js';
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/hover/hover.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/indentation/indentation.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/inlayHints/inlayHintsController.js";
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace.js';
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js";
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/linkedEditing/linkedEditing.js';
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/links/links.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/rename/rename.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect.js";
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetController2.js';
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/tokenization/tokenization.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/unusualLineTerminators.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/viewportSemanticTokens/viewportSemanticTokens.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/wordPartOperations/wordPartOperations.js";
// Load up these strings even in VSCode, even if they are not used
// in order to get them translated
// import '../../../node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings.js';
import "../../../node_modules/monaco-editor/esm/vs/base/browser/ui/codicons/codiconStyles.js"; // The codicons are defined here and must be loaded

import {
    editor as Editor,
    languages,
} from "../../../node_modules/monaco-editor/esm/vs/editor/editor.api.js";

import GithubLight from "../util/github-light";
import GithubDark from "../util/github-dark";
import { themeGet } from "../scripts/theme";

import TYPESCRIPT_WORKER_URL from "worker:../workers/typescript.ts";
import EDITOR_WORKER_URL from "worker:../workers/editor.ts";

import { compressToURL, decompressFromURL } from "@amoutonbrady/lz-string";

import { animate } from "@okikio/animate";

// @ts-ignore
import prettier from "prettier/esm/standalone.mjs";
// @ts-ignore
import parserBabel from "prettier/esm/parser-babel.mjs";
import WebWorker from "../util/WebWorker.js";

const format = (code: string) => {
    return prettier.format(code, {
        parser: "babel-ts",
        plugins: [parserBabel],
    });
};

/**
 * Treeshake exports allow for specifing multiple exports per package, through this syntax
 * ```ts
 * "[x,y,z],[a,b,c]"
 * ```
 * where the brackets represent seperate packages
 */
export const parseTreeshakeExports = (str: string) =>
    (str ?? "").split(/\],/).map((str) => str.replace(/\[|\]/g, ""));

// Inspired by https://github.com/solidjs/solid-playground
export const parseSearchQuery = () => {
    try {
        const searchParams = new URL(String(document.location)).searchParams;
        let plaintext = searchParams.get("text");
        if (plaintext) return plaintext;

        let share = searchParams.get("share");
        if (share) return decompressFromURL(share);

        let query = searchParams.get("query") || searchParams.get("q");
        let treeshake = searchParams.get("treeshake");
        if (query) {
            let queryArr = query.split(",");
            let treeshakeArr = parseTreeshakeExports(treeshake);
            return (
                "// Click Run for the Bundled + Minified + Gzipped package size\n" +
                queryArr
                    .map((q, i) => {
                        let treeshakeExports =
                            treeshakeArr[i] && treeshakeArr[i].trim() !== "*"
                                ? `{ ${treeshakeArr[i]
                                      .trim()
                                      .split(",")
                                      .join(", ")} }`
                                : "*";
                        return `export ${treeshakeExports} from ${JSON.stringify(
                            q
                        )};`;
                    })
                    .join("\n")
            );
        }
    } catch (e) {}
};

export const initialValue =
    parseSearchQuery() ||
    `\
// Click Run for the Bundled + Minified + Gzipped package size
export * from "@okikio/animate";`;

export const debounce = (func: Function, timeout = 300) => {
    let timer: any;
    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
};

export const build = () => {
    let inputEl = document.querySelector(".app #editor") as HTMLElement;
    let outputEl = document.querySelector(".app#output #editor") as HTMLElement;

    inputEl.textContent = "";
    outputEl.textContent = "";

    let inputEditor: Editor.IStandaloneCodeEditor;
    let outputEditor: Editor.IStandaloneCodeEditor;

    languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
        noSuggestionDiagnostics: false,
    });

    // Compiler options
    languages.typescript.typescriptDefaults.setCompilerOptions({
        moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
        target: languages.typescript.ScriptTarget.ES2020,
        module: languages.typescript.ModuleKind.ES2015,
        noEmit: true,
        lib: ["ES2021", "DOM", "DOM.Iterable", "WebWorker", "ESNEXT", "NODE"],
        exclude: ["node_modules"],
        resolveJsonModule: true,
        isolatedModules: true,
        allowNonTsExtensions: true,
        esModuleInterop: true,
        noResolve: true
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
            if (label === "typescript" || label === "javascript") {
                let WorkerArgs = { name: `${label}-worker` };
                return new WebWorker(TYPESCRIPT_WORKER_URL, WorkerArgs);
            }

            return (() => {
                let WorkerArgs = { name: `editor-worker` };
                return new WebWorker(EDITOR_WORKER_URL, WorkerArgs);
            })();
        },
    };

    // @ts-ignore
    Editor.defineTheme("dark", GithubDark);

    // @ts-ignore
    Editor.defineTheme("light", GithubLight);

    let editorOpts: Editor.IStandaloneEditorConstructionOptions = {
        value: initialValue,
        minimap: {
            enabled: false,
        },
        inlayHints: {
            enabled: true
        },
        parameterHints: {
            enabled: true,
        },
        padding: {
            bottom: 15,
            top: 15,
        },
        scrollbar: {
            // Subtle shadows to the left & top. Defaults to true.
            useShadows: false,
            vertical: "auto",
        },
        wordWrap: "on",
        roundedSelection: true,
        scrollBeyondLastLine: true,
        smoothScrolling: true,
        theme: themeGet(),
        automaticLayout: true,
        language: "typescript",

        lineNumbers: "on",
    };

    inputEditor = Editor.create(
        inputEl,
        editorOpts
    );
    outputEditor = Editor.create(
        outputEl,
        Object.assign({}, editorOpts, {
            value: `// Output`,
        })
    );

    let editorBtns = (
        el: HTMLElement,
        editor: typeof inputEditor,
        reset: string
    ) => {
        let parentEl = el?.parentElement.querySelector(".editor-btns");
        if (parentEl) {
            let prettierBtn = parentEl.querySelector(".prettier-btn");
            let resetBtn = parentEl.querySelector(".reset-btn");
            let copyBtn = parentEl.querySelector(".copy-btn");
            let codeWrapBtn = parentEl.querySelector(".code-wrap-btn");
            let editorInfo = parentEl.querySelector(".editor-info");

            prettierBtn.addEventListener("click", () => {
                let value = `` + editor.getValue();
                editor.setValue(format(value));
                editor.getAction("editor.action.formatDocument").run();
            });

            resetBtn.addEventListener("click", () => {
                editor.setValue(reset);
            });

            copyBtn.addEventListener("click", () => {
                const range = editor.getModel().getFullModelRange();
                editor.setSelection(range);
                editor.getAction("editor.action.clipboardCopyWithSyntaxHighlightingAction").run();

                (async () => {
                    await animate({
                        target: editorInfo,
                        translateY: [100, "-100%"],
                        fillMode: "both",
                        duration: 500,
                        easing: "ease-out"
                    });
                        
                    await animate({
                        target: editorInfo, 
                        translateY: ["-100%", 100],                 
                        fillMode: "both",
                        delay: 1000
                    });
                    
                })();
            });

            codeWrapBtn.addEventListener("click", () => {
                let wordWrap: "on" | "off" =
                    editor.getRawOptions()["wordWrap"] == "on" ? "off" : "on";
                editor.updateOptions({ wordWrap });
            });
        }
    };

    editorBtns(
        inputEl,
        inputEditor,
        `\
// Click Run for the Bundled + Minified + Gzipped package size
export * from "@okikio/animate";`
    );
    editorBtns(outputEl, outputEditor, `// Output`);

    document.addEventListener("theme-change", () => {
        Editor.setTheme(themeGet());
    });

    return [inputEditor, outputEditor];
};
