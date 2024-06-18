import type { ComponentProps, JSX } from "solid-js";
import { onCleanup, onMount } from "solid-js";

import Container from "../Container.tsx";
import SearchContainer from "./SearchSection/SearchContainer.tsx";
import EditorSection from "./EditorSection/EditorSection.tsx";
import Analysis from "./Analysis.tsx";
import Badges from "./Badges.tsx";

export const KEYCODE = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  ESC: "Escape",
};

export function MainSection(props: ComponentProps<"div"> = {}) {
  let ref: HTMLDivElement | undefined | null;
  let editorRef: HTMLDivElement | undefined | null;

  let searchEl: HTMLDialogElement | undefined | null;
  let tabBarEl: HTMLDivElement | undefined | null;

  function onKeyUp(e?: KeyboardEvent) {
    switch (e?.code) {
      case KEYCODE.ESC:
        if (searchEl?.open) tabBarEl?.focus();
        break;
    }
  }

  onMount(() => {
    if (ref) {
      searchEl = ref?.querySelector?.("dialog") as HTMLDialogElement & { open?: boolean; } | null;
    }

    if (editorRef) {
      tabBarEl = editorRef?.querySelector?.(".tab-bar button") as HTMLDivElement | null;
    }
  });

  onCleanup(() => {
    searchEl = null;
    tabBarEl = null;
  });

  return (
    <Container max="lg" ref={(el) => (ref = el)}>
      <Container class="px-none">
        <SearchContainer onKeyUp={onKeyUp} />
      </Container>

      <EditorSection ref={(el) => (editorRef = el)} />

      <Container class="lt-md:px-none pb-4 space-y-3">
        <Badges />
        <Analysis>{props?.children}</Analysis>
      </Container>
    </Container>
  );
}

export default MainSection;
