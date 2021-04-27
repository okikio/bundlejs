import toArr from "./toArr";

// Based on [joshwcomeau.com/gatsby/dark-mode/]
export let getTheme = (): string | null => {
    let theme = window.localStorage.getItem("theme");
    // If the user has explicitly chosen light or dark,
    // let's use it. Otherwise, this value will be null.
    if (typeof theme === "string") return theme;

    // If they are using a browser/OS that doesn't support
    // color themes, let's default to 'light'.
    return null;
};

export let setTheme = (theme: string): void => {
    // If the user has explicitly chosen light or dark, store the default theme
    if (typeof theme === "string") window.localStorage.setItem("theme", theme);
};

export let mediaTheme = (): string | null => {
    // If they haven't been explicitly set, let's check the media query
    let mql = window.matchMedia("(prefers-color-scheme: dark)");
    let hasMediaQueryPreference = typeof mql.matches === "boolean";
    if (hasMediaQueryPreference) return mql.matches ? "dark" : "light";
    return null;
};

let html = document.querySelector("html");
// Get theme from html tag, if it has a theme or get it from localStorage
export let themeGet = () => {
    let themeAttr = html.getAttribute("data-theme");
    if (typeof themeAttr === "string" && themeAttr.length) {
        return themeAttr;
    }

    return getTheme();
};

// Set theme in localStorage, as well as in the html tag
export let themeSet = (theme: string) => {
    html.setAttribute("data-theme", theme);
    html.classList.toggle("dark", theme == "dark");
    setTheme(theme);
};

export let runTheme = () => {
    try {
        let theme = getTheme();
        if (theme === null) theme = mediaTheme();
        theme && themeSet(theme);

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            themeSet(e.matches ? "dark" : "light");
        });

        window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
            themeSet(e.matches ? "light" : "dark");
        });

    } catch (e) {
        console.warn("Theming isn't available on this browser.", e);
    }
};

let handler = (() => {
    document.removeEventListener("DOMContentLoaded", handler);
    window.removeEventListener("load", handler);

    try {
        // On theme switcher button click (mouseup is a tiny bit more efficient) toggle the theme between dark and light mode
        let themeSwitch = toArr(document.querySelectorAll(".theme-toggle"));
        if (themeSwitch[0]) {
            for (let el of themeSwitch)
                el.addEventListener("click", () => {
                    themeSet(themeGet() === "dark" ? "light" : "dark");
                });
        }
    } catch (e) {
        console.warn("Theming seems to break on this browser.", e);
    }
}).bind(this);

runTheme();
document.addEventListener("DOMContentLoaded", handler);
window.addEventListener("load", handler);