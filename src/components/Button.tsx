import { ComponentProps, ParentProps } from "solid-js";

export function Button(props: ParentProps<ComponentProps<'button'>>) {
  let {
    type = "button",
    children,
    ...attrs
  } = props;

  return (
    <button {...attrs} custom-button>
      {children}
    </button>
  );
}

export default Button;