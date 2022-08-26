import{ ComponentProps, onMount } from "solid-js";
import { createServiceWorker } from "../hooks/service-worker";
import toast from "./SolidToast";

export function RegisterServiceWorker(props?: ComponentProps<'div'>) {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = createServiceWorker({
    onOfflineReady() {
      toast.success(`App ready to work offline`);
    },
    onNeedRefresh() {
      toast.update(`New content available, click on reload button to update`, { 
        duration: Infinity,
        updateClick() {
          updateServiceWorker(true);
        },
        dismissClick() {
          close();
        }
      });
    },
    onRegistered(r) {
      console.log('SW Registered: small change', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  });

  onMount(() => {
    toast.update(`New content available, click on reload button to update`, { 
      duration: Infinity,
      async updateClick() {
        const allKeys = await caches.keys();
        await Promise.all(allKeys.map(key => caches.delete(key)))
        updateServiceWorker(true);
      },
      dismissClick() {
        close();
      }
    });
  });

  function close () {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (<></>);
}
