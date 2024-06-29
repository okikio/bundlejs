export const ThemeChange = new Event("theme-change", {
  bubbles: true,
  cancelable: true,
  composed: false
});

// Based on [joshwcomeau.com/gatsby/dark-mode/]
export const getTheme = (): string | null => {
  const theme = globalThis?.localStorage?.getItem?.("theme");
  // If the user has explicitly chosen light or dark,
  // let's use it. Otherwise, this value will be null.
  if (typeof theme === "string") return theme;

  // If they are using a browser/OS that doesn't support
  // color themes, let's default to 'light'.
  return null;
};

export const setTheme = (theme: string): void => {
  // If the user has explicitly chosen light or dark, store the default theme
  if (typeof theme === "string")
    globalThis?.localStorage?.setItem?.("theme", theme);
};

export const mediaTheme = (): string | null => {
  // If they haven't been explicitly set, let's check the media query
  const mql = globalThis?.matchMedia?.("(prefers-color-scheme: dark)");
  const hasMediaQueryPreference = typeof mql?.matches === "boolean";
  if (hasMediaQueryPreference) return mql?.matches ? "dark" : "light";
  return null;
};

// Get theme from html tag, if it has a theme or get it from localStorage
export const themeGet = (html: HTMLHtmlElement) => {
  const themeAttr = html?.getAttribute?.("data-theme");
  if (typeof themeAttr === "string" && themeAttr?.length) {
    return themeAttr;
  }

  return getTheme();
};

// Set theme in localStorage, as well as in the html tag
export const themeSet = (theme: string, html: HTMLHtmlElement) => {
  const themeColor = theme === "system" ? mediaTheme() : theme;
  html?.setAttribute?.("data-theme", theme);
  html?.classList?.toggle?.("dark", themeColor === "dark");
  setTheme(theme);
  document?.dispatchEvent?.(ThemeChange);
};

export const runTheme = (html: HTMLHtmlElement | null) => {
  if (!html) return;
  try {
    const theme = getTheme();
    if (theme === null) {
      themeSet("system", html);
    } else themeSet(theme, html);

    globalThis
      ?.matchMedia?.("(prefers-color-scheme: dark)")
      ?.addEventListener("change", () => themeSet("system", html));

    globalThis
      ?.matchMedia?.("(prefers-color-scheme: light)")
      ?.addEventListener("change", () => themeSet("system", html));
  } catch (e) {
    console.warn("Theming isn't available on this browser.", e);
  }
};