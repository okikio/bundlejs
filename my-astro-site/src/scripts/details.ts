export function createDetailsEffect() {
  let isClosing = false;
  let isExpanding = false;
  let animation: Animation = null;

  let ref: HTMLDetailsElement;
  let summaryRef: HTMLElement;
  let contentRef: HTMLDivElement;

  function onMount(_ref?: HTMLDetailsElement, _summaryRef?: HTMLElement, _contentRef?: HTMLDivElement) {
    ref = _ref;
    summaryRef = _summaryRef;
    contentRef = _contentRef;

    hashChange();
    globalThis.addEventListener('hashchange', hashChange);
  }

  function hashChange () {
    let { hash } = document.location;
    
    if (ref && hash.length) {
      if (ref.open != true && ref.id == hash.slice(1)) {
        onClick();
      }
    }
  };
  
  // globalThis.addEventListener("load", hashChange);
  // globalThis.addEventListener('hashchange', hashChange);

  function onClick(e?: MouseEvent) {
    e && e?.preventDefault?.();

    // Add an overflow on the <details> to avoid content overflowing
    ref.style.overflow = "hidden";

    // Check if the element is being closed or is already closed
    if (isClosing || !ref.open) {
      open();
    }

    // Check if the element is being openned or is already open
    else if (isExpanding || ref.open) {
      shrink();
    }
  }

  function open() {
    // Apply a fixed height on the element
    ref.style.height = `${ref.offsetHeight}px`;

    // Force the [open] attribute on the details element
    ref.open = true;

    // Wait for the next frame to call the expand function
    globalThis.requestAnimationFrame(() => {
      // Set the element as "being expanding"
      isExpanding = true;

      // Get the current fixed height of the element
      const start = ref.offsetHeight;

      // Calculate the open height of the element (summary height + content height)
      const end = summaryRef.offsetHeight + contentRef.offsetHeight;

      const startHeight = `${start}px`;
      const endHeight = `${end}px`;

      // If there is already an animation running
      if (animation) {
        // Cancel the current animation
        animation.cancel();
      }

      // Start a WAAPI animation
      animation = ref.animate(
        {
          // Set the keyframes from the startHeight to endHeight
          height: [startHeight, endHeight],
        },
        {
          duration: 500,
          easing: "ease-out",
        }
      );

      // When the animation is complete, call onFinish()
      animation.onfinish = () => onFinish(true);

      // If the animation is cancelled, isExpanding variable is set to false
      animation.oncancel = () => (isExpanding = false);
    });
  }

  function shrink() {
    // Set the element as "being closed"
    isClosing = true;

    globalThis.requestAnimationFrame(() => {
      // Store the current height of the element
      const start = ref.offsetHeight;

      // Calculate the height of the summary
      const end = summaryRef.offsetHeight;

      const startHeight = `${start}px`;
      const endHeight = `${end}px`;

      // If there is already an animation running
      if (animation) {
        // Cancel the current animation
        animation.cancel();
      }

      // Start a WAAPI animation
      animation = ref.animate(
        {
          // Set the keyframes from the startHeight to endHeight
          height: [startHeight, endHeight],
        },
        {
          duration: 500,
          easing: "ease-out",
        }
      );

      // When the animation is complete, call onFinish()
      animation.onfinish = () => onFinish(false);

      // If the animation is cancelled, isClosing variable is set to false
      animation.oncancel = () => (isClosing = false);
    });
  }

  function onFinish(open: boolean) {
    // Set the open attribute based on the parameter
    ref.open = open;

    // Clear the stored animation
    animation = null;

    // Reset isClosing & isExpanding
    isClosing = false;
    isExpanding = false;

    // Remove the overflow hidden and the fixed height
    ref.style.height = ref.style.overflow = "";
  }

  function onCleanup() {
    animation?.cancel?.();

    ref = null;
    summaryRef = null;
    contentRef = null;

    // this.anchors = null;

    animation = null;
    isClosing = null;
    isExpanding = null;

    globalThis.removeEventListener('hashchange', hashChange);
  }

  return {
    onMount,
    onClick,
    onCleanup,
  };
}

export default createDetailsEffect;