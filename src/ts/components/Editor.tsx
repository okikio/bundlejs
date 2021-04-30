import * as monaco from "monaco-editor";
import { createEffect } from "solid-js";
import { render } from "solid-js/web";

import GithubLight from "../util/light.json";
import GithubDark from "../util/dark.json";

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
// @ts-ignore
globalThis.MonacoEnvironment = {
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

export const Editor = () => {
    let divEl;
    let editor: monaco.editor.IStandaloneCodeEditor;
    createEffect(() => {
        editor = monaco.editor.create(divEl, {
            value: `export {};`,
            minimap: {
                enabled: false,
            },
            scrollbar: {
                // Subtle shadows to the left & top. Defaults to true.
                useShadows: false,
                vertical: "auto",
            },
            language: "typescript",
        });

        monaco.editor.defineTheme("dark", GithubDark);
        monaco.editor.defineTheme("light", GithubLight);

        monaco.editor.setTheme("dark");
    });

    return (
        <div
            id="editor"
            style={{
                height: "500px",
                width: "100%",
            }}
            ref={divEl}
        ></div>
    );
};

export const build = () => {
    render(() => <Editor />, document.getElementById("app"));
};
