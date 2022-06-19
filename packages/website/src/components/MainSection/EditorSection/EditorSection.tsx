import { createSignal, onCleanup, onMount, type ComponentProps } from "solid-js";

import DragHandle from "./DragHandle";

import Activity from "./Activity";
import Console from "./Console";

import Editor from "./Editor";
import Tabs from "./Tabs";

const [direction, setDirection] = createSignal<"x" | "y">("x");

function onResize(e: MediaQueryListEvent | MediaQueryList) {
  e && setDirection(e.matches ? 'x' : 'y');
}

let mediaQuery = ("document" in globalThis) && globalThis?.matchMedia?.("(min-width: 640px)");
onResize(mediaQuery);

export function EditorSection(props?: ComponentProps<'div'>) {
  onMount(() => {
    // mediaQuery = globalThis?.matchMedia?.("(min-width: 640px)");
    // onResize(mediaQuery);
    mediaQuery?.addEventListener?.("change", onResize);
  });

  onCleanup(() => {
    mediaQuery?.removeEventListener?.("change", onResize);
  });

  return (
    <div class="contain px-none lg editor-section">
      <Tabs />
      <Activity />

      <div class="core">
        <Editor />
        <DragHandle direction={direction()} contrain={direction() == "x"} />
        <Console />
      </div>

      <DragHandle drag-height direction="y" />
    </div>
  )
}

export default EditorSection;