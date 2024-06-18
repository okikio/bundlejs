import type { ComponentProps, JSX } from "solid-js";

import { createEffect, onCleanup, onMount, splitProps } from "solid-js";
import { createDetailsEffect } from "../hooks/details";

import IconChevronRightArrow from "~icons/fluent/chevron-right-24-regular";

export function Details(props: ComponentProps<"details"> & {
  children?: JSX.Element;
  summary?: JSX.Element | string;
  summaryClass?: string;
  contentClass?: string;
}) {
  const [newProps, attrs] = splitProps(props, ["children", "summary", "summaryClass", "contentClass"]);

  const mergedProps = Object.assign({
    summaryClass: "px-4 py-2 cursor-pointer select-none",
    contentClass: "pl-4 pr-2 py-4",
  }, newProps);

  let ref: HTMLDetailsElement | undefined;
  let summaryRef: HTMLElement | undefined;
  let contentRef: HTMLDivElement | undefined;

  const {
    onClick: _onClick,
    onCleanup: _onCleanup,
    onMount: _onMount,
    isOpen,
    isExpanding,
    isClosing
  } = createDetailsEffect();

  onMount(() => _onMount(ref, summaryRef, contentRef));
  onCleanup(() => _onCleanup());

  let lastUrl = globalThis?.location?.href;
  createEffect(() => {
    if (isExpanding() || isOpen()) {
      if (typeof ref?.id === "string") {
        lastUrl = globalThis.location.href;
        globalThis.location.hash = `#${ref.id}`;
      }
    } else if (isClosing()) {
      const newUrl = new URL(lastUrl);
      newUrl.hash = "";
      history.pushState("", document.title, newUrl.href); 
    }
  });

  return (
    <details custom-details ref={ref} {...attrs}>
      <summary ref={summaryRef} onClick={_onClick} custom-summary>
        {typeof mergedProps.summary === "string" ? (<p class={mergedProps.summaryClass}>{mergedProps.summary}</p>) : mergedProps.summary}
        <IconChevronRightArrow astro-icon />
      </summary>
      <div class={"content " + mergedProps.contentClass} ref={contentRef} custom-content>
        {mergedProps.children}
      </div>
    </details>
  );
}

export default Details;