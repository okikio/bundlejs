import type { ComponentProps } from "solid-js";

export interface LoadingProps extends ComponentProps<"div"> {
  size?: "sm" | "md" | "lg";
}

export function Loading(props?: LoadingProps) {
  let size = props?.size ?? "md";
  return (
    <div class="loading-container relative" {...props}>
      <div class="loading" data-size={size}></div>
    </div>
  );
}

export default Loading;