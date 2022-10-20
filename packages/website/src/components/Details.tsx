import { ComponentProps, createEffect, JSX } from "solid-js";
import type { ClassValue } from "clsx";

import { onCleanup, onMount, splitProps, mergeProps } from "solid-js";
import { createDetailsEffect } from "../hooks/details";

import IconChevronRightArrow from "~icons/fluent/chevron-right-24-regular";

import clsx from "clsx";

export function Details(props: ComponentProps<'details'> & {
  children?: JSX.Element;
  summary?: JSX.Element | string;
  summaryClass?: ClassValue;
  contentClass?: ClassValue;
}) {
  let [newProps, attrs] = splitProps(props, ["children", "summary", "summaryClass", "contentClass"]);

  let mergedProps = Object.assign({
    summaryClass: "px-4 py-2 cursor-pointer select-none",
    contentClass: "pl-4 pr-2 py-4",
  }, newProps);

  let ref: HTMLDetailsElement;
  let summaryRef: HTMLElement;
  let contentRef: HTMLDivElement;

  let {
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
      if (typeof ref?.id == "string") {
        lastUrl = globalThis.location.href;
        globalThis.location.hash = `#${ref.id}`;
      }
    } else if (isClosing()) {
      let newUrl = new URL(lastUrl);
      newUrl.hash = '';
      history.pushState("", document.title, newUrl.href); 
    }
  });

  return (
    <details custom-details ref={ref} {...attrs}>
      <summary ref={summaryRef} onClick={_onClick} custom-summary>
        {typeof mergedProps.summary == "string" ? (<p class={clsx(mergedProps.summaryClass)}>{mergedProps.summary}</p>) : mergedProps.summary}
        <IconChevronRightArrow astro-icon />
      </summary>
      <div class={clsx("content", mergedProps.contentClass)} ref={contentRef} custom-content>
        {mergedProps.children}
      </div>
    </details>
  );
}

export default Details;