import type { ComponentProps } from "solid-js";

import { splitProps, mergeProps } from "solid-js";
import IconArrowUpRight from "~icons/fluent/arrow-up-right-24-regular";

export function Anchor(props?: ComponentProps<'a'> & { external?: boolean }) {
  let [newProps, attrs] = splitProps(props, ['href', 'class', 'external', 'children']);

  let mergedProps = mergeProps({
    external: /^(http|mailto)/.test(newProps.href)
  }, newProps);

  return (
    <a
      custom-anchor
      href={mergedProps.href}
      class={(mergedProps.external ? "sm:whitespace-nowrap" : "") + " " + mergedProps.class}
      {...Object.assign(mergedProps.external ? { target: "_blank", rel: "noopener" } : {}, attrs)}
    >
      {mergedProps.children}
      {mergedProps.external && <IconArrowUpRight astro-icon external-icon />}
    </a>
  );
}

export default Anchor;