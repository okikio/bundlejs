// Based off of https://npmjs.com/roving-ux
export const state = new Map()
const isRtl = () => globalThis?.getComputedStyle?.(globalThis?.document?.documentElement)?.direction === 'rtl';

export const KEYCODE = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  ESC: "Escape"
}

// when container or children get focus
const onFocusin = e => {
  const { currentTarget: rover } = e
  if (state.get('last_rover') == rover) return
  if (state.has(rover)) {
    activate(rover, state.get(rover).active)
    state.set('last_rover', rover)
  }
}

const onKeydown = e => {
  const { currentTarget: rover } = e

  switch (e.code) {
    case KEYCODE[isRtl() ? 'LEFT' : 'RIGHT']:
    case KEYCODE.DOWN:
      e.preventDefault()
      focusNextItem(rover)
      break
    case KEYCODE[isRtl() ? 'RIGHT' : 'LEFT']:
    case KEYCODE.UP:
      e.preventDefault()
      focusPreviousItem(rover)
      break
  }
}

const mo = new MutationObserver((mutationList, observer) => {
  mutationList
    .filter(x => x.removedNodes.length > 0)
    .forEach(mutation => {
      [...mutation.removedNodes]
        .filter(x => x.nodeType === 1)
        .forEach(removedEl => {
          state.forEach((val, key) => {
            if (key === 'last_rover') return
            if (removedEl.contains(key)) {
              key.removeEventListener('focusin', onFocusin)
              key.removeEventListener('keydown', onKeydown)

              state.delete(key)
              val.targets.forEach(a => a.tabIndex = '')

              if (state.size === 0 || (state.size === 1 && state.has('last_rover'))) {
                state.clear()
                mo.disconnect()
              }
            }
          })
        })
    })
})

export const rovingIndex = ({ element: rover, target: selector }) => {
  // this api allows empty or a query string
  const target_query = selector || ':scope *';
  const targets = rover.querySelectorAll(target_query) ?? [];
  const startingPoint = targets[0];

  state.set(rover, {
    targets,
    active: startingPoint,
    index: 0,
  });

  if (targets.length > 0) {
    rover?.removeEventListener?.('focusin', onFocusin);
    // watch for arrow keys
    rover?.removeEventListener?.('keydown', onKeydown);

    // take container out of the focus flow
    // rover.tabIndex = -1
    // and all the children
    // targets.forEach(a => a.tabIndex = -1)
    // except the first target, that accepts focus
    // startingPoint.tabIndex = 0

    // with the roving container as the key
    // save some state and handy references
    state.set(rover, {
      targets,
      active: startingPoint,
      index: 0,
    })

    rover.addEventListener('focusin', onFocusin);
    // watch for arrow keys
    rover.addEventListener('keydown', onKeydown);
  }

  mo.observe(document, {
    childList: true,
    subtree: true
  })
}

const focusNextItem = rover => {
  const rx = state.get(rover)

  // increment state index
  rx.index += 1

  // clamp navigation to target bounds
  if (rx.index > rx.targets.length - 1)
    rx.index = rx.targets.length - 1

  // use rover index state to find next
  let next = rx.targets[rx.index]

  // found something, activate it
  next && activate(rover, next)
}

const focusPreviousItem = rover => {
  const rx = state.get(rover)

  // decrement from the state index
  rx.index -= 1

  // clamp to 0 and above only
  if (rx.index < 1)
    rx.index = 0

  // use rover index state to find next
  let prev = rx.targets[rx.index]

  // found something, activate it
  prev && activate(rover, prev)
}

const activate = (rover, item) => {
  const rx = state.get(rover)

  // remove old tab index item
  let oldItem = rx.active;
  oldItem.tabIndex = -1

  // set new active item and focus it
  rx.active = item
  rx.active.tabIndex = 0
  rx.active.focus()
  oldItem.tabIndex = 0
}
