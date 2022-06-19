import { createEffect, createSignal, onCleanup, onMount, Show, type ComponentProps } from "solid-js";

import IconDragHandleHeight from "~icons/fluent/re-order-dots-horizontal-24-filled";
import IconDragHandleWidth from "~icons/fluent/re-order-dots-vertical-24-filled";

import { debounce } from "@bundlejs/core";

export function DragHandle(props?: ComponentProps<'button'> & {
  direction?: 'x' | 'y';
  contrain?: boolean;
}) {
  let ref: HTMLButtonElement = null;
  let targetEl: HTMLElement = null;
  let parentEl: HTMLElement = null;
  let observer: ResizeObserver = null;

  // The current position of mouse
  let position = 0;

  // Size of previous element
  let size = 0;

  // Size of parent element
  let parentSize = 0;

  let [dirIsX, setDirIsX] = createSignal(props?.direction == "x");

  let [sizeProp, setSizeProp] = createSignal(dirIsX() ? "width" : "height");
  let [mouseDir, setMouseDir] = createSignal(dirIsX() ? "clientX" : "clientY");
  let [cursorProp, setCursorProp] = createSignal(dirIsX() ? "col-resize" : "row-resize");
  
  function drag (e: MouseEvent) {
    // How far the mouse has been moved
    const diff = e[mouseDir()] - position;
    const newSize = props?.contrain ? (size + diff) * 100 / parentSize : size + diff;
    const unit = props?.contrain ? "%" : "px";

    targetEl.style[sizeProp()] = `${newSize}${unit}`;
    document.body.style.cursor = cursorProp();

    targetEl.style.userSelect = 'none';
    targetEl.style.pointerEvents = 'none';
  }

  function stopDrag () {
    ref.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');

    targetEl.style.removeProperty('user-select');
    targetEl.style.removeProperty('pointer-events');

    document.removeEventListener('pointermove', drag);
    document.removeEventListener('pointerup', stopDrag);

    if (props?.contrain) {
      observer?.unobserve?.(parentEl);
    }
  }

  onMount(() => {
    targetEl = (ref?.previousElementSibling ?? ref?.parentElement?.previousElementSibling) as HTMLElement;
    parentEl = targetEl?.parentElement as HTMLElement;
  });

  createEffect(() => { 
    targetEl?.style?.removeProperty?.(sizeProp());

    setDirIsX(props?.direction == "x");

    setSizeProp(dirIsX() ? "width" : "height");
    setMouseDir(dirIsX() ? "clientX" : "clientY");
    setCursorProp(dirIsX() ? "col-resize" : "row-resize");

    if (props?.contrain && !observer) {
      observer = new ResizeObserver(
        debounce(() => {
          parentSize = parentEl.getBoundingClientRect()[sizeProp()];
        }, 50)
      );
    }
  });

  onCleanup(() => { 
    document.removeEventListener('pointermove', drag);
    document.removeEventListener('pointerup', stopDrag);

    if (props?.contrain) {
      observer?.unobserve?.(parentEl);
      observer?.disconnect?.();
      observer = null;
    }
  });

  // Handle the pointerdown event
  // that's triggered when user drags the resizer
  function pointerDown (e: MouseEvent) {
    // Get the current mouse position
    position = e[mouseDir()];
    size = targetEl.getBoundingClientRect()[sizeProp()];
    parentSize = parentEl.getBoundingClientRect()[sizeProp()];

    // Attach the listeners to `document`
    document.addEventListener('pointermove', drag);
    document.addEventListener('pointerup', stopDrag);

    if (props?.contrain) {
      observer?.observe?.(parentEl);
    } 
  }
  
  return (
    <button {...props} class="drag-handle" custom-handle ref={ref} onPointerDown={pointerDown} aria-hidden="true" aria-label={(dirIsX() ? "Horizontal" : "Vertical") + " Drag Handle"}>
      <Show when={dirIsX()} fallback={<IconDragHandleHeight />}>
        <IconDragHandleWidth />
      </Show>
    </button>
  );
}

export default DragHandle;