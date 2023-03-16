export const hook = (_this: Record<string, (...args: unknown[]) => unknown>, method: string, callback: (...args: unknown[]) => unknown) => {
  const orig = _this[method];

  return (...args: unknown[]) => {
    callback(...args);

    return orig.apply(_this, args);
  };
};

export const doNotTrack = () => {
  const { doNotTrack, navigator, external } = globalThis as typeof globalThis & { doNotTrack: boolean, external: Record<string, (...args: unknown[]) => unknown> };

  const msTrackProtection = "msTrackingProtectionEnabled";
  const msTracking = () => {
    return external && msTrackProtection in external && external[msTrackProtection]();
  };

  // @ts-ignore Navigator doNotTrack
  const dnt = doNotTrack || navigator.doNotTrack || msTracking();

  return dnt == "1" || dnt === "yes";
};

export function removeTrailingSlash(url: string) {
  return url && url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
}

const apiRoute = "/take-measurement"; // "/api/collect";

const {
  navigator: { language },
  location: { hostname, pathname, search },
  localStorage,
} = window;

export const attr = <T>(id: string) => {
  return ({
    "data-host-url": "https://bundlejs.com",
    "data-domains": "bundlejs.com,bundle.js.org,bundlesize.com,deno.bundlejs.com,edge.bundlejs.com",
    "data-website-id": Deno.env.get("UMAMI_ID"),
    "data-do-not-track": Boolean(Deno.env.get("UMAMI_DEV_MODE")) ?? false
  } as const)[id];
};
const website = attr("data-website-id") as string;
const hostUrl = attr("data-host-url") as string;
const autoTrack = attr("data-auto-track") !== "false";
const dnt = attr("data-do-not-track");
const domain = attr("data-domains") as string || "";
const domains = domain.split(",").map(n => n.trim());

export const trackingDisabled = () =>
  (localStorage && localStorage.getItem("umami.disabled")) ||
  (dnt || doNotTrack());

export const root = hostUrl
  ? removeTrailingSlash(hostUrl)
  : ""; // script.src.split('/').slice(0, -1).join('/');
const currentUrl = `${pathname}${search}`;
let cache: string | undefined;

export let currentRef = "";

/* Collect metrics */
const getPayload = () => ({
  website,
  hostname,
  language,
  url: currentUrl,
});

export const endpoint = `${root}${apiRoute}`;
export const collect = (type: string, payload: any) => {
  if (trackingDisabled()) return;

  try {
    return fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ type, payload }),
      headers: Object.assign({ 'Content-Type': 'application/json' }, { ['x-umami-cache']: cache }) as HeadersInit,
    })
      .then(res => res.text())
      .then(text => (cache = text));
  } catch (e) {
    console.warn("Umami error", e);
  }
};

export const trackView = (url = currentUrl, referrer = currentRef, websiteUuid = website) =>
  collect(
    'pageview',
    Object.assign(getPayload(), {
      website: websiteUuid,
      url,
      referrer,
    }),
  );

export const trackEvent = (eventName: string, eventData: any = {}, url = currentUrl, websiteUuid = website) =>
  collect(
    'event',
    Object.assign(getPayload(), {
      website: websiteUuid,
      url,
      event_name: `api-${eventName}`,
      event_data: eventData,
    }),
  );


/* Global */

if (!(globalThis as typeof globalThis & { umami: object }).umami) {
  const umami = (eventValue: string) => trackEvent(eventValue);
  umami.trackView = trackView;
  umami.trackEvent = trackEvent;

  (globalThis as typeof globalThis & { umami: object }).umami = umami;
}

/* Start */

if (autoTrack && !trackingDisabled()) {
  trackView();
}