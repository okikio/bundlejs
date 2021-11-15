import { App, PJAX, HistoryManager, TransitionManager, PageManager, Router } from "@okikio/native";
import { Navbar } from "./services/Navbar";

import * as Accordion from "./modules/accordion";
import { animate } from "@okikio/animate";

import type { ITransition, IHistoryItem } from "@okikio/native";

// Navbar focus on scroll effect
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

let oldShareURL = new URL(String(document.location)); 
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
        index(oldShareURL, app);
    }
    
    app.emitter.once("index", async () => {
        indexRun();
    });

    let router = app.get("Router") as Router;
    router
        .add({
            path: /^\/(\#.*)?(index)?(\.html)?$/,
            method() {
                app.emitter.emit("index");
            }
        });

    app.boot();

    // Fix for the HistoryManager force replacing the original shared URL
    if (oldShareURL) {
        let historyManager = app.get("HistoryManager") as HistoryManager;
        let { last } = historyManager;
        let state = {
            ...last,
            url: oldShareURL.toString()
        }
        
        historyManager.states.pop();
		historyManager.states.push({ ...state });

		let item: IHistoryItem = {
			index: historyManager.pointer,
			states: [...historyManager.states]
		};
        
        window.history.replaceState(item, "", state.url);
    }
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