import { toArr } from "./toArr";

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

window.addEventListener("scroll", scroll, { passive: true });

