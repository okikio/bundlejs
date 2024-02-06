export const hook = (_this, method, callback) => {
  const orig = _this[method];

  return (...args) => {
    callback.apply(null, args);

    return orig.apply(_this, args);
  };
};

export const doNotTrack = () => {
  // @ts-ignore
  const { doNotTrack, navigator, external } = window;

  const msTrackProtection = 'msTrackingProtectionEnabled';
  const msTracking = () => {
    return external && msTrackProtection in external && external[msTrackProtection]();
  };

  // @ts-ignore
  const dnt = doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack || msTracking();

  return dnt == '1' || dnt === 'yes';
};

export function removeTrailingSlash(url) {
  return url && url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

(window => {
  try {
  const apiRoute = "/take-measurement"; // "/api/collect";

  const {
    screen: { width, height },
    navigator: { language },
    location: { hostname, pathname, search },
    localStorage,
    document,
    history,
  } = window;

  const script = document.querySelector('script[data-website-id]') as HTMLScriptElement;

  if (!script) return;
  
  const attr = script.getAttribute.bind(script);
  const website = attr('data-website-id');
  const hostUrl = attr('data-host-url');
  const autoTrack = attr('data-auto-track') !== 'false';
  const dnt = attr('data-do-not-track');
  const cssEvents = attr('data-css-events') !== 'false';
  const domain = attr('data-domains') || '';
  const domains = domain.split(',').map(n => n.trim());

  const eventClass = /^umami--([a-z]+)--([\w]+[\w-]*)$/;
  const eventSelect = "[class*='umami--']";

  const trackingDisabled = () =>
    (localStorage && localStorage.getItem('umami.disabled')) ||
    (dnt && doNotTrack()) ||
    (domain && !domains.includes(hostname));

  const root = hostUrl
    ? removeTrailingSlash(hostUrl)
    : ""; // script.src.split('/').slice(0, -1).join('/');
  const screen = `${width}x${height}`;
  const listeners = {};
  let currentUrl = `${pathname}${search}`;
  let currentRef = document.referrer;
  let cache;

  /* Collect metrics */

  const post = (url, data, callback) => {
    const req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    if (cache) req.setRequestHeader('x-umami-cache', cache);

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        callback(req.response);
      }
    };

    req.send(JSON.stringify(data));
  };

  const assign = (a, b) => {
    Object.keys(b).forEach(key => {
      a[key] = b[key];
    });
    return a;
  };
  
  
  const getPayload = () => ({
    website,
    hostname,
    screen,
    language,
    url: currentUrl,
  });

  const endpoint = `${root}${apiRoute}`;
  const collect = (type, payload) => {
    if (trackingDisabled()) return;

    return fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ type, payload }),
      headers: assign({ 'Content-Type': 'application/json' }, { ['x-umami-cache']: cache }),
    })
      .then(res => res.text())
      .then(text => (cache = text));
  };

  const trackView = (url = currentUrl, referrer = currentRef, websiteUuid = website) =>
    collect(
      'pageview',
      assign(getPayload(), {
        website: websiteUuid,
        url,
        referrer,
      }),
    );

  const trackEvent = (eventName, eventData, url = currentUrl, websiteUuid = website) =>
    collect(
      'event',
      assign(getPayload(), {
        website: websiteUuid,
        url,
        event_name: eventName,
        event_data: eventData,
      }),
    );

  /* Handle events */

  const addEvents = node => {
    const elements = node.querySelectorAll(eventSelect);
    Array.prototype.forEach.call(elements, addEvent);
  };

  const addEvent = element => {
    const get = element.getAttribute.bind(element);
    (get('class') || '').split(' ').forEach(className => {
      if (!eventClass.test(className)) return;

      const [, event, name] = className.split('--');

      const listener = listeners[className]
        ? listeners[className]
        : (listeners[className] = e => {
            if (
              event === 'click' &&
              element.tagName === 'A' &&
              !(
                e.ctrlKey ||
                e.shiftKey ||
                e.metaKey ||
                (e.button && e.button === 1) ||
                get('target')
              )
            ) {
              e.preventDefault();
              trackEvent(name).then(() => {
                const href = get('href');
                if (href) {
                  location.href = href;
                }
              });
            } else {
              trackEvent(name);
            }
          });

      element.addEventListener(event, listener, true);
    });
  };

  /* Handle history changes */

  const handlePush = (state, title, url) => {
    if (!url) return;

    currentRef = currentUrl;
    const newUrl = url.toString();

    if (newUrl.substring(0, 4) === 'http') {
      currentUrl = '/' + newUrl.split('/').splice(3).join('/');
    } else {
      currentUrl = newUrl;
    }

    if (currentUrl !== currentRef) {
      trackView();
    }
  };

  const observeDocument = () => {
    const monitorMutate = mutations => {
      mutations.forEach(mutation => {
        const element = mutation.target;
        addEvent(element);
        addEvents(element);
      });
    };

    const observer = new MutationObserver(monitorMutate);
    observer.observe(document, { childList: true, subtree: true });
  };

  /* Global */

  if (!window.umami) {
    const umami = eventValue => trackEvent(eventValue);
    umami.trackView = trackView;
    umami.trackEvent = trackEvent;
    
    // @ts-ignore
    window.umami = umami;
  }

  /* Start */

  if (autoTrack && !trackingDisabled()) {
    history.pushState = hook(history, 'pushState', handlePush);
    history.replaceState = hook(history, 'replaceState', handlePush);

    const update = () => {
      if (document.readyState === 'complete') {
        trackView();

        if (cssEvents) {
          addEvents(document);
          observeDocument();
        }
      }
    };

    document.addEventListener('readystatechange', update, true);

    update();
  }
} catch (e) {
console.warn(e)
}
})(window);
