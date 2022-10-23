import type { ComponentProps, JSX } from "solid-js";
import type { Props, Instance, CreateSingletonProps } from "tippy.js";

import { createEffect, mergeProps, onCleanup, onMount, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import tippy, { roundArrow, createSingleton, inlinePositioning } from "tippy.js";
import "tippy.js/dist/tippy.css"; // optional for styling
import "tippy.js/dist/svg-arrow.css";
import "tippy.js/animations/scale-subtle.css";

import { followCursor } from "./plugins/follow-cursor";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "dynamic-el": JSX.IntrinsicElements["div"];
    }
  }
}

export const defaultTippyOpts: Partial<Props> = {
  inertia: true,
  arrow: roundArrow,
  animation: "scale-subtle",
  hideOnClick: false,

  followCursor: "horizontal",
  inlinePositioning: true,
  plugins: [followCursor, inlinePositioning],
  delay: [200, 0]
};

export function ToolTip(props?: ComponentProps<any> & { mobile?: string, as?: keyof JSX.IntrinsicElements, content?: Props["content"], allowHTML?: Props["allowHTML"], tooltip?: Partial<Props> }) {
  let instances: Instance<Props>[] = [];

  const [newProps, attrs] = splitProps(props, ["content", "allowHTML", "tooltip", "as", "ref"]);
  const mergedProps = Object.assign({
    as: "dynamic-el",
    mobile: "(max-width: 640px)"
  }, newProps);

  const media = ("document" in globalThis) && globalThis?.matchMedia(mergedProps?.mobile);

  function mediaQueryRun(e?: MediaQueryListEvent) {
    if (e?.matches)
      instances?.forEach(instance => instance?.enable?.());
    else
      instances?.forEach(instance => instance?.disable?.());
  }

  let ref: HTMLElement;
  let tippyProps = mergeProps({
    content: mergedProps?.content,
    allowHTML: mergedProps.allowHTML,

    ...defaultTippyOpts
  } as Partial<Props>, mergedProps.tooltip ?? {});

  onMount(() => {
    const children = Array.from(ref.children ?? []);
    instances = tippy(children as HTMLElement[], tippyProps);
    instances?.forEach(instance => instance?.enable?.());

    if (props.mobile) {
      mediaQueryRun(media as unknown as MediaQueryListEvent);
      media?.addEventListener?.("change", mediaQueryRun);
    }
  });

  createEffect(() => {
    tippyProps = Object.assign({
      content: mergedProps?.content,
      allowHTML: mergedProps.allowHTML,

      ...defaultTippyOpts
    } as Partial<Props>, mergedProps.tooltip ?? {});

    instances?.forEach(instance => {
      instance?.setProps?.(tippyProps);
    });
  });

  onCleanup(() => {
    if (props.mobile)
      media?.removeEventListener?.("change", mediaQueryRun);
    instances?.forEach(instance => instance?.destroy?.());
  });

  return (
    <Dynamic
      component={mergedProps.as}
      custom-tooltip
      {...attrs}
      ref={(el: HTMLElement) => {
        ref = el;
        typeof mergedProps.ref == "function" ? mergedProps.ref(el) : (mergedProps.ref = ref);
      }}
    />
  );
}

export function SingletonToolTip(props?: ComponentProps<any> & { tooltip?: CreateSingletonProps<Props> }) {
  let instance: Instance<Props> = null;
  let ref: HTMLElement = null;

  const [newProps, attrs] = splitProps(props, ["tooltip", "target", "as", "ref"]);
  const mergedProps = Object.assign({
    target: "[custom-button]",
    as: "dynamic-el"
  }, newProps);

  const tippyProps = Object.assign({
    ...defaultTippyOpts,

    delay: [500, 0],
    overrides: ["placement"],
  } as Partial<Props>, mergedProps.tooltip ?? {});

  onMount(() => {
    const els = Array.from((mergedProps.target ? ref.querySelectorAll(mergedProps.target) : ref.children) ?? []);
    const tippyTargets = els.map(el => {
      return tippy(el as HTMLElement);
    });

    instance = createSingleton(tippyTargets, tippyProps);
  });

  createEffect(() => {
    instance?.setProps?.(tippyProps);
  });

  onCleanup(() => {
    instance?.destroy?.();
  });

  return (
    <Dynamic
      component={mergedProps.as}
      custom-tooltip
      {...attrs}
      ref={(el: HTMLElement) => {
        ref = el;
        typeof mergedProps.ref == "function" ? mergedProps.ref(el) : (mergedProps.ref = ref);
      }}
    />
  );
}

export default ToolTip;
