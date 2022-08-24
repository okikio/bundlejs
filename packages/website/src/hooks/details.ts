import { createEffect, createSignal } from "solid-js";

export interface IAnimateChange {
  open: boolean;
  initial: () => void;
  onCancel: () => void;
}

export function createDetailsEffect() {
  let [isClosing, setIsClosing] = createSignal(false);
  let [isExpanding, setIsExpanding] = createSignal(false);

  let animation: Animation = null;
  let contentAnimation: Animation = null;

  let ref: HTMLDetailsElement;
  let summaryRef: HTMLElement;
  let contentRef: HTMLDivElement;
  let anchorRef: HTMLAnchorElement;

  function onMount(_ref?: HTMLDetailsElement, _summaryRef?: HTMLElement, _contentRef?: HTMLDivElement) {
    ref = _ref;
    summaryRef = _summaryRef;
    contentRef = _contentRef;
    anchorRef = _summaryRef?.querySelector?.('a');

    createEffect(() => {
      // @ts-ignore
      ref.dataset.isClosing = isClosing();

      // @ts-ignore
      ref.dataset.isExpanding = isExpanding();
    });

    hashChange();
    globalThis?.addEventListener?.('hashchange', hashChange);
  }

  function hashChange() {
    let { hash } = globalThis.location;

    if (ref && hash && hash.length) {
      if (ref.open != true && ref.id == hash.slice(1)) {
        onClick();
      }
    }
  }

  function onClick(e?: MouseEvent) {
    if (
      e?.target &&
      (
        anchorRef == (e?.target as HTMLElement) ||
        anchorRef?.contains?.((e?.target as HTMLElement))
      )
    ) return;

    e && e?.preventDefault?.();

    // Add an overflow on the <details> to avoid content overflowing
    ref.style.overflow = "hidden";

    // Check if the element is being closed or is already closed
    if (isClosing() || !ref.open) animate("open"); 

    // Check if the element is being openned or is already open
    else if (isExpanding() || ref.open) animate("shrink");
  }

  function animate(mode: "open" | "shrink") {
    const isOpen = mode == "open";
    if (isOpen) {
      // Apply a fixed height on the element
      ref.style.height = `${ref.offsetHeight}px`;

      // Force the [open] attribute on the details element
      ref.open = true;

      // Set the element as "being expanding"
      setIsExpanding(true);
    } else {
      // Set the element as "being closed"
      setIsClosing(true);
    }

    const contentValue = isOpen ? contentRef.offsetHeight : 0;

    const startValue = ref.offsetHeight;
    const endValue = summaryRef.offsetHeight + contentValue;

    const startHeight = `${startValue}px`;
    const endHeight = `${endValue}px`;

    const opacity = isOpen ? [0, 1] : [1, 0];
    const dist = Math.abs(endValue - startValue);
    const timingOpts = {
      // For longer content reduce the speed at which the details element opens and closes
      duration: (isOpen ? 500 : 300) + (200 * (dist / 500)),
      easing: "ease-out",
    };

    // If there is already an animation running
    if (animation || contentAnimation) {
      // Cancel the current animation
      animation?.cancel?.();
      contentAnimation?.cancel?.();
    }

    // Animate from the start height to the end height
    animation = ref.animate({ height: [startHeight, endHeight] }, timingOpts);
    contentAnimation = contentRef.animate({ opacity }, timingOpts);

    animation.oncancel = () => {
      if (mode)
        setIsExpanding(false);
      else
        setIsClosing(false);
    };

    animation.onfinish = () => {
      ref.open = isOpen;

      // Clear the stored animations
      animation = null;
      contentAnimation = null;

      // Reset isClosing & isExpanding
      setIsClosing(false);
      setIsExpanding(false);

      // Remove the overflow hidden and the fixed height
      ref.style.height = ref.style.overflow = "";
    };
  }

  function onCleanup() {
    animation?.cancel?.();
    contentAnimation?.cancel?.();

    ref = null;
    summaryRef = null;
    contentRef = null;

    animation = null;
    contentAnimation = null;

    setIsClosing(false);
    setIsExpanding(false);

    globalThis?.removeEventListener?.('hashchange', hashChange);
  }

  return {
    onMount,
    onClick,
    onCleanup
  };
}

export default createDetailsEffect;