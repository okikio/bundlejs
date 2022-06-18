import {
  type Environment,
  editor as Editor,
  languages,
  Uri
} from "monaco-editor";

import { getPackage, getRequest, parseShareQuery, parseConfig } from "@bundlejs/core";

import GithubLight from "../utils/github-light";
import GithubDark from "../utils/github-dark";

import { SharedWorkerPolyfill as SharedWorker } from "@okikio/sharedworker";

import { mediaTheme, themeGet } from "../theme";
import TS_WORKER_FACTORY_URL from "../workers/ts-worker-factory.ts?url";

import TS_SHARED_WORKER from "../workers/typescript.ts?sharedworker";
import JSON_SHARED_WORKER from "../workers/json.ts?sharedworker";

import TS_WORKER from "../workers/typescript.ts?worker";
import JSON_WORKER from "../workers/json.ts?worker";
import EDITOR_WORKER from "../workers/editor.ts?worker";

// import TYPE_SCHEMA from "schema:./node_modules/esbuild-wasm/esm/browser.d.ts";

import { USE_SHAREDWORKER } from "../../env";
import { EasyDefaultConfig } from "../configs/options";
import { toLocaleDateString } from "../utils/locale-date-string";

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
(globalThis as any).MonacoEnvironment = {
  getWorker: function (_, label) {
    if (label === "typescript" || label === "javascript") {
      return USE_SHAREDWORKER ? new TS_SHARED_WORKER() : new TS_WORKER();
    } else if (label === "json") {
      return USE_SHAREDWORKER ? new JSON_SHARED_WORKER() : new JSON_WORKER();
    }

    return (() => {
      const EditorWorker = new EDITOR_WORKER();
      EditorWorker?.terminate?.();
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
export const build = (inputEl: HTMLDivElement): [Editor.IStandaloneCodeEditor, Editor.ITextModel, Editor.ITextModel, Editor.ITextModel] => {
  const html = document.querySelector("html");
  const oldShareURL = new URL(globalThis.location.toString());

  const initialValue = parseShareQuery(oldShareURL) || inputModelResetValue;
  const initialConfig = JSON.stringify(parseConfig(oldShareURL), null, "\t") || configModelResetValue;

  inputEl.textContent = "";

  // @ts-ignore
  Editor.defineTheme("dark", GithubDark);

  // @ts-ignore
  Editor.defineTheme("light", GithubLight);

  // Basically monaco on android is pretty bad, this makes it less bad
  // See https://github.com/microsoft/pxt/pull/7099 for this, and the long
  // read is in https://github.com/microsoft/monaco-editor/issues/563
  const isAndroid = navigator && /android/i.test(navigator.userAgent);

  const inputModel = Editor.createModel(initialValue, "typescript", Uri.parse("file://input.tsx"));
  const outputModel = Editor.createModel(outputModelResetValue, "typescript", Uri.parse("file://output.tsx"));
  const configModel = Editor.createModel(initialConfig, 'json', Uri.parse('file://config.json'));

  const editorOpts: Editor.IStandaloneEditorConstructionOptions = {
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
      let theme = themeGet(html);
      return theme == "system" ? mediaTheme() : theme;
    })(),
    automaticLayout: true,
    language: "typescript",
    lineNumbers: "on",
  };

  const editor = Editor.create(inputEl, editorOpts);
  editor.setModel(inputModel);

  document?.addEventListener("theme-change", () => {
    let theme = themeGet(html);
    Editor.setTheme(theme == "system" ? mediaTheme() : theme);
  });

  // languages.typescript.typescriptDefaults.setWorkerOptions({
  //   customWorkerPath: TS_WORKER_FACTORY_URL // new URL(TS_WORKER_FACTORY_URL, document.location.origin).toString()
  // });

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
    module: languages.typescript.ModuleKind.ESNext,
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

    jsx: languages.typescript.JsxEmit.ReactJSX,
  });

  // @ts-ignore
  languages.typescript.typescriptDefaults.setInlayHintsOptions({
    includeInlayParameterNameHints: "literals",
    includeInlayParameterNameHintsWhenArgumentMatchesName: true
  });

  languages.typescript.typescriptDefaults.setEagerModelSync(true);
  languages.typescript.typescriptDefaults.addExtraLib(
    "declare module 'https://*' {\n\texport * from \"https://unpkg.com/*\";\n}",
    `file://node_modules/@types/http/https.d.ts`
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
        const info = await getPackage(pkg);
        if (!info) return;

        // result?.results   ->   api.npms.io
        // result?.objects   ->   registry.npmjs.com
        const { name, description, version, date, publisher, links } = info ?? {};
        const author = publisher?.username;
        const _date = toLocaleDateString(date);
        const _author = author ? `by [@${author}](https://www.npmjs.com/~${author})` : "";
        const _repo_link = links?.repository ? `[GitHub](${links?.repository})  |` : "";

        return {
          contents: [].concat({
            value: [
              `### [${name}](${links?.npm}) v${version}`,
              `${description}`,
              ``,
              `Published on ${_date} ${_author}`,
              ``,
              `${_repo_link}  [Skypack](https://skypack.dev/view/${name})  |  [Unpkg](https://unpkg.com/browse/${name}/)  | [Openbase](https://openbase.com/js/${name})`
            ].join("\n"),
          }),
        };
      })();
    },
  });

  // Configure the JSON language support with schemas and schema associations
  // languages.json.jsonDefaults.setDiagnosticsOptions({
  //   validate: true,
  //   schemas: [
  //     {
  //       uri: "https://unpkg.com/esbuild-wasm/esm/browser.d.ts", // id of the first schema
  //       fileMatch: [configModel.uri.toString()], // associate with our model
  //       schema: TYPE_SCHEMA
  //     }
  //   ]
  // });

  return [editor, inputModel, outputModel, configModel];
};
