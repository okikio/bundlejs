import { Workbox } from "workbox-window";
import { animate } from "@okikio/animate";

import { ENABLE_SW } from "../../env";
import { CACHE_NAME, CACHE } from "./util/fetch-and-cache";

export default () => {
    // Check that service workers are supported
    (async () => {      
        // Force Referesh Cache
        let resetCache = document.querySelector(".btn#reset-cache") as HTMLElement;
        resetCache?.addEventListener?.("click", (e) => {
            (async () => { 
                // Clear Cache
                if ("caches" in globalThis) {
                    let cache_names = await caches.keys();
                    await Promise.all(cache_names.map(cache_name => {
                        return caches.delete(cache_name);
                    }));
                } else 
                    CACHE.clear();
                
                console.log("Clear Cache");
                window.location.reload();
            })()
        })

        if ("serviceWorker" in navigator && ENABLE_SW) {
            let reloadDialog = document.querySelector(
                ".info-prompt.reload"
            ) as HTMLElement;
            let offlineDialog = document.querySelector(
                ".info-prompt.offline-ready"
            ) as HTMLElement;

            const dialog = (type: "confirm" | "alert" = "confirm") => {
                let dialogEl = type == "confirm" ? reloadDialog : offlineDialog;

                return new Promise<void>((resolve, reject) => {
                    let dismissBtn = dialogEl?.querySelector(
                        ".dismiss"
                    ) as HTMLElement;
                    let acceptBtn = dialogEl?.querySelector(
                        ".accept"
                    ) as HTMLElement;

                    let animateIn = {
                        target: dialogEl,
                        translateY: [200, 0],
                        visibility: ["visible", "visible"],
                        fillMode: "both",
                        easing: "ease",
                        duration: 350
                    };

                    let animateOut = {
                        ...animateIn,
                        translateY: [0, 200],
                        visibility: ["visible", "hidden"],
                        delay: 3000,
                    };

                    animate(animateIn).then(() => type != "confirm" ? animate(animateOut) : null);

                    if (dismissBtn) {
                        dismissBtn.onclick = () => {
                            animate({
                                ...animateOut,
                                delay: 0,
                            });

                            reject();
                        };
                    }

                    if (acceptBtn) {
                        acceptBtn.onclick = () => {
                            animate({
                                ...animateOut,
                                delay: 0,
                            });

                            resolve();
                        };
                    }
                });
            };

            window?.addEventListener("load", () => {
                // Use the window load event to keep the page load performant
                const wb = new Workbox("/sw.js");

                // Add an event listener to detect when the registered
                // service worker has installed but is waiting to activate.
                wb?.addEventListener("waiting", (event) => {
                    // `event.wasWaitingBeforeRegister` will be false if this is
                    // the first time the updated service worker is waiting.
                    // When `event.wasWaitingBeforeRegister` is true, a previously
                    // updated service worker is still waiting.
                    // You may want to customize the UI prompt accordingly.

                    // Assumes your app has some sort of prompt UI element
                    // that a user can either accept or reject.
                    dialog("confirm")
                        .then(() => {
                            wb.messageSkipWaiting();
                        })
                        .catch(() => { });
                });


                // Assuming the user accepted the update, set up a listener
                // that will reload the page as soon as the previously waiting
                // service worker has taken control.
                wb?.addEventListener("controlling", async (event) => {
                    caches.delete(CACHE_NAME);
                    window.location.reload();
                });

                wb?.addEventListener("activated", (event) => {
                    // `event.isUpdate` will be true if another version of the service
                    // worker was controlling the page when this version was registered.
                    if (!event.isUpdate) {
                        console.log("Service worker activated for the first time!");

                        // If your service worker is configured to precache assets, those
                        // assets should all be available now.
                        dialog("alert").catch(() => { });
                    }
                });

                wb?.register();
            });
        }
    })();
};