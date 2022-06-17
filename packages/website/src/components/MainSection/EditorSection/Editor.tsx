import { ComponentProps, onCleanup } from "solid-js";
import { onMount, createSignal, Show } from "solid-js";

import Loading from "../../Loading";
import EditorButtons from "./EditorButtons";

import type { Editor as MonacoEditor } from "../../../scripts/modules/monaco";

import { state, setState } from "../store";

export function Editor(props?: ComponentProps<'div'>) {
  let ref: HTMLDivElement = null;
  let loadingRef: HTMLDivElement = null;

  onMount(() => {
    (async () => {
      const { build, languages } = await import("../../../scripts/modules/monaco");
      const [editor, ...models] = build(ref);
      setState("monaco", {
        loading: false,
        editor,
        languages,
        models
      });
    })();
  });

  onCleanup(() => {
    state.monaco.editor?.dispose?.();
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