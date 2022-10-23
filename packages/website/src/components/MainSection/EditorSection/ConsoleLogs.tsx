import type { ComponentProps} from "solid-js";
import { splitProps } from "solid-js";

export function Log(props?: ComponentProps<"div">) { 
  const [newProps, attrs] = splitProps(props, ["class"]);
  return (
    <div class={`console-log ${newProps.class}`} {...attrs} />
  );
}