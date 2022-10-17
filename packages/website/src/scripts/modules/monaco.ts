import type { Environment } from "monaco-editor";
import {
  editor as Editor,
  languages,
  Uri
} from "monaco-editor";

import { getResolvedPackage } from "@bundlejs/core/src/util";

import GithubLight from "../utils/github-light";
import GithubDark from "../utils/github-dark";

import { SharedWorkerPolyfill as SharedWorker } from "@okikio/sharedworker";

import { mediaTheme, themeGet } from "../theme";

// import TS_SHARED_WORKER from "../workers/typescript.ts?sharedworker";

import TS_WORKER from "../workers/typescript.ts?worker";
import EDITOR_WORKER from "../workers/editor.ts?worker";

import CONFIG_DTS from "@bundlejs/core/src/index?dts";

import { toLocaleDateString } from "../utils/locale-date-string";
import { configModelResetValue, getShareURLValues } from "../utils/get-initial";
import { USE_SHAREDWORKER } from "../../env";

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
(globalThis as any).MonacoEnvironment = {
  getWorker: function (_, label) {
    if (label === "typescript" || label === "javascript") {
      // return new TS_SHARED_WORKER();
      // return USE_SHAREDWORKER ? new TS_SHARED_WORKER() : new TS_WORKER();
      return new TS_WORKER();
    }

    const EditorWorker = new EDITOR_WORKER();
    EditorWorker?.terminate?.();
    return EditorWorker;
  },
} as Environment;

export const outputModelResetValue = "// Output";
export const inputModelResetValue = [
  '// Click build for the bundled, minified and compressed package size',
  'export * from "@okikio/animate";'
].join("\n");
export { configModelResetValue };

export { languages, Editor, Uri };

export const createModel = (initialValue: string, lanuguage: string, uri: Uri) => {
  const model = Editor.getModel(uri);
  if (!model) return Editor.createModel(initialValue, lanuguage, uri)
  return model;
}

export function build(inputEl: HTMLDivElement) {
  const html = document.querySelector("html");

  const { inputValue, configValue } = getShareURLValues();
  const initialValue = inputValue || inputModelResetValue;

  inputEl.textContent = "";

  // @ts-ignore
  Editor.defineTheme("dark", GithubDark);

  // @ts-ignore
  Editor.defineTheme("light", GithubLight);

  // Basically monaco on android is pretty bad, this makes it less bad
  // See https://github.com/microsoft/pxt/pull/7099 for this, and the long
  // read is in https://github.com/microsoft/monaco-editor/issues/563
  const isAndroid = navigator && /android/i.test(navigator.userAgent);

  const inputModel = createModel(initialValue, "typescript", Uri.parse("file://input.tsx"));
  const outputModel = createModel(outputModelResetValue, "typescript", Uri.parse("file://output.tsx"));
  const configModel = createModel(configValue, 'typescript', Uri.parse('file://config.ts'));

  inputModel.updateOptions({ tabSize: 2 });
  outputModel.updateOptions({ tabSize: 2 });
  configModel.updateOptions({ tabSize: 2 });

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

  function getModelType() {
    if (editor.getModel() == inputModel) return "input";
    else if (editor.getModel() == outputModel) return "output";
    else return "config";
  }

  document?.addEventListener("theme-change", () => {
    let theme = themeGet(html);
    Editor.setTheme(theme == "system" ? mediaTheme() : theme);
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
  languages.typescript.typescriptDefaults.addExtraLib(
    `declare module '@bundlejs/core' {\n${CONFIG_DTS}\n}`,
    `file://node_modules/@bundlejs/core/config.d.ts`
  );

  const IMPORTS_REXPORTS_REQUIRE_REGEX =
    /(?:(?:import|export|require)(?:.)*?(?:from\s+|\((?:\s+)?)["']([^"']+)["'])\)?/g;

  languages.registerHoverProvider("typescript", {
    provideHover(model, position) {
      let content = model.getLineContent(position.lineNumber);
      if (typeof content != "string" || content.length == 0) return;

      let matches = Array.from(content.matchAll(IMPORTS_REXPORTS_REQUIRE_REGEX)) ?? [];
      if (matches.length <= 0) return;
      if (model == configModel && content.match("@bundlejs/core")) return;

      let matchArr = matches.map(([, pkg]) => pkg);
      let pkg = matchArr[0];

      if (/\.|http(s)?\:/.test(pkg)) return;

      // npm supporting CDN's only, as in exclude deno, github, etc...
      else if (/^(skypack|unpkg|jsdelivr|esm|esm\.run|esm\.sh)\:/.test(pkg))
        pkg = pkg.replace(/^(skypack|unpkg|jsdelivr|esm|esm\.run|esm\.sh)\:/, "");

      return (async () => {
        const info = await getResolvedPackage(pkg);
        if (!info) return;

        const { name, description, version, date, publisher, links } = info ?? {};
        const author = publisher?.username ?? info?.maintainers?.[0]?.name;
        const _date = date ? "on " + toLocaleDateString(date) : "";
        const _author = author ? `[@${author}](https://www.npmjs.com/~${author})` : "";
        const _repo_link = links?.repository ? `[GitHub](${links?.repository})  |` : "";
        const _npm_link = links?.npm ?? `https://www.npmjs.com/package/${name}`;
        const _version = version ? `v${version}` : '';

        return {
          contents: [].concat({
            value: [
              `### [${name}](${_npm_link}) ${_version}`,
              `${description}`,
              `Published by ${_author} ${_date}`,
              `${_repo_link}  [Skypack](https://skypack.dev/view/${name})  |  [Unpkg](https://unpkg.com/browse/${name}@${version}/)  | [Openbase](https://openbase.com/js/${name})`
            ].map(x => x.trim()).join("\n"),
          }),
        };
      })();
    },
  });

  return [editor, inputModel, outputModel, configModel, getModelType] as const;
};
