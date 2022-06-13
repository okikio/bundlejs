import type { ComponentProps } from "solid-js";

export interface Props extends ComponentProps<'div'> {
  max?: string;
  class?: string;
}

export function Container(props?: Props) {
  let {
    max = "md",
    class: className = "col",
    children,
    ...attrs
  } = props;

  return (
    <div class={`contain ${max} ${className}`} custom-container {...attrs}>
      {children}
    </div>
  );
}

export default Container;