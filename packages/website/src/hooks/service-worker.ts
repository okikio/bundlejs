import { Workbox, messageSW } from "workbox-window";
import { createSignal } from 'solid-js';

export interface RegisterSWOptions {
  immediate?: boolean
  onNeedRefresh?: (wb?: Workbox) => void
  onOfflineReady?: (wb?: Workbox) => void
  onRegistered?: (registration: ServiceWorkerRegistration | undefined, wb?: Workbox) => void
  onRegisterError?: (error: any, wb?: Workbox) => void
}

const ServiceWorkerUrl = `/service-worker.js`;

// __SW_AUTO_UPDATE__ will be replaced by virtual module
const autoUpdateMode = 'false'; // '__SW_AUTO_UPDATE__'
// __SW_SELF_DESTROYING__ will be replaced by virtual module
const selfDestroying = 'false'; // '__SW_SELF_DESTROYING__'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore replace at build
const auto = autoUpdateMode === 'true'
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore replace at build time
const autoDestroy = selfDestroying === 'true'

export function registerSW(options: RegisterSWOptions = {}) {
  const {
    immediate = false,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisterError,
  } = options

  let wb: Workbox | undefined
  let registration: ServiceWorkerRegistration | undefined

  const updateServiceWorker = async (reloadPage = true) => {
    if (!auto) {
      // Assuming the user accepted the update, set up a listener
      // that will reload the page as soon as the previously waiting
      // service worker has taken control.
      if (reloadPage) {
        wb?.addEventListener('controlling', (event) => {
          if (event.isUpdate)
            window.location.reload()
        })
      }

      if (registration && registration.waiting) {
        // Send a message to the waiting service worker,
        // instructing it to activate.
        // Note: for this to work, you have to add a message
        // listener in your service worker. See below.
        await messageSW(registration.waiting, { type: 'SKIP_WAITING' })
      }
    }
  }

  if ('serviceWorker' in navigator) {
    // __SW__, __SCOPE__ and __TYPE__ will be replaced by virtual module
    wb = new Workbox(ServiceWorkerUrl); 

    wb.addEventListener('activated', (event) => {
      // this will only controls the offline request.
      // event.isUpdate will be true if another version of the service
      // worker was controlling the page when this version was registered.
      if (event.isUpdate)
        auto && window.location.reload()
      else if (!autoDestroy)
        onOfflineReady?.(wb)
    })

    if (!auto) {
      const showSkipWaitingPrompt = () => {
        // \`event.wasWaitingBeforeRegister\` will be false if this is
        // the first time the updated service worker is waiting.
        // When \`event.wasWaitingBeforeRegister\` is true, a previously
        // updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.

        // Assumes your app has some sort of prompt UI element
        // that a user can either accept or reject.
        onNeedRefresh?.(wb)
      }

      // Add an event listener to detect when the registered
      // service worker has installed but is waiting to activate.
      wb.addEventListener('waiting', showSkipWaitingPrompt)
      // @ts-expect-error event listener provided by workbox-window
      wb.addEventListener('externalwaiting', showSkipWaitingPrompt)
    }

    // register the service worker
    wb.register({ immediate }).then((r) => {
      registration = r
      onRegistered?.(r, wb)
    }).catch((e) => {
      onRegisterError?.(e, wb)
    })
  }

  return updateServiceWorker;
}

export function createServiceWorker(options: RegisterSWOptions = {}) {
  const {
    immediate = true,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisterError,
  } = options

  const needRefresh = createSignal(false)
  const offlineReady = createSignal(false)

  const [getNeedRefresh, setNeedRefresh] = needRefresh;
  const [getOfflineReady, setOfflineReady] = offlineReady;

  const updateServiceWorker = registerSW({
    immediate,
    onOfflineReady() {
      setOfflineReady(true)
      onOfflineReady?.()
    },
    onNeedRefresh() {
      setNeedRefresh(true)
      onNeedRefresh?.()
    },
    onRegistered,
    onRegisterError,
  })

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  }
}