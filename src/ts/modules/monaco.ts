// import { editor as Editor, languages } from "monaco-editor";

import '../../../node_modules/monaco-editor/esm/vs/language/typescript/monaco.contribution.js';
// import 'monaco-editor/esm/vs/language/css/monaco.contribution';
// import 'monaco-editor/esm/vs/language/json/monaco.contribution';
// import 'monaco-editor/esm/vs/language/html/monaco.contribution';

// import 'monaco-editor/esm/vs/basic-languages/monaco.contribution.js';
import '../../../node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js';

// export * from 'monaco-editor/esm/vs/editor/edcore.main';

// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js';

import '../../../node_modules/monaco-editor/esm/vs/editor/browser/controller/coreCommands.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/anchorSelect/anchorSelect.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/colorPicker/colorContributions.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/comment/comment.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/dnd/dnd.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/find/findController.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/folding/folding.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/format/formatActions.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/documentSymbols/documentSymbols.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/inlineCompletions/ghostTextController.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoSymbol/goToCommands.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/gotoError/gotoError.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/hover/hover.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/indentation/indentation.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/inlayHints/inlayHintsController.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/linkedEditing/linkedEditing.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/links/links.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/rename/rename.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect.js';
// import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/snippet/snippetController2.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/tokenization/tokenization.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/unusualLineTerminators.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/viewportSemanticTokens/viewportSemanticTokens.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations.js';
import '../../../node_modules/monaco-editor/esm/vs/editor/contrib/wordPartOperations/wordPartOperations.js';
// Load up these strings even in VSCode, even if they are not used
// in order to get them translated
// import '../../../node_modules/monaco-editor/esm/vs/editor/common/standaloneStrings.js';
import '../../../node_modules/monaco-editor/esm/vs/base/browser/ui/codicons/codiconStyles.js'; // The codicons are defined here and must be loaded

import { editor as Editor, languages } from '../../../node_modules/monaco-editor/esm/vs/editor/editor.api.js';

import GithubLight from "../util/github-light";
import GithubDark from "../util/github-dark";
import { themeGet } from "./theme";

import TYPESCRIPT_WORKER_URL from "worker:../workers/typescript.ts";
import EDITOR_WORKER_URL from "worker:../workers/editor.ts";

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
            if (label === "typescript" || label === "javascript") {
                return new Worker(TYPESCRIPT_WORKER_URL, {
                    name: `${label}-worker`,
                    type: 'module'
                });
            }

            return new Worker(EDITOR_WORKER_URL, {
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
