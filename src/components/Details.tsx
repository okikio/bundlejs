import { type ComponentProps, type JSX, onCleanup, onMount } from "solid-js";
import IconChevronRightArrow from "~icons/fluent/chevron-right-24-regular";
import { createDetailsEffect } from "../scripts/modules/details";

export function Details(props: ComponentProps<'details'> & {
  children?: JSX.Element;
  summary?: string;
  summaryClass?: string;
  contentClass?: string;
}) {
  let {
    children,
    summary,
    summaryClass = "px-4 py-2 cursor-pointer select-none",
    contentClass = "pl-4 pr-2 py-4",
    ...attrs
  } = props;

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
        <p class={summaryClass}>{summary}</p>
        <IconChevronRightArrow astro-icon />
      </summary>
      <div class={`content ${contentClass}`} ref={contentRef} custom-content>
        {children}
      </div>
    </details>
  );
}

export default Details;