import { onCleanup, createEffect, createResource } from "solid-js";
import { debounce } from "@bundle/utils/utils/async.ts";

import Loading from "../../Loading.tsx";
import EditorButtons from "./EditorButtons.tsx";

import { state, setState, initial } from "../../../scripts/utils/store.ts";

import { getShareURLValues } from "../../../scripts/utils/get-initial.ts";
import { createShareURL } from "../../../scripts/utils/share.tsx";

const { configValue: configInitialValue } = "document" in globalThis ? getShareURLValues() : { configValue : null };
const [monaco] = "document" in globalThis ? createResource(() => {
  return import("../../../scripts/modules/monaco.ts");
}) : [];

export function Editor() {
  let ref: HTMLDivElement | undefined | null;
  let loadingRef: HTMLDivElement | undefined | null;

  createEffect(() => {
    if (!monaco || !ref) return;
    if (monaco?.loading) return;

    const monacoModule = monaco?.();
    if (!monacoModule) return;

    const { build, languages, inputModelResetValue, outputModelResetValue } = monacoModule;
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
        if (modelType === "output") return;

        // const config = "{}";
        // try {
        //   // Set the max log limit for the virtual console, using the esbuild logLimit config option 
        //   if (modelType === "config") {
        //     // let config = JSON.parse(editor.getValue()) as BundleConfigOptions;
        //     // if (config?.esbuild?.logLimit) {
        //     //   SET_MAX_LOGS(config?.esbuild?.logLimit);
        //     // }
        //   }
        // } catch (e) { }

        console.log({
          shareUrl: await createShareURL()
        });

        globalThis.history.replaceState(null, "", await createShareURL());
      }, 1000)
    );
  });

  onCleanup(() => {
    state?.monaco?.editor?.dispose?.();
    setState?.(initial);

    loadingRef = null;
    ref = null;
  });

  return (
    <div class="editor-container">
      <div ref={(el) => (ref = el)} id="editor" custom-code-editor />
      <EditorButtons />

      <Loading ref={(el) => (loadingRef = el)} show={state.monaco.loading} />
    </div>
  );
}

export default Editor;