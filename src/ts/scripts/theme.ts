export const ThemeChange = new Event('theme-change', {
    bubbles: true,
    cancelable: true,
    composed: false
});

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
    let themeColor = theme == "system" ? mediaTheme() : theme;
    html.setAttribute("data-theme", theme);
    html.classList.toggle("dark", themeColor == "dark");
    setTheme(theme);
    document.dispatchEvent(ThemeChange);
};

export let runTheme = () => {
    try {
        let theme = getTheme();
        if (theme === null) {
            themeSet("system");
        } else themeSet(theme);

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            themeSet("system");
        });

        window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
            themeSet("system");
        });
    } catch (e) {
        console.warn("Theming isn't available on this browser.", e);
    }
};

runTheme();