import { Accessor, ComponentProps, createMemo, JSX, sharedConfig, untrack, ValidComponent, } from "solid-js";

import { createEffect, mergeProps, onCleanup, onMount, splitProps, $DEVCOMP } from "solid-js";
import { getNextElement, spread, SVGElements, Dynamic, createComponent } from "solid-js/web";


import type { Props, Instance, CreateSingletonProps } from 'tippy.js';

import tippy, { roundArrow, createSingleton, inlinePositioning } from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/animations/scale-subtle.css';

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
  animation: 'scale-subtle',
  hideOnClick: false,

  followCursor: 'horizontal',
  inlinePositioning: true,
  plugins: [followCursor, inlinePositioning],
  delay: [500, 0]
}

export function ToolTip(props?: ComponentProps<any> & { mobile?: string, as?: keyof JSX.IntrinsicElements, content?: Props["content"], allowHTML?: Props["allowHTML"], tooltip?: Partial<Props> }) {
  let instances: Instance<Props>[] = [];

  let [newProps, attrs] = splitProps(props, ["content", "allowHTML", "tooltip", "as", "ref"]);
  let mergedProps = mergeProps({
    as: "span",
    mobile: "(max-width: 640px)"
  }, newProps);

  const title = mergedProps?.allowHTML ? "Tooltip" : newProps?.content?.toString();
  let media = ("document" in globalThis) && globalThis?.matchMedia(mergedProps?.mobile);

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
    tippyProps = mergeProps({
      content: mergedProps?.content,
      allowHTML: mergedProps.allowHTML,

      ...defaultTippyOpts
    } as Partial<Props>, mergedProps.tooltip ?? {});

    instances?.forEach(instance => {
      instance?.setProps?.(tippyProps);
    });
  })

  onCleanup(() => {
    if (props.mobile)
      media?.removeEventListener?.("change", mediaQueryRun);
    instances?.forEach(instance => instance?.destroy?.());
  });

  return (
    <dynamic-el 
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

  let [newProps, attrs] = splitProps(props, ["tooltip", "target", "as", "ref"]);
  let mergedProps = mergeProps({
    // target: "[custom-button]",
    as: "span"
  }, newProps);

  let tippyProps = mergeProps({
    ...defaultTippyOpts,

    delay: [500, 0],
    overrides: ['placement'],
  } as Partial<Props>, mergedProps.tooltip ?? {});

  onMount(() => {
    let els = Array.from((mergedProps.target ? ref.querySelectorAll(mergedProps.target) : ref.children) ?? []);
    let tippyTargets = els.map(el => {
      return tippy(el as HTMLElement);
    });

    console.log(tippyTargets)
    instance = createSingleton(tippyTargets, tippyProps);
  });

  createEffect(() => {
    instance?.setProps?.(tippyProps);
  })

  onCleanup(() => {
    instance?.destroy?.();
  });
  
  return (
    <dynamic-el
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
