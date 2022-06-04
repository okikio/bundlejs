import type { ComponentProps } from "solid-js";
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
      build(ref);
      setIsLoading(false);
    })();
  });

  return (
    <div class="editor-container">
      <div ref={ref} class="editor" custom-code-editor></div>
      
      <Show when={isLoading()}>
        <Loading ref={loadingRef} />
      </Show>
      <EditorButtons />
    </div>
  )
}

export default Editor;