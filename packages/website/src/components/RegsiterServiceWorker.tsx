import toast from "./SolidToast";
import { createServiceWorker } from "../hooks/service-worker";

const intervalMS = 60 * 60 * 1000;
export function RegisterServiceWorker() {
  const {
    offlineReady: [, setOfflineReady],
    needRefresh: [, setNeedRefresh],
    updateServiceWorker,
  } = createServiceWorker({
    onOfflineReady() {
      toast.success("App ready to work offline");
    },
    onNeedRefresh() {
      toast.update("New content available, click on reload button to update", {
        duration: Infinity,
        async updateClick() {
          await toast.promise(updateServiceWorker(true), {
            loading: "Updating...",
            success: () => (<>Update Successful</>),
            error: "Error Updating",
          });
        },
        dismissClick() {
          close();
        }
      });
    },
    onRegistered(r) {
      console.log("SW Registered: small change", r);
      r && setInterval(() => {
        r.update();
      }, intervalMS);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  function close() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  return (<></>);
}
