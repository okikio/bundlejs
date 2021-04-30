export const build = () => {
    const navbar = document.querySelector(".navbar") as HTMLElement;
    const backToTop = document.querySelector(".to-top") as HTMLButtonElement;

    let canScroll = true;
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
};