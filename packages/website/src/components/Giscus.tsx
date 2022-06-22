import { type ComponentProps, mergeProps, onCleanup, onMount, createSignal, createEffect } from "solid-js";

// import "./style.module.css";

export const GISCUS_SESSION_KEY = 'giscus-session';
export const GISCUS_ORIGIN = 'https://discus.bundlejs.com';
export const ERROR_SUGGESTION = `Please consider reporting this error at https://github.com/giscus/giscus/issues/new.`;

export function formatError(message: string) {
  return `[giscus] An error occurred. Error message: "${message}".`;
}

export function Giscus(props?: GiscusProps & ComponentProps<'div'>) {
  let ref: HTMLIFrameElement = null;
  let __session = '';

  let mergedProps = mergeProps({
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'bottom',
    theme: 'light',
    lang: 'en',
    loading: 'eager',
  }, props);

  function sendMessage<T>(message: T) {
    ref?.contentWindow?.postMessage(
      { giscus: message },
      GISCUS_ORIGIN
    );
  }

  function getOgMetaContent(property: string) {
    const element = globalThis?.document?.querySelector(
      `meta[property='og:${property}'],meta[name='${property}']`
    ) as HTMLMetaElement;

    return element ? element.content : '';
  }

  function getCleanedUrl() {
    const url = new URL(globalThis?.location?.href);
    url.searchParams.delete('giscus');
    return url;
  }

  function getTerm() {
    switch (mergedProps.mapping) {
      case 'url':
        return `${getCleanedUrl()}`;
      case 'title':
        return document?.title;
      case 'og:title':
        return getOgMetaContent('title');
      case 'specific':
        return mergedProps.term || '';
      case 'number':
        return '';
      case 'pathname':
      default:
        return globalThis?.location?.pathname.length < 2
          ? 'index'
          : globalThis?.location?.pathname.substring(1).replace(/\.\w+$/, '');
    }
  }

  function getNumber() {
    return (mergedProps.mapping === 'number' && mergedProps.term) || '';
  }

  function updateConfig() {
    const setConfig: ISetConfigMessage = {
      setConfig: {
        repo: mergedProps.repo,
        repoId: mergedProps.repoId,
        category: mergedProps.category,
        categoryId: mergedProps.categoryId,
        term: getTerm(),
        number: +getNumber(),
        reactionsEnabled: mergedProps.reactionsEnabled === '1',
        emitMetadata: mergedProps.emitMetadata === '1',
        inputPosition: mergedProps.inputPosition as InputPosition,
        theme: mergedProps.theme,
        lang: mergedProps.lang,
      },
    };

    sendMessage(setConfig);
  }

  function onMessage(event: MessageEvent) {
    if (event.origin !== GISCUS_ORIGIN) return;

    const { data } = event;
    if (!(typeof data === 'object' && data.giscus)) return;
    if (ref && data.giscus.resizeHeight) {
      ref.style.height = `${data.giscus.resizeHeight}px`;
    }
    if (!data.giscus.error) return;

    const message: string = data.giscus.error;

    if (
      message.includes('Bad credentials') ||
      message.includes('Invalid state value')
    ) {
      // Might be because token is expired or other causes
      if (localStorage.getItem(GISCUS_SESSION_KEY) !== null) {
        localStorage.removeItem(GISCUS_SESSION_KEY);
        __session = '';
        console.warn(`${formatError(message)} Session has been cleared.`);
        // Reload iframe
        // After loaded, just update the config without rerendering.
        updateConfig();
        return;
      }

      console.error(
        `${formatError(message)} No session is stored initially. ${ERROR_SUGGESTION
        }`
      );
    }

    if (message.includes('Discussion not found')) {
      console.warn(
        `[giscus] ${message}. A new discussion will be created if a comment/reaction is submitted.`
      );
      return;
    }

    console.error(`${formatError(message)} ${ERROR_SUGGESTION}`);
  }

  function getIframeSrc() {
    const url = getCleanedUrl();
    const origin = `${url}${mergedProps.id ? '#' + mergedProps.id : ''}`;
    const description = getOgMetaContent('description');
    const params: Record<string, string> = {
      origin,
      session: __session,
      repo: mergedProps.repo,
      repoId: mergedProps.repoId || '',
      category: mergedProps.category || '',
      categoryId: mergedProps.categoryId || '',
      term: getTerm(),
      number: getNumber(),
      reactionsEnabled: mergedProps.reactionsEnabled,
      emitMetadata: mergedProps.emitMetadata,
      inputPosition: mergedProps.inputPosition,
      theme: mergedProps.theme,
      description,
    };

    const locale = mergedProps.lang ? `/${mergedProps.lang}` : '';
    const searchParams = new URLSearchParams(params);
    return `${GISCUS_ORIGIN}${locale}/widget?${searchParams}`;
  }

  function setupSession() {
    const origin = globalThis?.location?.href;
    const url = new URL(origin);
    const savedSession = globalThis?.localStorage?.getItem(GISCUS_SESSION_KEY);
    const urlSession = url.searchParams.get('giscus') || '';

    if (urlSession) {
      globalThis?.localStorage?.setItem(GISCUS_SESSION_KEY, JSON.stringify(urlSession));
      __session = urlSession;
      url.searchParams.delete('giscus');
      globalThis?.history?.replaceState(undefined, document.title, url.toString());
      return;
    }

    if (savedSession) {
      try {
        __session = JSON.parse(savedSession || '') || '';
      } catch (e: any) {
        __session = '';
        globalThis?.localStorage?.removeItem(GISCUS_SESSION_KEY);
        console.warn(
          `${formatError(e?.message)} Session has been cleared.`
        );
      }
    }
  }

  onMount(() => {
    ref.setAttribute("src", getIframeSrc());
    setupSession();
    globalThis?.addEventListener?.('message', onMessage);
  });

  onCleanup(() => {
    globalThis?.removeEventListener?.('message', onMessage);
  });

  return (
    <iframe
      title="Comments"
      ref={ref}
      class="giscus-frame"

      // @ts-ignore
      scrolling="no"
      src="about:blank"
      loading={mergedProps.loading}

      crossorigin="anonymous"
      defer

      fetchpriority="low"
      sandbox="allow-scripts"
      part="iframe"
    />
  );
}

export default Giscus;

export type GenericString = string & Record<never, never>;
export type Loading = 'lazy' | 'eager';
export type BooleanString = '0' | '1';
export type InputPosition = 'top' | 'bottom';
export type Repo = `${string}/${string}`;
export type Mapping =
  | 'url'
  | 'title'
  | 'og:title'
  | 'specific'
  | 'number'
  | 'pathname';

export type Theme =
  | 'light'
  | 'light_high_contrast'
  | 'light_protanopia'
  | 'dark'
  | 'dark_high_contrast'
  | 'dark_protanopia'
  | 'dark_dimmed'
  | 'transparent_dark'
  | 'preferred_color_scheme'
  | `https://${string}`
  | GenericString;

export type AvailableLanguage =
  | 'de'
  | 'gsw'
  | 'en'
  | 'es'
  | 'fr'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'pl'
  | 'ro'
  | 'ru'
  | 'tr'
  | 'vi'
  | 'zh-CN'
  | 'zh-TW'
  | GenericString;

export interface GiscusProps {
  id?: string;

  /**
   * Repo where the discussion is stored.
   */
  repo: Repo;

  /**
   * ID of the repo where the discussion is stored.
   */
  repoId: string;

  /**
   * Category where the discussion will be searched.
   */
  category?: string;

  /**
   * ID of the category where new discussions will be created.
   */
  categoryId?: string;

  /**
   * Mapping between the parent page and the discussion.
   */
  mapping: Mapping;

  /**
   * Search term to use when searching for the discussion.
   */
  term?: string;

  /**
   * Theme that giscus will be displayed in.
   */
  theme?: Theme;

  /**
   * Enable reactions to the main post of the discussion.
   */
  reactionsEnabled?: BooleanString;

  /**
   * Emit the discussion metadata periodically to the parent page.
   */
  emitMetadata?: BooleanString;

  /**
   * Placement of the comment box (`top` or `bottom`).
   */
  inputPosition?: InputPosition;

  /**
   * Language that giscus will be displayed in.
   */
  lang?: AvailableLanguage;

  /**
   * Whether the iframe should be loaded lazily or eagerly.
   */
  loading?: Loading;
}

export interface ISetConfigMessage {
  setConfig: {
    theme?: Theme;
    repo?: string;
    repoId?: string;
    category?: string;
    categoryId?: string;
    term?: string;
    description?: string;
    number?: number;
    reactionsEnabled?: boolean;
    emitMetadata?: boolean;
    inputPosition?: InputPosition;
    lang?: AvailableLanguage;
  };
}