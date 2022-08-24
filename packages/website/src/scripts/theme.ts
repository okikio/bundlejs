export const ThemeChange = new Event('theme-change', {
  bubbles: true,
  cancelable: true,
  composed: false
});

// Based on [joshwcomeau.com/gatsby/dark-mode/]
export let getTheme = (): string | null => {
  let theme = globalThis?.localStorage?.getItem?.("theme");
  // If the user has explicitly chosen light or dark,
  // let's use it. Otherwise, this value will be null.
  if (typeof theme === "string") return theme;

  // If they are using a browser/OS that doesn't support
  // color themes, let's default to 'light'.
  return null;
};

export let setTheme = (theme: string): void => {
  // If the user has explicitly chosen light or dark, store the default theme
  if (typeof theme === "string")
    globalThis?.localStorage?.setItem?.("theme", theme);
};

export let mediaTheme = (): string | null => {
  // If they haven't been explicitly set, let's check the media query
  let mql = globalThis?.matchMedia?.("(prefers-color-scheme: dark)");
  let hasMediaQueryPreference = typeof mql?.matches === "boolean";
  if (hasMediaQueryPreference) return mql?.matches ? "dark" : "light";
  return null;
};

// Get theme from html tag, if it has a theme or get it from localStorage
export let themeGet = (html: HTMLHtmlElement) => {
  let themeAttr = html?.getAttribute?.("data-theme");
  if (typeof themeAttr === "string" && themeAttr?.length) {
    return themeAttr;
  }

  return getTheme();
};

/**
 * Send a message to Giscus
 * @param message 
 * @returns 
 */
function sendMessage<T>(message: T) {
  try {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!iframe) return;

    const iframeOrigin = "https://giscus.bundlejs.com";
    console.log(iframe?.contentWindow)
    
    if (iframe?.contentWindow?.location?.origin !== "null") {
      iframe.contentWindow?.postMessage?.({ giscus: message }, iframeOrigin);
    }
  } catch (e) {
    console.warn(e);
  }
}

// Set theme in localStorage, as well as in the html tag
export let themeSet = (theme: string, html: HTMLHtmlElement) => {
  let themeColor = theme == "system" ? mediaTheme() : theme;
  sendMessage({
    setConfig: {
      theme: ({ 
        "dark": new URL(`/giscus/dark.css`, import.meta.url).href,
        "light": new URL(`/giscus/light.css`, import.meta.url).href,
      })[themeColor]
    }
  });

  html?.setAttribute?.("data-theme", theme);
  html?.classList?.toggle?.("dark", themeColor == "dark");
  setTheme(theme);
  document?.dispatchEvent?.(ThemeChange);
};

export let runTheme = (html: HTMLHtmlElement) => {
  try {
    let theme = getTheme();
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