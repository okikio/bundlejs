import "../../../node_modules/monaco-editor/esm/vs/language/typescript/monaco.contribution.js";
import "../../../node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js";

import "../../../node_modules/monaco-editor/esm/vs/language/json/monaco.contribution.js";
// import "../../../node_modules/monaco-editor/esm/vs/basic-languages/json/json.contribution.js";

import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js";
import "../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js";

import "../../../node_modules/monaco-editor/esm/vs/editor/editor.all.js";

import {
    editor as Editor,
    languages,
    Uri
} from "../../../node_modules/monaco-editor/esm/vs/editor/editor.api.js";
import type { Environment } from "../../../node_modules/monaco-editor/esm/vs/editor/editor.api";

import GithubLight from "../util/github-light";
import GithubDark from "../util/github-dark";
import WebWorker, { WorkerConfig } from "../util/WebWorker";

import { mediaTheme, themeGet } from "../theme";
import { parseSearchQuery, parseInput, parseConfig } from "../util/parse-query";

import TS_WORKER_FACTORY_URL from "worker:../workers/ts-worker-factory.ts";
import TYPESCRIPT_WORKER_URL from "worker:../workers/typescript.ts";
import JSON_WORKER_URL from "worker:../workers/json.ts";
import EDITOR_WORKER_URL from "worker:../workers/editor.ts";

import TYPE_SCHEMA from "schema:./node_modules/esbuild-wasm/esm/browser.d.ts";

import { getRequest } from "../util/cache.js";
import { USE_SHAREDWORKER } from "../../../env";
import { EasyDefaultConfig } from "../configs/bundle-options.js";
import { toLocaleDateString } from "../components/SearchResults.jsx";

export const TS_WORKER = USE_SHAREDWORKER ? new WebWorker(TYPESCRIPT_WORKER_URL, { name: "ts-worker" }) : new Worker(TYPESCRIPT_WORKER_URL, { name: "ts-worker" });

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
(window as any).MonacoEnvironment = {
    getWorker: function (_, label) {
        if (label === "typescript" || label === "javascript") {
            return TS_WORKER; 
        } else if (label === "json") {
            // JSON Language Workers currently have no exports so I can't get SharedWorkers to work with them
            const JSON_WORKER = new Worker(JSON_WORKER_URL, { name: "json-worker" }); // USE_SHAREDWORKER ? new WebWorker(JSON_WORKER_URL, { name: "json-worker" }) : 
            return JSON_WORKER; 
        }

        return (() => {
            let EditorWorker = new Worker(EDITOR_WORKER_URL, { name: "editor-worker" });
            EditorWorker?.terminate();
            return EditorWorker;
        })();
    },
} as Environment;

export const outputModelResetValue = "// Output";
export const inputModelResetValue = [
    '// Click Build for the bundled, minified and compressed package size',
    'export * from "@okikio/animate";'
].join("\n");
export const configModelResetValue = JSON.stringify(EasyDefaultConfig, null, "\t"); // Indented with tab

export { languages, Editor, Uri };
export const build = (oldShareURL: URL): [Editor.IStandaloneCodeEditor, Editor.ITextModel, Editor.ITextModel, Editor.ITextModel] => {
    const initialValue =
        parseSearchQuery(oldShareURL) || inputModelResetValue;

    const initialConfig =
        JSON.stringify(parseConfig(oldShareURL), null, "\t") || configModelResetValue;

    let inputEl = document.querySelector(".app#input #editor") as HTMLElement;
    inputEl.textContent = "";

    // @ts-ignore
    Editor.defineTheme("dark", GithubDark);

    // @ts-ignore
    Editor.defineTheme("light", GithubLight);

    // Basically monaco on android is pretty bad, this makes it less bad
    // See https://github.com/microsoft/pxt/pull/7099 for this, and the long
    // read is in https://github.com/microsoft/monaco-editor/issues/563
    const isAndroid = navigator && /android/i.test(navigator.userAgent);

    let inputModel = Editor.createModel(initialValue, "typescript", Uri.parse("file://input.tsx"));
    let outputModel = Editor.createModel(outputModelResetValue, "typescript", Uri.parse("file://output.tsx"));
    let configModel = Editor.createModel(initialConfig, 'json', Uri.parse('file://config.json'));

    let editorOpts: Editor.IStandaloneEditorConstructionOptions = {
        model: null,
        // @ts-ignore
        bracketPairColorization: {
            enabled: true,
        },
        parameterHints: {
            enabled: true,
        },
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

    let editor = Editor.create(inputEl, editorOpts);
    editor.setModel(inputModel);

    document.addEventListener("theme-change", () => {
        let theme = themeGet();
        Editor.setTheme(theme == "system" ? mediaTheme() : theme);
    });

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
    
        // jsx: languages.typescript.JsxEmit.ReactJSX,
        // @ts-ignore
        jsx: "react"
    });
    
    // @ts-ignore
    languages.typescript.typescriptDefaults.setInlayHintsOptions({
        includeInlayParameterNameHints: "literals",
        includeInlayParameterNameHintsWhenArgumentMatchesName: true
    });
    
    languages.typescript.typescriptDefaults.setEagerModelSync(true);
    languages.typescript.typescriptDefaults.addExtraLib(
        "declare module 'https://*' {\n\texport * from \"https://unpkg.com/*\";\n}",
        `file://node_modules/@types/https.d.ts`
    );

    const IMPORTS_REXPORTS_REQUIRE_REGEX =
        /(?:(?:import|export|require)(?:.)*?(?:from\s+|\((?:\s+)?)["']([^"']+)["'])\)?/g;
    
    languages.registerHoverProvider("typescript", {
        provideHover(model, position) {
            let content = model.getLineContent(position.lineNumber);
            if (typeof content != "string" || content.length == 0) return;
    
            let matches = Array.from(content.matchAll(IMPORTS_REXPORTS_REQUIRE_REGEX)) ?? [];
            if (matches.length <= 0) return;
    
            let matchArr = matches.map(([, pkg]) => pkg);
            let pkg = matchArr[0];
            
            if (/\.|http(s)?\:/.test(pkg)) return;
            
            // npm supporting CDN's only, as in exclude deno, github, etc...
            else if (/^(skypack|unpkg|jsdelivr|esm|esm\.run|esm\.sh)\:/.test(pkg)) 
                pkg = pkg.replace(/^(skypack|unpkg|jsdelivr|esm|esm\.run|esm\.sh)\:/, "");
    
            return (async () => {
                let { url, version: inputedVersion } = parseInput(pkg);
                let result: any;
    
                try {
                    let response = await getRequest(url, false);
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
                const { name, description, version, date, publisher, links } = result?.results?.[0]?.package ?? {};
                let author = publisher?.username;
                let _date = toLocaleDateString(date);
                let _author = author ? `by [@${author}](https://www.npmjs.com/~${author})` : "";
                let _repo_link = links?.repository ? `[GitHub](${links?.repository})  |` : "";
            
    
                return {
                    contents: [].concat({
                        value: `\
### [${name}](${links?.npm}) v${inputedVersion || version}
${description}

Published on ${_date} ${_author}

${_repo_link}  [Skypack](https://skypack.dev/view/${name})  |  [Unpkg](https://unpkg.com/browse/${name}/)  | [Openbase](https://openbase.com/js/${name})`,
                    }),
                };
            })();
        },
    });

    // Configure the JSON language support with schemas and schema associations
    languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
            {
                uri: "https://unpkg.com/esbuild-wasm/esm/browser.d.ts", // id of the first schema
                fileMatch: [configModel.uri.toString()], // associate with our model
                schema: TYPE_SCHEMA 
            }
        ]
    });
    
    return [editor, inputModel, outputModel, configModel];
};
