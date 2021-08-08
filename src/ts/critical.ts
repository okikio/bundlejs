import { themeSet, themeGet, runTheme } from "./scripts/theme";
import { hit } from "countapi-js";

// countapi-js hit counter. It counts the number of time the website is loaded
// (async () => {
//     try {
//         let { value } = await hit('bundle.js.org', 'visits');
//         let visitCounterEl = document.querySelector("#visit-counter");
//         if (visitCounterEl) visitCounterEl.textContent = `(${value} Page Visits)`;
//     } catch (err) {
//         console.warn("Visit Counter Error (please create a new issue in the repo)", err);
//     }
// })();

// navbar focus on scroll effect
let canScroll = true;
const navbar = document.querySelector(".navbar") as HTMLElement;
window.addEventListener("scroll", () => {
    if (canScroll) {
        canScroll = false;
        requestAnimationFrame(() => {
            navbar.classList.toggle("shadow", window.scrollY >= 5);

            canScroll = true;
        });
    }
}, { passive: true });

try {
    // On theme switcher button click (mouseup is a tiny bit more efficient) toggle the theme between dark and light mode
    let themeSwitch = Array.from(document.querySelectorAll(".theme-toggle"));
    if (themeSwitch[0]) {
        for (let el of themeSwitch)
            el.addEventListener("click", () => {
                themeSet(themeGet() === "dark" ? "light" : "dark");
            });
    }
} catch (e) {
    console.warn("Theming seems to break on this browser.", e);
}

// highlight.js for code highlighting
(async () => {
    let { hljs } = await import("./modules/highlightjs");
    hljs.highlightAll();
})();