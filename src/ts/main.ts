import importModule from "@uupaa/dynamic-import-polyfill";
import * as SearchResults from "./components/SearchResults";
import { sanitize } from "dompurify";
SearchResults.build();

const navbar = document.querySelector(".navbar") as HTMLElement;
const searchInput = document.querySelector(".search input") as HTMLInputElement;
const backToTop = document.querySelector(".to-top") as HTMLButtonElement;

let canScroll = true;
let eventDelay = 300;

backToTop?.addEventListener?.("click", () => {
    window.scroll({
        top: 0,
        behavior: "smooth"
    });
});

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

let packages = [];
const host = "https://registry.npmjs.com/";
let parseInput = (input: string) => {
    let value = sanitize(input);
    let exec = /([\S]+)@([\S]+)/g.exec(value);
    let search = `${value}`.replace(/^@/, "");
    let urlScheme = `${host}/-/v1/search?text=${search}&size=10&boost-exact=false`;

    if (exec) {
        let [, pkg, ver] = exec;
        urlScheme = `${host}/${pkg}/${ver}`;
    }

    return { url: urlScheme, type: exec ? "version" : "search" }
};

searchInput?.addEventListener?.("keyup", () => {
    let timer: number | void;

    // Set a timeout to debounce the keyup event
    window.clearTimeout(timer as number);
    timer = window.setTimeout(() => {
        let { value } = searchInput;
        let { url, type } = parseInput(value);
        (async () => {
            let response = await fetch(url);
            let result = await response.json();
            console.log(result);
        })();
    }, eventDelay);
});

let supportDynamicImport = false;
try {
    let meta = import.meta;
    supportDynamicImport = true;
} catch (e) { }

const importShim = async (id: string) => await (supportDynamicImport ? import(id) : importModule(id));

(async () => {
    const { default: size } = await importShim("./esbuild.js");
    console.log(await size("pako"));
    console.log(await size("@okikio/manager"));
})();


