import { themeSet, themeGet, runTheme } from "./modules/theme";

import { hit } from "countapi-js";
import { debounce } from "./util/debounce";

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

// The default navbar, etc... that is needed
(() => {
    let canScroll = true;
    const navbar = document.querySelector(".navbar") as HTMLElement;
    window.addEventListener("scroll", () => {
        if (canScroll) {
            let raf: number | void;
            canScroll = false;
            raf = requestAnimationFrame(() => {
                navbar.classList.toggle("shadow", window.scrollY >= 5);

                canScroll = true;
                raf = window.cancelAnimationFrame(raf as number);
            });
        }
    }, { passive: true });

    runTheme();

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
})();

// SarchResults solidjs component
(async () => {
    const searchInput = document.querySelector(".search input") as HTMLInputElement;
    // const host = "https://registry.npmjs.com/";
    const npms = "https://api.npms.io"
    const parseInput = (input: string) => {
        let value = input;
        let exec = /([\S]+)@([\S]+)/g.exec(value);
        let search = `${value}`.replace(/^@/, "");
        // let urlScheme = `${host}/-/v1/search?text=${search}&size=10&boost-exact=false`;
        let urlScheme = `${npms}/v2/search?q=${encodeURIComponent(search)}&size=10`;
        let version = "";

        if (exec) {
            let [, pkg, ver] = exec;
            version = ver;
            // urlScheme = `${host}/-/v1/search?text=${pkg}&size=10&boost-exact=false`;
            urlScheme = `${npms}/v2/search?q=${encodeURIComponent(pkg)}&size=10`;
        }

        return { url: urlScheme, version }
    };

    let keydownFn = debounce(() => {
        let { value } = searchInput;
        if (value.length <= 0) return;

        let { url, version } = parseInput(value);

        (async () => {
            let response = await fetch(url);
            let result = await response.json();
            setState(
                // result.objects
                result?.results.map(obj => {
                    const { name, description, date, publisher } = obj.package;
                    return {
                        name, description,
                        date, version,
                        author: publisher.username
                    };
                }) ?? []
            );
        })();
    }, 125);

    searchInput?.addEventListener?.("keydown", keydownFn);

    const { renderComponent, setState, Emitter } = await import("./components/SearchResults");
    const SearchContainerEl = document.querySelector(".search-results-container") as HTMLElement;
    if (SearchContainerEl) renderComponent(SearchContainerEl);

    // Emitter.on("complete", () => {
    //     SearchContainerEl.blur()
    // })

    let clearBtn = document.querySelector(".search .clear");
    clearBtn?.addEventListener("click", () => {
        searchInput.value = "";
        setState([]);
    });
})();

// highlight.js for code highlighting
(async () => {
    let { hljs } = await import("./modules/highlightjs");
    hljs.highlightAll();
})();