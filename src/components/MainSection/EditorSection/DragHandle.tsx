import { type ComponentProps, onMount, onCleanup, createEffect } from "solid-js";
import IconDragHandleX from "~icons/fluent/re-order-dots-vertical-24-filled";
import IconDragHandleY from "~icons/fluent/re-order-dots-horizontal-24-filled";
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

  let sizeProp = props?.direction == "x" ? "width" : "height";
  let mouseDir = props?.direction == "x" ? "clientX" : "clientY";
  let cursorProp = props?.direction == "x" ? "col-resize" : "row-resize";
  
  function drag (e: MouseEvent) {
    // How far the mouse has been moved
    const diff = e[mouseDir] - position;
    const newSize = props?.contrain ? (size + diff) * 100 / parentSize : size + diff;
    const unit = props?.contrain ? "%" : "px";

    targetEl.style[sizeProp] = `${newSize}${unit}`;
    document.body.style.cursor = cursorProp;

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

    if (props?.contrain) {
      observer = new ResizeObserver(
        debounce(() => {
          parentSize = parentEl.getBoundingClientRect()[sizeProp];
        }, 50)
      );
    }

    createEffect(() => { 
      targetEl?.style?.removeProperty?.(sizeProp);
  
      sizeProp = props?.direction == "x" ? "width" : "height";
      mouseDir = props?.direction == "x" ? "clientX" : "clientY";
      cursorProp = props?.direction == "x" ? "col-resize" : "row-resize";
    });
  });

  onCleanup(() => { 
    document.removeEventListener('pointermove', drag);
    document.removeEventListener('pointerup', stopDrag);

    if (props?.contrain) {
      observer?.unobserve?.(parentEl);
      observer?.disconnect?.();
    }
  });

  // Handle the pointerdown event
  // that's triggered when user drags the resizer
  function pointerDown (e: MouseEvent) {
    // Get the current mouse position
    position = e[mouseDir];
    size = targetEl.getBoundingClientRect()[sizeProp];
    parentSize = parentEl.getBoundingClientRect()[sizeProp];

    // Attach the listeners to `document`
    document.addEventListener('pointermove', drag);
    document.addEventListener('pointerup', stopDrag);

    if (props?.contrain) {
      observer?.observe?.(parentEl);
    } 
  }
  
  return (
    <button {...props} class="drag-handle" custom-handle ref={ref} onPointerDown={pointerDown} aria-hidden="true" aria-label={(props?.direction == "x" ? "Horizontal" : "Vertical") + " Drag Handle"}>
      {props?.direction == "x" ? <IconDragHandleX /> : <IconDragHandleY />}
    </button>
  );
}

export default DragHandle;