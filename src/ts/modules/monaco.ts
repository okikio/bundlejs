import "../../../node_modules/monaco-editor/esm/vs/language/typescript/monaco.contribution.js";

import "../../../node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js";

import "../../../node_modules/monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/comment/comment.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/dnd/dnd.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/find/findController.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/folding/folding.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/format/formatActions.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/hover/hover.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/indentation/indentation.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/inlayHints/inlayHintsController.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/links/links.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/rename/rename.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect.js";
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
import "../../../node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings.js";
import "../../../node_modules/monaco-editor/esm/vs/base/browser/ui/codicons/codiconStyles.js"; // The codicons are defined here and must be loaded

// import { editor as Editor, languages } from "monaco-editor";
// import 'monaco-editor/esm/vs/language/css/monaco.contribution';
// import 'monaco-editor/esm/vs/language/json/monaco.contribution';
// import 'monaco-editor/esm/vs/language/html/monaco.contribution';
// import 'monaco-editor/esm/vs/basic-languages/monaco.contribution.js';

// export * from 'monaco-editor/esm/vs/editor/edcore.main';
// import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/anchorSelect/anchorSelect.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/colorContributions.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/documentSymbols/documentSymbols.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/inlineCompletions/ghostTextController.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoSymbol/goToCommands.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoError/gotoError.js";
// import "../../../node_modules/monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace.js";

// import { setupTypeAcquisition } from "@typescript/ata";
// import ts from "typescript";

// const addLibraryToRuntime = (code: string, _path: string) => {
//     const path = "file://" + _path
//     languages.typescript.typescriptDefaults.addExtraLib(code, path)
//     const uri = Uri.file(path)
//     if (Editor.getModel(uri) === null) {
//       Editor.createModel(code, "typescript", uri)
//     }
//     console.log(`[ATA] Adding ${path} to runtime`, { code })
// }

// const TypeAquisition = setupTypeAcquisition({
//     projectName: "My ATA Project",
//     typescript: ts,
//     logger: console,
//     delegate: {
//       receivedFile: addLibraryToRuntime,
//       started: () => {
//         console.log("ATA start")
//       },
//       progress: (downloaded: number, total: number) => {
//         console.log(`Got ${downloaded} out of ${total}`)
//       },
//       finished: vfs => {
//         console.log("ATA done", Array.from(vfs.keys()))
//       },
//     },
// })

// const REGEX_DETECT_IMPORT =
// /(?:(?:(?:import)|(?:export))(?:.)*?from\s+["']([^"']+)["'])|(?:\/+\s+<reference\s+path=["']([^"']+)["']\s+\/>)/g;
// const FetchedURLs = new Set();
// const TypeAquisition = (value: string, origin?: string, pkg?: string) => {
//     [...value.matchAll(REGEX_DETECT_IMPORT)].forEach(([, imports]) => {
//         (async () => {
//             let content: string,
//                 URLScheme = "";
//             let http = /^http(s)?\:/.test(imports);
//             let original = imports;

//             if (imports == undefined || imports == "") return;

//             try {
//                 if (origin) {
//                     let url = http
//                         ? imports
//                         : new URL(imports, origin).toString();
//                     if (FetchedURLs.has(url)) return;
//                     FetchedURLs.add(url);

//                     if (!/^\./.test(imports)) return TypeAquisition(value);

//                     let response = await fetch(url);
//                     content = await response.text();

//                     FetchedURLs.add(response.url);

//                     // To avoid infinite loops, we limit type aquisition to 2 steps
//                     // onEdit(content, response.url, pkg ?? imports);
//                 } else {
//                     [URLScheme] =
//                         /^(skypack|unpkg|jsdelivr|esm|esm\.run|esm\.sh)\:/.exec(
//                             pkg ?? imports
//                         ) ?? [""];
//                     imports = imports.replace(
//                         /^(skypack|unpkg|jsdelivr|esm|esm\.run|esm\.sh)\:/,
//                         ""
//                     );

//                     if (http) {
//                         let { pathname } = new URL(imports);
//                         imports = pathname;
//                     }

//                     let url = new URL(
//                         imports,
//                         `https://cdn.esm.sh/`
//                     ).toString();

//                     if (FetchedURLs.has(url)) return;
//                     FetchedURLs.add(url);

//                     let response = await fetch(url);
//                     let dts = response.headers.get("X-TypeScript-Types");
//                     FetchedURLs.add(response.url);

//                     let types = await fetch(dts);
//                     content = await types.text();
//                     FetchedURLs.add(types.url);

//                     TypeAquisition(content, types.url, imports);
//                 }
//             } catch (e) {
//                 console.warn(`[Monaco - Type Aquisition] Missing Types`, e);
//                 return;
//             }

//             content = content.split(/\n/).join("\n\t");
//             languages.typescript.typescriptDefaults.addExtraLib(
//                 `declare module '${pkg ?? imports}' {\n\t${content}\n}\n` +
//                 (URLScheme
//                     ? `declare module '${URLScheme}${pkg ?? imports
//                     }' {\n\t${content}\n}\n`
//                     : "") +
//                 (http
//                     ? `declare module '${original}' {\n\t${content}\n}`
//                     : ""),
//                 `file://node_modules/${/(\.ts)$/.test(imports) ? imports : imports + ".d.ts"
//                 }`
//             );
//         })();
//     });
// };

import {
    editor as Editor,
    languages,
    Uri
} from "../../../node_modules/monaco-editor/esm/vs/editor/editor.api.js";
import type { Environment } from "../../../node_modules/monaco-editor/esm/vs/editor/editor.api";

import GithubLight from "../util/github-light";
import GithubDark from "../util/github-dark";
import WebWorker, { WorkerConfig } from "../util/WebWorker";

import { mediaTheme, themeGet } from "./theme";
import { parseSearchQuery, parseInput } from "../util/parse-query";

import TS_WORKER_FACTORY_URL from "worker:../workers/ts-worker-factory.ts";
import TYPESCRIPT_WORKER_URL from "worker:../workers/typescript.ts";
import EDITOR_WORKER_URL from "worker:../workers/editor.ts";
import { CACHE_NAME } from "../plugins/http.js";
        
export const TS_WORKER = new WebWorker(TYPESCRIPT_WORKER_URL, { name: "ts-worker" });

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
(window as any).MonacoEnvironment = {
    getWorker: function (_, label) {
        if (label === "typescript" || label === "javascript") {
            return TS_WORKER; 
        }

        return (() => {
            let EditorWorker = new Worker(EDITOR_WORKER_URL, { name: "editor-worker" });
            EditorWorker?.terminate();
            return EditorWorker;
        })();
    },
} as Environment;

languages.typescript.typescriptDefaults.setWorkerOptions({
    customWorkerPath: new URL(TS_WORKER_FACTORY_URL, document.location.origin).toString()
});

languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    ...languages.typescript.typescriptDefaults.getDiagnosticsOptions(),
    // noSemanticValidation: false,
    
    noSemanticValidation: true,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: false,

    // This is when tslib is not found
    diagnosticCodesToIgnore: [2354],
});

// Compiler options
languages.typescript.typescriptDefaults.setCompilerOptions({
    moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
    target: languages.typescript.ScriptTarget.Latest,
    module: languages.typescript.ModuleKind.ES2015,
    noEmit: true,
    lib: ["es2021", "dom", "dom.iterable", "webworker", "esnext", "node"],
    exclude: ["node_modules"],
    resolveJsonModule: true,
    allowNonTsExtensions: true,
    esModuleInterop: true,
    noResolve: true,
    allowSyntheticDefaultImports: true,
    isolatedModules: true,
    
    experimentalDecorators: true,
    emitDecoratorMetadata: true,

    jsx: languages.typescript.JsxEmit.React,
});

// @ts-ignore
languages.typescript.typescriptDefaults.setInlayHintsOptions({
    includeInlayParameterNameHints: "literals",
    includeInlayParameterNameHintsWhenArgumentMatchesName: true
});

languages.typescript.typescriptDefaults.setEagerModelSync(true);
languages.typescript.typescriptDefaults.addExtraLib(
    "declare module 'https://*' {\n\texport * from \"https://cdn.esm.sh/*\";\n}",
    `file://node_modules/@types/https.d.ts`
);

// (?:(?:import|export|require)(?:\s?(.*)?\s?)(?:from\s+|\((?:\s+)?)["']([^"']+)["'])\)?
const IMPORTS_REXPORTS_REQUIRE_REGEX =
    /(?:(?:import|export|require)(?:.)*?(?:from\s+|\((?:\s+)?)["']([^"']+)["'])\)?/g;
const FetchCache = new Set();

languages.registerHoverProvider("typescript", {
    provideHover(model, position) {
        let content = model.getLineContent(position.lineNumber);
        if (typeof content != "string" || content.length == 0) return;

        let matches =
            Array.from(content.matchAll(IMPORTS_REXPORTS_REQUIRE_REGEX)) ??
            [];
        if (matches.length <= 0) return;

        let matchArr = matches.map(([, pkg]) => pkg);
        let pkg = matchArr[0];

        if (/\.|http(s)?\:/.test(pkg)) return;
        else if (
            /^(skypack|unpkg|jsdelivr|esm|esm\.run|esm\.sh)\:/.test(pkg)
        ) {
            pkg = pkg.replace(
                /^(skypack|unpkg|jsdelivr|esm|esm\.run|esm\.sh)\:/,
                ""
            );
        }

        return (async () => {
            let { url, version: inputedVersion } = parseInput(pkg);
            let result: any;

            let cache = await caches.open(CACHE_NAME);
            let request = new Request(url);

            try {
                let cacheResponse = await cache.match(request);
                let response = cacheResponse;

                if (!cacheResponse) {
                    let networkResponse = await fetch(request);
                    cache.put(request, networkResponse.clone());
                    response = networkResponse;
                }

                result = await response.json();
            } catch (e) {
                console.warn(e);
                return;
            }

            // result?.results   ->   api.npms.io
            // result?.objects   ->   registry.npmjs.com
            if (result?.results.length <= 0) return;

            // result?.results   ->   api.npms.io
            // result?.objects   ->   registry.npmjs.com
            const { name, description, version, date, publisher, links } =
                result?.results?.[0]?.package ?? {};
            let author = publisher?.username;
            let _date = new Date(date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            return {
                contents: [].concat({
                    value: `### [${name}](${links?.npm
                        }) v${inputedVersion || version}\n${description}\n\n\nPublished on ${_date} ${author
                            ? `by [@${author}](https://www.npmjs.com/~${author})`
                            : ""
                        }\n\n${links?.repository
                            ? `[GitHub](${links?.repository})  |`
                            : ""
                        }  [Skypack](https://skypack.dev/view/${name})  |  [Unpkg](https://unpkg.com/browse/${name}/)  | [Openbase](https://openbase.com/js/${name})`,
                }),
            };
        })();
    },
});

export { languages, Editor, Uri };
export const build = (oldShareURL: URL) => {
    const initialValue =
        parseSearchQuery(oldShareURL) ||
        [
            '// Click Run for the Bundled, Minified & Gzipped package size',
            'export * from "@okikio/animate";',
        ].join("\n");

    let inputEl = document.querySelector(".app#input #editor") as HTMLElement;
    let outputEl = document.querySelector(".app#output #editor") as HTMLElement;

    inputEl.textContent = "";
    outputEl.textContent = "";

    let inputEditor: Editor.IStandaloneCodeEditor;
    let outputEditor: Editor.IStandaloneCodeEditor;

    // @ts-ignore
    Editor.defineTheme("dark", GithubDark);

    // @ts-ignore
    Editor.defineTheme("light", GithubLight);

    // Basically android and monaco is pretty bad, this makes it less bad
    // See https://github.com/microsoft/pxt/pull/7099 for this, and the long
    // read is in https://github.com/microsoft/monaco-editor/issues/563
    const isAndroid = navigator && /android/i.test(navigator.userAgent)
    let editorOpts: Editor.IStandaloneEditorConstructionOptions = {
        // @ts-ignore
        bracketPairColorization: {
            enabled: true,
        },
        parameterHints: {
            enabled: true,
        },
        model: Editor.createModel(
            initialValue,
            "typescript",
            Uri.parse("file://input.ts")
        ),
        quickSuggestions: {
            other: !isAndroid,
            comments: !isAndroid,
            strings: !isAndroid,
        },
        acceptSuggestionOnCommitCharacter: !isAndroid,
        acceptSuggestionOnEnter: !isAndroid ? "on" : "off",
        // accessibilitySupport: !isAndroid ? "on" : "off",
        minimap: {
            enabled: false,
        },
        padding: {
            bottom: 2.5,
            top: 2.5,
        },
        scrollbar: {
            // Subtle shadows to the left & top. Defaults to true.
            useShadows: false,
            vertical: "auto",
        },
        lightbulb: { enabled: true },
        wordWrap: "on",
        roundedSelection: true,
        scrollBeyondLastLine: true,
        smoothScrolling: true,
        theme: (() => {
            let theme = themeGet();
            return theme == "system" ? mediaTheme() : theme;
        })(),
        automaticLayout: true,
        language: "typescript",
        lineNumbers: "on",
    };

    inputEditor = Editor.create(inputEl, editorOpts);
    outputEditor = Editor.create(outputEl, {
        ...editorOpts,
        model: Editor.createModel(
            `// Output`,
            "typescript",
            Uri.parse("file://output.ts")
        ),
    });

    document.addEventListener("theme-change", () => {
        let theme = themeGet();
        Editor.setTheme(theme == "system" ? mediaTheme() : theme);
    });

    return [inputEditor, outputEditor];
};
