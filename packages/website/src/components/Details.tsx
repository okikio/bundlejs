import type { ComponentProps, JSX } from "solid-js";
import { onCleanup, onMount, splitProps, mergeProps } from "solid-js";
import IconChevronRightArrow from "~icons/fluent/chevron-right-24-regular";
import { createDetailsEffect } from "../scripts/modules/details";

export function Details(props: ComponentProps<'details'> & {
  children?: JSX.Element;
  summary?: string;
  summaryClass?: string;
  contentClass?: string;
}) {
  let [newProps, attrs] = splitProps(props, ["children", "summary", "summaryClass", "contentClass"]);

  let mergedProps = mergeProps( {
    summaryClass: "px-4 py-2 cursor-pointer select-none",
    contentClass: "pl-4 pr-2 py-4",
  }, newProps)

  let ref: HTMLDetailsElement;
  let summaryRef: HTMLElement;
  let contentRef: HTMLDivElement;

  let {
    onClick: _onClick,
    onCleanup: _onCleanup,
    onMount: _onMount
  } = createDetailsEffect();

  onMount(() => _onMount(ref, summaryRef, contentRef));
  onCleanup(() => _onCleanup());

  return (
    <details ref={ref} {...attrs} custom-details>
      <summary ref={summaryRef} onClick={_onClick} custom-summary>
        <p class={mergedProps.summaryClass}>{mergedProps.summary}</p>
        <IconChevronRightArrow astro-icon />
      </summary>
      <div class={`content ${mergedProps.contentClass}`} ref={contentRef} custom-content>
        {mergedProps.children}
      </div>
    </details>
  );
}

export default Details;