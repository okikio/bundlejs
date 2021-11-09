import { App, PJAX, HistoryManager, TransitionManager, PageManager, Router, type ITransition } from "@okikio/native";
import { Navbar } from "./services/Navbar";

import { themeSet, themeGet } from "./scripts/theme";
import * as Accordion from "./modules/accordion";

import { Workbox } from "workbox-window";
import { animate } from "@okikio/animate";

try {
    // On theme switcher button click (mouseup is a tiny bit more efficient) toggle the theme between dark and light mode
    let themeSwitch = Array.from(document.querySelectorAll(".theme-options")) as HTMLSelectElement[];
    if (themeSwitch[0]) {
        for (let el of themeSwitch) {
            el.value = themeGet();
            el.addEventListener("change", () => {
                themeSet(el.value);
                el.value = themeGet();
            });
        }
    }
} catch (e) {
    console.warn("Theming seems to break on this browser.", e);
}

// Check that service workers are supported
(async () => {
    if ("serviceWorker" in navigator) {
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

        window.addEventListener("load", () => {  
            // Use the window load event to keep the page load performant
            const wb = new Workbox("/sw.js");

            // Add an event listener to detect when the registered
            // service worker has installed but is waiting to activate.
            wb.addEventListener("waiting", (event) => {
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
            wb.addEventListener("controlling", (event) => {
                window.location.reload();
            });

            wb.addEventListener("activated", (event) => {
                // `event.isUpdate` will be true if another version of the service
                // worker was controlling the page when this version was registered.
                if (!event.isUpdate) {
                    console.log("Service worker activated for the first time!");

                    // If your service worker is configured to precache assets, those
                    // assets should all be available now.
                    dialog("alert").catch(() => { });
                }
            });

            wb.register();
        });
    }
})();

// navbar focus on scroll effect
let canScroll = true;
const navbar = document.querySelector(".navbar") as HTMLElement;
window.addEventListener(
    "scroll",
    () => {
        if (canScroll) {
            canScroll = false;
            requestAnimationFrame(() => {
                navbar.classList.toggle("shadow", window.scrollY >= 5);

                canScroll = true;
            });
        }
    },
    { passive: true }
);

try {
    const app = new App();

    //= Fade Transition
    const Fade: ITransition = {
        name: "default",

        // Fade Out Old Page
        out({ from }) {
            let fromWrapper = from.wrapper;

            return animate({
                target: fromWrapper,
                opacity: [1, 0],
                duration: 500,
            })
        },

        // Fade In New Page
        async in({ to, scroll }) {
            let toWrapper = to.wrapper;
            window.scroll(scroll.x, scroll.y);

            await animate({
                target: toWrapper,
                opacity: [0, 1],
                duration: 500
            });
        }
    };

    app
        .add(new Navbar())

        // Note only these 3 Services must be set under the names specified
        .set("HistoryManager", new HistoryManager())
        .set("PageManager", new PageManager())
        .set("TransitionManager", new TransitionManager([
            ["default", Fade],
        ]))

        .set("Router", new Router())
        .add(new PJAX());

    let indexRun = async () => {
        const { default: index } = await import("./index");
        index();
    }
    
    app.emitter.once("index", async () => {
        indexRun();
    });

    let router = app.get("Router") as Router;
    router
        .add({
            path: /^\/(index)?(\.html)?$/,
            method() {
                app.emitter.emit("index");
            }
        });

    app.boot();
} catch (err) {
    console.warn("[App] boot failed,", err);
}

const offlineIcons = Array.from(document.querySelectorAll(".offline-icon"));
const hasNetwork = (online: boolean) => {
    offlineIcons.forEach(el => {
        el?.classList?.toggle("online", online);
    });
};

hasNetwork(navigator.onLine);
window.addEventListener("load", () => {
    hasNetwork(navigator.onLine);

    window.addEventListener("online", () => {
        // Set hasNetwork to online when they change to online.
        hasNetwork(true);
    });

    window.addEventListener("offline", () => {
        // Set hasNetwork to offline when they change to offline.
        hasNetwork(false);
    });
});

// Accordion
Accordion.run();
export { };