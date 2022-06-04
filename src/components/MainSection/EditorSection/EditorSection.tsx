import { ComponentProps, createSignal, onCleanup, onMount } from "solid-js";
import Tabs from "./Tabs";
import Activity from "./Activity";
import DragHandle from "./DragHandle";
import Editor from "./Editor";
import Console from "./Console";
import Analysis from "./Analysis";

export function EditorSection(props?: ComponentProps<'div'>) {
  const [direction, setDirection] = createSignal<"x" | "y">("x");

  function onResize(e: MediaQueryListEvent | MediaQueryList) {
    setDirection(e.matches ? 'x' : 'y');
  }

  onMount(() => {
    let mediaQuery = globalThis?.matchMedia?.("(min-width: 640px)");
    onResize(mediaQuery);
    mediaQuery?.addEventListener?.("change", onResize);

    onCleanup(() => {
      mediaQuery?.removeEventListener?.("change", onResize);
    });
  });

  return (
    <div class="contain lg editor-section">
      <Tabs />
      <Activity />

      <div class="core">
        <Editor />
        <DragHandle direction={direction()} contrain={true} />
        <Console />
      </div>

      <DragHandle drag-height direction="y" />

      <Analysis />
    </div>
  )
}

export default EditorSection;