import { ComponentProps, onCleanup } from "solid-js";
import { onMount, createSignal, Show } from "solid-js";

import Loading from "../../Loading";
import EditorButtons from "./EditorButtons";

import { state, setState, initial } from "../store";

import { OtherTSWorkerClient } from "../../../scripts/clients/other-ts-client";

let otherTSWorker = "document" in globalThis && new OtherTSWorkerClient();

export function Editor(props?: ComponentProps<'div'>) {
  let ref: HTMLDivElement = null;
  let loadingRef: HTMLDivElement = null;

  onMount(() => {

    (async () => {
      const { build, languages, inputModelResetValue, outputModelResetValue, configModelResetValue } = await import("../../../scripts/modules/monaco");
      const [editor, input, output, config] = build(ref);

      setState("monaco", {
        loading: false,
        editor,
        languages,
        workers: {
          other: otherTSWorker
        },
        initialValue: {
          input: inputModelResetValue,
          output: outputModelResetValue,
          config: configModelResetValue,
        },
        models: {
          input,
          output,
          config
        }
      });
    })();
  });

  onCleanup(() => {
    state.monaco.editor?.dispose?.();
    setState(initial);
  });

  return (
    <div class="editor-container">
      <div ref={ref} id="editor" custom-code-editor></div>
      <EditorButtons />

      <Show when={state.monaco.loading}>
        <Loading ref={loadingRef} />
      </Show>
    </div>
  )
}

export default Editor;