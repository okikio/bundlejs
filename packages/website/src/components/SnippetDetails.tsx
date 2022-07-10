import { type ComponentProps, type JSX, onCleanup, onMount, splitProps } from "solid-js";
import { createDetailsEffect } from "../scripts/modules/details";

import IconChevronRightArrow from "~icons/fluent/chevron-right-24-regular";
import IconLink from "~icons/fluent/link-24-regular";

export function SnippetDetails(props: ComponentProps<'details'> & {
  children?: JSX.Element;
  summary?: string;
}) {
  let [newProps, attrs] = splitProps(props, ["children", "summary"]);

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
    <details custom-detail="snippet" ref={ref} {...attrs}>
      <summary ref={summaryRef} onClick={_onClick} custom-summary>
        <h3>
          {newProps.summary}
          <a href={"#" + attrs.id} custom-slug-link aria-hidden="true">
            <IconLink rehype-icon="link-24-regular" />
          </a>
        </h3>
        <IconChevronRightArrow astro-icon />
      </summary>
      <div class="content" ref={contentRef} custom-content>
        {newProps.children}
      </div>
    </details>
  );
}

export default SnippetDetails;