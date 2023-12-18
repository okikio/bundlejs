import { onCleanup, createEffect, createResource } from "solid-js";
import { debounce } from "@bundle/utils/src/mod.ts";

import Loading from "../../Loading";
import EditorButtons from "./EditorButtons";

import { state, setState, initial } from "../../../scripts/utils/store";

import { getShareURLValues } from "../../../scripts/utils/get-initial";
import { createShareURL } from "../../../scripts/utils/share";

const { configValue: configInitialValue } = "visualViewport" in globalThis && getShareURLValues();
const [monaco] = "visualViewport" in globalThis ? createResource(() => {
  return import("../../../scripts/modules/monaco");
}) : [];

export function Editor() {
  let ref: HTMLDivElement = null;
  let loadingRef: HTMLDivElement = null;

  createEffect(() => {
    if (monaco?.loading) return;
    const { build, languages, inputModelResetValue, outputModelResetValue } = monaco();
    const [editor, input, output, config, getModelType] = build(ref);

    setState("monaco", {
      loading: false,
      editor,
      languages,
      initialValue: {
        input: inputModelResetValue,
        output: outputModelResetValue,
        config: configInitialValue
      },
      models: {
        input,
        output,
        config
      }
    });

    // Update the URL share query every time user makes a change 
    editor.onDidChangeModelContent(
      debounce(async () => {
        const modelType = getModelType();
        if (modelType == "output") return;

        // const config = "{}";
        // try {
        //   // Set the max log limit for the virtual console, using the esbuild logLimit config option 
        //   if (modelType == "config") {
        //     // let config = JSON.parse(editor.getValue()) as BundleConfigOptions;
        //     // if (config?.esbuild?.logLimit) {
        //     //   SET_MAX_LOGS(config?.esbuild?.logLimit);
        //     // }
        //   }
        // } catch (e) { }

        console.log({
          shareUrl: await createShareURL()
        });

        globalThis.history.replaceState(null, null, await createShareURL());
      }, 1000)
    );
  });

  onCleanup(() => {
    state.monaco.editor?.dispose?.();
    setState(initial);
  });

  return (
    <div class="editor-container">
      <div ref={ref} id="editor" custom-code-editor />
      <EditorButtons />

      <Loading ref={loadingRef} show={state.monaco.loading} />
    </div>
  );
}

export default Editor;