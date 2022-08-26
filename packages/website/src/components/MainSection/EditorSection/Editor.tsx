import type { ComponentProps } from "solid-js";
import { onMount, createSignal, Show, onCleanup, createEffect, createResource } from "solid-js";

import Loading from "../../Loading";
import EditorButtons from "./EditorButtons";

import { state, setState, initial } from "../store";
import { OtherTSWorkerClient } from "../../../scripts/clients/other-ts-client";

// export const otherTSWorker = "document" in globalThis && new OtherTSWorkerClient();

export function Editor(props?: ComponentProps<'div'>) {
  let ref: HTMLDivElement = null;
  let loadingRef: HTMLDivElement = null;

  const [monaco, { mutate, refetch }] = createResource(() => {
    return import("../../../scripts/modules/monaco");
  });

  createEffect(async () => {
    if (!monaco()) return;
    const { build, languages, inputModelResetValue, outputModelResetValue, configModelResetValue } = monaco();
    const [editor, input, output, config] = build(ref);

    setState("monaco", {
      loading: false,
      editor,
      languages,
      // workers: {
      // other: otherTSWorker as any
      // },
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
  });

  onCleanup(() => {
    state.monaco.editor?.dispose?.();
    state.monaco.workers?.other?.dispose?.();
    setState(initial);
  });

  return (
    <div class="editor-container">
      <div ref={ref} id="editor" custom-code-editor></div>
      <EditorButtons />

      <Loading ref={loadingRef} show={state.monaco.loading} />
    </div>
  )
}

export default Editor;