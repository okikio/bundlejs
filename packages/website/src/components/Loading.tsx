import { ComponentProps, createEffect, createSignal, mergeProps, splitProps } from "solid-js";

export interface LoadingProps extends ComponentProps<"div"> {
  size?: "sm" | "md" | "lg";
  'show'?: boolean;
  'play'?: boolean;
  'background'?: boolean;
}

export function Loading(props?: LoadingProps) {
  let [newProps, attrs] = splitProps(props, ["size", "show", "children", "background"]);
  let mergedProps = mergeProps({
    size: "md",
    'show': true,
    'background': true
  }, newProps);

  let timeout: string | number | NodeJS.Timeout;
  let [playState, setPlayState] = createSignal(mergedProps.show);
  createEffect(() => { 
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setPlayState(mergedProps.show);
    }, 300);
  });
  return (
    <div class="loading-container relative" custom-loading data-bg={mergedProps.background} data-show={mergedProps.show} {...attrs}>
      {mergedProps.children}
      <div class="loading" data-play={playState()} data-size={mergedProps.size}></div>
    </div>
  );
}

export default Loading;