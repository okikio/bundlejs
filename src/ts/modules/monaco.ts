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

import {
    editor as Editor,
    languages,
    Uri,
} from "../../../node_modules/monaco-editor/esm/vs/editor/editor.api.js";

import GithubLight from "../util/github-light";
import GithubDark from "../util/github-dark";
import WebWorker from "../util/WebWorker";
import { parseInput } from "../components/SearchResults";

import { mediaTheme, themeGet } from "../scripts/theme";

import TYPESCRIPT_WORKER_URL from "worker:../workers/typescript.ts";
import EDITOR_WORKER_URL from "worker:../workers/editor.ts";

import { decompressFromURL } from "@amoutonbrady/lz-string";
import { animate } from "@okikio/animate";

// @ts-ignore
import prettier from "prettier/esm/standalone.mjs";
// @ts-ignore
import parserBabel from "prettier/esm/parser-babel.mjs";

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

export const build = () => {
    let inputEl = document.querySelector(".app#input #editor") as HTMLElement;
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
    });

    // @ts-ignore
    languages.typescript.typescriptDefaults.setInlayHintsOptions({
        includeInlayParameterNameHints: "literals",
        includeInlayParameterNameHintsWhenArgumentMatchesName: true
    });

    languages.typescript.javascriptDefaults.setEagerModelSync(true);

    const IMPORTS_REXPORTS_REQUIRE_REGEX =
        /(?:(?:import|export|require)(?:.)*?(?:from\s+|\((?:\s+)?)["']([^"']+)["'])\)?/g;
    const FetchCache = new Map();

    languages.registerHoverProvider("typescript", {
        provideHover(model, position) {
            let content = model.getLineContent(position.lineNumber);
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
                let { url } = parseInput(pkg);
                let response: Response, result: any;

                try {
                    if (!FetchCache.has(url)) {
                        response = await fetch(url);
                        result = await response.json();
                        FetchCache.set(url, JSON.stringify(result));
                    } else {
                        result = JSON.parse(FetchCache.get(url));
                    }
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
                        value: `### [${name}](${
                            links?.npm
                        }) v${version}\n${description}\n\n\nPublished on ${_date} ${
                            author
                                ? `by [@${author}](https://www.npmjs.com/~${author})`
                                : ""
                        }\n\n${
                            links?.repository
                                ? `[GitHub](${links?.repository})  |`
                                : ""
                        }  [Skypack](https://skypack.dev/view/${name})  |  [Unpkg](https://unpkg.com/browse/${name}/)  | [Openbase](https://openbase.com/js/${name})`,
                    }),
                };
            })();
        },
    });

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
                let EditorWorker = new WebWorker(EDITOR_WORKER_URL, WorkerArgs);
                EditorWorker?.terminate();
                return EditorWorker;
            })();
        },
    };

    // @ts-ignore
    Editor.defineTheme("dark", GithubDark);

    // @ts-ignore
    Editor.defineTheme("light", GithubLight);

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

    languages.typescript.typescriptDefaults.addExtraLib(
        "declare module 'https://*' {\n\texport * from \"https://cdn.esm.sh/*\";\n}",
        `file://node_modules/@types/https.d.ts`
    );

    const REGEX_DETECT_IMPORT =
        /(?:(?:(?:import)|(?:export))(?:.)*?from\s+["']([^"']+)["'])|(?:\/+\s+<reference\s+path=["']([^"']+)["']\s+\/>)/g;

    const FetchedURLs = new Set();
    const TypeAquisition = (
        value = inputEditor.getValue(),
        origin?: string,
        pkg?: string
    ) => {
        [...value.matchAll(REGEX_DETECT_IMPORT)].forEach(([, imports]) => {
            (async () => {
                let content: string,
                    URLScheme = "";
                let http = /^http(s)?\:/.test(imports);
                let original = imports;

                if (imports == undefined || imports == "") return;

                try {
                    if (origin) {
                        let url = http
                            ? imports
                            : new URL(imports, origin).toString();
                        if (FetchedURLs.has(url)) return;
                        FetchedURLs.add(url);

                        if (!/^\./.test(imports)) return TypeAquisition(value);

                        let response = await fetch(url);
                        content = await response.text();

                        FetchedURLs.add(response.url);

                        // To avoid infinite loops, we limit type aquisition to 2 steps
                        // onEdit(content, response.url, pkg ?? imports);
                    } else {
                        [URLScheme] =
                            /^(skypack|unpkg|jsdelivr|esm|esm\.run|esm\.sh)\:/.exec(
                                pkg ?? imports
                            ) ?? [""];
                        imports = imports.replace(
                            /^(skypack|unpkg|jsdelivr|esm|esm\.run|esm\.sh)\:/,
                            ""
                        );

                        if (http) {
                            let { pathname } = new URL(imports);
                            imports = pathname;
                        }

                        let url = new URL(
                            imports,
                            `https://cdn.esm.sh/`
                        ).toString();

                        if (FetchedURLs.has(url)) return;
                        FetchedURLs.add(url);

                        let response = await fetch(url);
                        let dts = response.headers.get("X-TypeScript-Types");
                        FetchedURLs.add(response.url);

                        let types = await fetch(dts);
                        content = await types.text();
                        FetchedURLs.add(types.url);

                        TypeAquisition(content, types.url, imports);
                    }
                } catch (e) {
                    console.warn(`[Monaco - Type Aquisition] Missing Types`, e);
                    return;
                }

                content = content.split(/\n/).join("\n\t");
                languages.typescript.typescriptDefaults.addExtraLib(
                    `declare module '${pkg ?? imports}' {\n\t${content}\n}\n` +
                        (URLScheme
                            ? `declare module '${URLScheme}${
                                  pkg ?? imports
                              }' {\n\t${content}\n}\n`
                            : "") +
                        (http
                            ? `declare module '${original}' {\n\t${content}\n}`
                            : ""),
                    `file://node_modules/${
                        /(\.ts)$/.test(imports) ? imports : imports + ".d.ts"
                    }`
                );
            })();
        });
    };

    TypeAquisition();

    let timer: number;
    inputEditor.onDidChangeModelContent(() => {
        window.clearTimeout(timer);
        timer = window.setTimeout(TypeAquisition, 1000);
    });

    const editorBtns = (
        el: HTMLElement,
        editor: typeof inputEditor,
        reset: string
    ) => {
        let parentEl = el?.parentElement.querySelector(".editor-btns");
        if (parentEl) {
            let clearBtn = parentEl.querySelector(".clear-btn");
            let prettierBtn = parentEl.querySelector(".prettier-btn");
            let resetBtn = parentEl.querySelector(".reset-btn");
            let copyBtn = parentEl.querySelector(".copy-btn");
            let codeWrapBtn = parentEl.querySelector(".code-wrap-btn");
            let editorInfo = parentEl.querySelector(".editor-info");

            clearBtn.addEventListener("click", () => {
                editor.setValue("");
            });

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
                editor
                    .getAction(
                        "editor.action.clipboardCopyWithSyntaxHighlightingAction"
                    )
                    .run();

                (async () => {
                    await animate({
                        target: editorInfo,
                        translateY: [100, "-100%"],
                        fillMode: "both",
                        duration: 500,
                        easing: "ease-out",
                    });

                    await animate({
                        target: editorInfo,
                        translateY: ["-100%", 100],
                        fillMode: "both",
                        delay: 1000,
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
        let theme = themeGet();
        Editor.setTheme(theme == "system" ? mediaTheme() : theme);
    });

    return [inputEditor, outputEditor];
};
