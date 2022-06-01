import { type ComponentProps, onMount, onCleanup } from "solid-js";
import IconDragHandleX from "~icons/fluent/re-order-dots-vertical-24-filled";
import IconDragHandleY from "~icons/fluent/re-order-dots-horizontal-24-filled";

export function DragHandle(props?: ComponentProps<'div'> & {
  direction?: 'x' | 'y';
}) {
  let ref: HTMLDivElement = null;
  let targetEl: HTMLElement = null;

  // The current position of mouse
  let position = 0;

  // Size of previous element
  let size = 0;

  let sizeProp = props?.direction == "x" ? "width" : "height";
  let mouseDir = props?.direction == "x" ? "clientX" : "clientY";
  let cursorProp = props?.direction == "x" ? "col-resize" : "row-resize";
  
  function drag (e: MouseEvent) {
    // How far the mouse has been moved
    const diff = e[mouseDir] - position;
    const newSize = size + diff;

    targetEl.style[sizeProp] = `${newSize}px`;
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
  }

  onMount(() => {
    targetEl = ref.previousElementSibling as HTMLElement;
  });

  onCleanup(() => { 
    document.removeEventListener('pointermove', drag);
    document.removeEventListener('pointerup', stopDrag);
  });

  // Handle the pointerdown event
  // that's triggered when user drags the resizer
  function pointerDown (e: MouseEvent) {
    // Get the current mouse position
    position = e[mouseDir];
    size = targetEl.getBoundingClientRect()[sizeProp];

    // Attach the listeners to `document`
    document.addEventListener('pointermove', drag);
    document.addEventListener('pointerup', stopDrag);
  }
  
  return (
    <div {...props} class="drag-handle" ref={ref} onPointerDown={pointerDown}>
      {props?.direction == "x" ? <IconDragHandleX /> : <IconDragHandleY />}
    </div>
  );
}

export default DragHandle;