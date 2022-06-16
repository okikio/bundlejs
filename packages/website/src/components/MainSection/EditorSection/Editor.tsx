import { ComponentProps, onCleanup } from "solid-js";
import { onMount, createSignal, Show } from "solid-js";

import Loading from "../../Loading";
import EditorButtons from "./EditorButtons";

export function Editor(props?: ComponentProps<'div'>) {
  let ref: HTMLDivElement = null;
  let loadingRef: HTMLDivElement = null;

  const [isLoading, setIsLoading] = createSignal(true);
  onMount(() => {
    (async () => {
      const { build } = await import("../../../scripts/modules/monaco");
      const [editor] = build(ref);
      setIsLoading(false);
      onCleanup(() => {
        editor.dispose();
      });
    })();
  });

  return (
    <div class="editor-container">
      <div ref={ref} id="editor" custom-code-editor></div>
      <EditorButtons />

      <Show when={isLoading()}>
        <Loading ref={loadingRef} />
      </Show>
    </div>
  )
}

export default Editor;