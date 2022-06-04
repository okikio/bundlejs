import type { ComponentProps } from "solid-js";
import { onMount } from "solid-js";


export function CodeEditor(props?: ComponentProps<'div'>) {
  let ref: HTMLDivElement = null;

  onMount(() => { 
    (async () => {
      const { build } = await import("../../../scripts/modules/monaco");
      build(ref);
    })();
  });

  return <div ref={ref} class="editor" custom-code-editor></div>;
}

export default CodeEditor;