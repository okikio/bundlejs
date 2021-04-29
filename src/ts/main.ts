import { sanitize } from "dompurify";
import { importShim } from "./util/dynamic-import";
import { setState, build } from "./components/SearchResults";
import { batch } from "solid-js";

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

const host = "https://registry.npmjs.com/";
let parseInput = (input: string) => {
    let value = sanitize(input);
    let exec = /([\S]+)@([\S]+)/g.exec(value);
    let search = `${value}`.replace(/^@/, "");
    let urlScheme = `${host}/-/v1/search?text=${search}&size=10&boost-exact=false`;
    let version = "";

    if (exec) {
        let [, pkg, ver] = exec;
        version = ver;
        urlScheme = `${host}/-/v1/search?text=${pkg}&size=10&boost-exact=false`;
    }

    return { url: urlScheme, version }
};

let results = [];
(async () => {
    const { default: size } = await importShim("./esbuild.js");
    searchInput?.addEventListener?.("input", () => {
        let timer: number | void;

        // Set a timeout to debounce the keyup event
        timer = window.setTimeout(() => {
            let { value } = searchInput;
            let { url, version } = parseInput(value);
            (async () => {
                let response = await fetch(url);
                let result = await response.json();
                results = result.objects.map(obj => {
                    const { name, description, date, publisher } = obj.package;
                    return {
                        name, description,
                        date, version,
                        author: publisher.username
                    };
                });

                batch(() => {
                    setState("objects", results);
                    setState("index", 0);
                });
            })();

            timer = window.clearTimeout(timer as number);
        }, eventDelay);
    });

    let pkg = "@okikio/native"
    console.log(`Test package \'${pkg}\' is ${await size(pkg)}`);

    build();
})();
