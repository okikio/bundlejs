import importModule from "@uupaa/dynamic-import-polyfill";
const navbar = document.querySelector(".navbar") as HTMLElement;
let canScroll = true;

const scroll = () => {
    if (canScroll) {
        let raf: number | void;
        canScroll = false;
        raf = requestAnimationFrame(() => {
            navbar.classList.toggle("shadow", window.scrollY >= 5);

            canScroll = true;
            raf = window.cancelAnimationFrame(raf as number);
        });
    }
};

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

window.addEventListener("scroll", scroll, { passive: true });

