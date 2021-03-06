import { App, PJAX, HistoryManager, TransitionManager, PageManager, Router } from "@okikio/native";
import { Navbar } from "./services/Navbar";

import { themeSet, themeGet } from "./theme";

// import { build, InitialRender } from "./index";
import RegisterServiceWorker from "./register-sw";

import * as DetailsComponent from "./modules/details";
import { animate } from "@okikio/animate";

import type { ITransition, IHistoryItem } from "@okikio/native";

const html = document.querySelector("html");
html?.classList?.add?.("dom-loaded");

const indexImport = import("./index");

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
    const indexRun = async (app: App) => {
        const { build, InitialRender } = await indexImport;
        InitialRender(oldShareURL);
        await build(app);
    };

    //= Fade Transition
    const Fade: ITransition = {
        name: "default",

        // Fade Out Old Page
        out({ from }) {
            let fromWrapper = from.wrapper;
            DetailsComponent.stop();

            return animate({
                target: fromWrapper,
                opacity: [1, 0],
                duration: 200,
            });
        },

        // Fade In New Page
        async in({ to, scroll }) {
            let toWrapper = to.wrapper;
            window.scroll(scroll.x, scroll.y);

            await animate({
                target: toWrapper,
                opacity: [0, 1],
                duration: 200
            });
            DetailsComponent.run();
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
    
    app.emitter.once("index", async () => {
        indexRun(app);
    });

    if (/^\/(\#.*)?(index)?(\.html)?$/.test(oldShareURL.toString()))
        app.emitter.emit("index");
        
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

// Details Component
DetailsComponent.run();

RegisterServiceWorker();
export { };