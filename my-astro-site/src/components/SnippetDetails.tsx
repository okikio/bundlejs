import { type ComponentProps, type JSX, onCleanup, onMount } from "solid-js";
import IconChevronRightArrow from "~icons/fluent/chevron-right-24-regular";
import { createDetailsEffect } from "../scripts/details";

export function SnippetDetails(props: ComponentProps<'details'> & {
  children?: JSX.Element;
  summary?: string;
}) {
  let {
    children,
    summary,
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
        <h3>{summary}</h3>
        <IconChevronRightArrow astro-icon />
      </summary>
      <div class="content" ref={contentRef} custom-content>
        {children}
      </div>
    </details>
  );
}

export default SnippetDetails;