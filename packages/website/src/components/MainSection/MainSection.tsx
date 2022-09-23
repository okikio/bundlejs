import type { ComponentProps, JSX } from "solid-js";
import { onCleanup, onMount } from "solid-js";

import Container from "../Container";
import SearchContainer from "./SearchSection/SearchContainer";
import EditorSection from "./EditorSection/EditorSection";
import Analysis from "./Analysis";

export const KEYCODE = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  ESC: "Escape"
}

export function MainSection(props?: ComponentProps<'div'>) {
  let ref: HTMLDivElement = null;
  let editorRef: HTMLDivElement = null;

  let searchEl: HTMLDialogElement = null;
  let tabBarEl: HTMLDivElement = null;

  function onKeyUp(e?: KeyboardEvent) {
    switch (e.code) {
      case KEYCODE.ESC:
        if (searchEl?.open) 
          tabBarEl?.focus();
        break;
    }
  }

  onMount(() => {
    searchEl = ref.querySelector('dialog') as unknown as (HTMLDialogElement & { open?: boolean });
    tabBarEl = editorRef.querySelector(".tab-bar button");
  });

  onCleanup(() => {
    searchEl = null;
    tabBarEl = null;
  });

  return (
    <Container max="lg" ref={ref}>
      <Container class="px-none">
        <SearchContainer onKeyUp={onKeyUp} />
      </Container>
  
      <EditorSection ref={editorRef} /> 
  
      <Container class="lt-md:px-none pb-4">
        <Analysis>{props.children}</Analysis>
      </Container>
    </Container>
  );
}

export default MainSection;