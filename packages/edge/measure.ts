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

export const post = async (url: string, data: object, callback: (res: Response) => any) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: [
        ["Content-Type", "application/json"],
        cache ? ["x-umami-cache", cache] : []
      ],
      body: JSON.stringify(data)
    })

    if (res.ok) {
      await callback(res);
    }

    return res;
  } catch (e) {
    console.warn("Umami error", e)
  }
};

export const getPayload = () => ({
  website,
  hostname,
  language,
  url: currentUrl,
});

export const collect = (type: string, payload: object) => {
  if (trackingDisabled()) return;

  post(
    `${root}${apiRoute}`,
    {
      type,
      payload,
    },
    async res => (cache = await res.text()),
  );
};

export const trackView = (url = currentUrl, referrer = currentRef, uuid = website) => {
  collect(
    "pageview",
    Object.assign(getPayload(), {
      website: uuid,
      url,
      referrer,
    }),
  );
};

export const trackEvent = (event_value: any, event_type = "custom", url = currentUrl, uuid = website) => {
  collect(
    "event",
    Object.assign(getPayload(), {
      website: uuid,
      url,
      event_type: `api-${event_type}`,
      event_value,
    }),
  );
};

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