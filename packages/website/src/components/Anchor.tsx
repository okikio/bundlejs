import type { ComponentProps } from "solid-js";
import type { ClassValue } from "clsx";

import { splitProps, mergeProps } from "solid-js";

import clsx from "clsx";
import IconArrowUpRight from "~icons/fluent/arrow-up-right-24-regular";

export function Anchor(props?: ComponentProps<'a'> & { class?: ClassValue, external?: boolean }) {
  let [newProps, attrs] = splitProps(props, ['href', 'class', 'external', 'children']);

  let mergedProps = mergeProps({
    external: /^(http|mailto)/.test(newProps.href)
  }, newProps);

  return (
    <a
      custom-anchor
      href={mergedProps.href}
      class={clsx({ "whitespace-nowrap": mergedProps.external }, mergedProps.class)}
      {...Object.assign(mergedProps.external ? { target: "_blank", rel: "noopener" } : {}, attrs)}
    >
      {mergedProps.children}
      {mergedProps.external && <IconArrowUpRight astro-icon external-icon />}
    </a>
  );
}

export default Anchor;