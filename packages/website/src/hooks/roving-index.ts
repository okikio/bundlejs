// Based off of https://npmjs.com/roving-ux
/**
 * State map to store rover-related data.
 */
export const state = new Map<HTMLElement | string, RoverState | HTMLElement>();

/**
 * Checks if the document direction is RTL (Right-to-Left).
 * @returns {boolean} True if the document direction is RTL, otherwise false.
 */
const isRtl = (): boolean => globalThis?.getComputedStyle?.(globalThis?.document?.documentElement)?.direction === "rtl";


/**
 * Key codes for keyboard navigation.
 */
export const KEYCODE = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  ESC: "Escape"
};

/**
 * Event handler for when the container or children get focus.
 * @param {FocusEvent} e The focus event.
 */
const onFocusin = (e: FocusEvent): void => {
  const { currentTarget: rover } = e;
  const last_rover = (state.get("last_rover") as unknown as EventTarget)
  if (last_rover === rover) return;
  if (state.has(rover as HTMLElement)) {
    activate(rover as HTMLElement, (state.get(rover as HTMLElement)! as RoverState).active);
    state.set("last_rover", rover as HTMLElement);
  }
};

/**
 * Event handler for keyboard navigation.
 * @param {KeyboardEvent} e The keyboard event.
 */
const onKeydown = (e: KeyboardEvent): void => {
  const { currentTarget: rover } = e;

  switch (e.code) {
    case KEYCODE[isRtl() ? "LEFT" : "RIGHT"]:
    case KEYCODE.DOWN:
      e.preventDefault();
      focusNextItem(rover as HTMLElement);
      break;
    case KEYCODE[isRtl() ? "RIGHT" : "LEFT"]:
    case KEYCODE.UP:
      e.preventDefault();
      focusPreviousItem(rover as HTMLElement);
      break;
  }
};

/**
 * MutationObserver to handle removal of elements.
 */
const mo = "MutationObserver" in globalThis ? new MutationObserver((mutationList) => {
  mutationList
    .filter(x => x.removedNodes.length > 0)
    .forEach(mutation => {
      [...mutation.removedNodes]
        .filter(x => x.nodeType === 1)
        .forEach(removedEl => {
          state.forEach((val, key) => {
            if (key === "last_rover") return;
            if (removedEl.contains(key as Node)) {
              (key as HTMLElement).removeEventListener("focusin", onFocusin);
              (key as HTMLElement).removeEventListener("keydown", onKeydown);

              state.delete(key);
              (val as RoverState).targets.forEach(a => (a.tabIndex = -1));

              if (state.size === 0 || (state.size === 1 && state.has("last_rover"))) {
                state.clear();
                mo?.disconnect?.();
              }
            }
          });
        });
    });
}) : null;

/**
 * Adds roving index functionality to a container.
 * @param {RovingIndexConfig} config Configuration object.
 * @example
 * // Simple usage with direct children as focus targets
 * rovingIndex({
 *   element: document.querySelector('#carousel')
 * });
 * 
 * @example
 * // Usage with a custom query selector for focusable children
 * rovingIndex({
 *   element: document.querySelector('#menu'),
 *   target: 'button'
 * });
 */
export const rovingIndex = ({ element: rover, target: selector }: RovingIndexConfig): void => {
  // this api allows empty or a query string
  const target_query = selector || ":scope *";
  const targets = rover.querySelectorAll(target_query) ?? [];
  const startingPoint = targets[0] as HTMLElement;

  state.set(rover, {
    targets: Array.from(targets) as HTMLElement[],
    active: startingPoint,
    index: 0,
  });

  if (targets.length > 0) {
    rover.removeEventListener("focusin", onFocusin);
    rover.removeEventListener("keydown", onKeydown);

    // take container out of the focus flow
    // rover.tabIndex = -1
    // and all the children
    // targets.forEach(a => a.tabIndex = -1)
    // except the first target, that accepts focus
    // startingPoint.tabIndex = 0

    // with the roving container as the key
    // save some state and handy references
    state.set(rover, {
      targets: Array.from(targets) as HTMLElement[],
      active: startingPoint,
      index: 0,
    });

    rover.addEventListener("focusin", onFocusin);
    rover.addEventListener("keydown", onKeydown);
  }

  mo?.disconnect?.();
  mo?.observe?.(document, {
    childList: true,
    subtree: true
  });
};

/**
 * Focuses the next item in the roving container.
 * @param {HTMLElement} rover The roving container.
 */
const focusNextItem = (rover: HTMLElement): void => {
  const rx = state.get(rover)! as RoverState;

  // increment state index
  rx.index += 1;

  // clamp navigation to target bounds
  if (rx.index > rx.targets.length - 1)
    rx.index = rx.targets.length - 1;

  // use rover index state to find next
  const next = rx.targets[rx.index] as HTMLElement;

  // found something, activate it
  next && activate(rover, next);
};

/**
 * Focuses the previous item in the roving container.
 * @param {HTMLElement} rover The roving container.
 */
const focusPreviousItem = (rover: HTMLElement): void => {
  const rx = state.get(rover)! as RoverState;

  // decrement from the state index
  rx.index -= 1;

  // clamp to 0 and above only
  if (rx.index < 1)
    rx.index = 0;

  // use rover index state to find next
  const prev = rx.targets[rx.index] as HTMLElement;

  // found something, activate it
  prev && activate(rover, prev);
};

/**
 * Activates a specific item in the roving container.
 * @param {HTMLElement} rover The roving container.
 * @param {HTMLElement} item The item to activate.
 */
const activate = (rover: HTMLElement, item: HTMLElement): void => {
  if (!item) return;
  const rx = state.get(rover)! as RoverState;

  // remove old tab index item
  const oldItem = rx.active;
  oldItem.tabIndex = -1;

  // set new active item and focus it
  rx.active = item;
  rx.active.tabIndex = 0;
  rx.active.focus();
  oldItem.tabIndex = 0;
};

/**
 * Configuration object for roving index.
 */
export interface RovingIndexConfig {
  element: HTMLElement;
  target?: string;
}

/**
 * State object for each roving container.
 */
export interface RoverState {
  targets: HTMLElement[];
  active: HTMLElement;
  index: number;
}