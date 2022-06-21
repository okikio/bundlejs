import { ComponentProps, createEffect, createSignal, mergeProps, onCleanup, onMount, splitProps, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

import tippy, { type Props, type Instance, type CreateSingletonProps, roundArrow, createSingleton, inlinePositioning } from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/animations/scale-subtle.css';

import { followCursor } from "./plugins/follow-cursor";

export const defaultTippyOpts: Partial<Props> = {
  inertia: true,
  arrow: roundArrow,
  animation: 'scale-subtle',
  hideOnClick: false,

  followCursor: 'horizontal',
  inlinePositioning: true,
  plugins: [followCursor, inlinePositioning]
}

export function ToolTip(props?: ComponentProps<any> & { mobile?: string, as?: keyof JSX.IntrinsicElements, content?: Props["content"], allowHTML?: Props["allowHTML"], tooltip?: Partial<Props> }) {
  let ref: HTMLElement = null;
  let instance: Instance<Props> = null;

  let [newProps, attrs] = splitProps(props, ["children", "content", "allowHTML", "tooltip", "as", "ref"]);
  let mergedProps = mergeProps({
    as: "span",
    mobile: "(max-width: 640px)"
  }, newProps);

  const title = mergedProps?.allowHTML ? "Tooltip" : newProps?.content?.toString();
  let media = ("document" in globalThis) && globalThis?.matchMedia(mergedProps?.mobile);

  function mediaQueryRun(e?: MediaQueryListEvent) {
    if (e?.matches)
      instance?.enable?.();
    else
      instance?.disable?.();
  }

  let tippyProps = mergeProps({
    content: mergedProps?.content,
    allowHTML: mergedProps.allowHTML,

    ...defaultTippyOpts
  } as Partial<Props>, mergedProps.tooltip ?? {});

  onMount(() => {
    instance = tippy(ref, tippyProps);

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

    instance?.setProps?.(tippyProps);
  })

  onCleanup(() => {
    if (props.mobile)
      media?.removeEventListener?.("change", mediaQueryRun);
    instance?.destroy?.();
  });

  return (
    <Dynamic component={mergedProps.as} title={title} custom-tooltip {...attrs} ref={(el: HTMLElement) => {
      ref = el;
      typeof mergedProps.ref == "function" ? mergedProps.ref(el) : (mergedProps.ref = ref);
    }}>
      {mergedProps.children}
    </Dynamic>
  );
}


export function SingletonToolTip(props?: ComponentProps<any> & { as?: keyof JSX.IntrinsicElements, target?: Iterable<Node> | ArrayLike<Node> | string, tooltip?: CreateSingletonProps<Props> }) {
  let instance: Instance<Props> = null;
  let ref: HTMLDivElement = null;

  let [newProps, attrs] = splitProps(props, ["children", "tooltip", "target", "as"]);
  let mergedProps = mergeProps({
    target: "[custom-tooltip]",
    as: "div"
  }, newProps);

  let tippyProps = mergeProps({
    ...defaultTippyOpts,

    delay: [0, 200],
    overrides: ['placement'],
  } as Partial<Props>, mergedProps.tooltip ?? {});

  onMount(() => {

    let els = Array.from(typeof mergedProps?.target == "string" ? ref?.querySelectorAll?.(mergedProps?.target) : mergedProps?.target);
    let tippyTargets = els.map(el => {
      return tippy(el as HTMLElement);
    });

    instance = createSingleton(tippyTargets, tippyProps);
  });

  createEffect(() => {
    instance?.setProps?.(tippyProps);
  })

  onCleanup(() => {
    instance?.destroy?.();
  });

  return (
    <Dynamic component={mergedProps.as} custom-tooltip {...attrs} ref={ref}>
      {mergedProps.children}
    </Dynamic>
  );
}

export default ToolTip;

