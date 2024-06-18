import { createEffect, createSignal } from "solid-js";

export interface IAnimateChange {
  open: boolean;
  initial: () => void;
  onCancel: () => void;
}

export function createDetailsEffect() {
  const [isClosing, setIsClosing] = createSignal(false);
  const [isExpanding, setIsExpanding] = createSignal(false);
  const [isOpen, setIsOpen] = createSignal(false);

  let animation: Animation | null = null;
  let contentAnimation: Animation | null = null;

  let ref: HTMLDetailsElement | null | undefined;
  let summaryRef: HTMLElement | null | undefined;
  let contentRef: HTMLDivElement | null | undefined;
  let anchorRef: HTMLAnchorElement | null | undefined;

  function onMount(_ref?: HTMLDetailsElement, _summaryRef?: HTMLElement, _contentRef?: HTMLDivElement) {
    ref = _ref;
    summaryRef = _summaryRef;
    contentRef = _contentRef;
    anchorRef = _summaryRef?.querySelector?.("a") ?? undefined;

    if (ref) setIsOpen(ref.open);

    createEffect(() => {
      if (!ref) return;

      ref.dataset.isClosing = `${isClosing()}`;
      ref.dataset.isExpanding = `${isExpanding()}`;
    });

    hashChange();
    globalThis?.addEventListener?.("hashchange", hashChange);
  }

  function hashChange() {
    const { hash } = globalThis.location;

    if (ref && hash && hash.length) {
      if (ref.open != true && ref.id === hash.slice(1)) {
        onClick();
      }
    }
  }

  function onClick(e?: MouseEvent) {
    if (
      e?.target &&
      (
        anchorRef === (e?.target as HTMLElement) ||
        anchorRef?.contains?.((e?.target as HTMLElement))
      ) || 
      !ref
    ) return;

    e && e?.preventDefault?.();

    // Add an overflow on the <details> to avoid content overflowing
    ref.style.overflow = "hidden";

    // Check if the element is being closed or is already closed
    if (isClosing() || !ref?.open) animate("open"); 

    // Check if the element is being openned or is already open
    else if (isExpanding() || ref?.open) animate("shrink");
  }

  function animate(mode: "open" | "shrink") {
    const isOpenMode = mode === "open";
    if (!ref) return;
    if (isOpenMode) {
      // Apply a fixed height on the element
      ref.style.height = `${ref.offsetHeight}px`;

      // Force the [open] attribute on the details element
      ref.open = true;
      setIsOpen(ref.open);

      // Set the element as "being expanding"
      setIsExpanding(true);
    } else {
      // Set the element as "being closed"
      setIsClosing(true);
    }

    if (!contentRef || !summaryRef) return;

    const contentValue = isOpenMode ? contentRef.offsetHeight : 0;

    const startValue = ref.offsetHeight;
    const endValue = summaryRef.offsetHeight + contentValue;

    const startHeight = `${startValue}px`;
    const endHeight = `${endValue}px`;

    const opacity = isOpenMode ? [0, 1] : [1, 0];
    const dist = Math.abs(endValue - startValue);
    const timingOpts = {
      // For longer content reduce the speed at which the details element opens and closes
      duration: (isOpenMode ? 500 : 300) + (200 * (dist / 500)),
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
      if (ref) {
        ref.open = isOpenMode;
        setIsOpen(ref.open);
      }

      // Clear the stored animations
      animation = null;
      contentAnimation = null;

      // Reset isClosing & isExpanding
      setIsClosing(false);
      setIsExpanding(false);

      // Remove the overflow hidden and the fixed height
      if (ref) {
        ref.style.height = ref.style.overflow = "";
      }
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

    globalThis?.removeEventListener?.("hashchange", hashChange);
  }

  return {
    onMount,
    onClick,
    onCleanup,
    isClosing,
    isExpanding,
    isOpen
  };
}

export default createDetailsEffect;