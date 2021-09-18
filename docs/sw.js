try{self["workbox:core:6.2.4"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:6.2.4"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}setCatchHandler(e){this.catchHandler=s(e)}}class i extends n{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class r{constructor(){this.t=new Map,this.i=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const n=s.origin===location.origin,{params:i,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:n,url:s});let a=r&&r.handler;const c=e.method;if(!a&&this.i.has(c)&&(a=this.i.get(c)),!a)return;let o;try{o=a.handle({url:s,request:e,event:t,params:i})}catch(e){o=Promise.reject(e)}const h=r&&r.catchHandler;return o instanceof Promise&&(this.o||h)&&(o=o.catch((async n=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:i})}catch(e){e instanceof Error&&(n=e)}if(this.o)return this.o.handle({url:s,request:e,event:t});throw n}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:n}){const i=this.t.get(s.method)||[];for(const r of i){let i;const a=r.match({url:e,sameOrigin:t,request:s,event:n});if(a)return i=a,(Array.isArray(i)&&0===i.length||a.constructor===Object&&0===Object.keys(a).length||"boolean"==typeof a)&&(i=void 0),{route:r,params:i}}return{}}setDefaultHandler(e,t="GET"){this.i.set(t,s(e))}setCatchHandler(e){this.o=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let a;const c=()=>(a||(a=new r,a.addFetchListener(),a.addCacheListener()),a);function o(e,s,r){let a;if("string"==typeof e){const t=new URL(e,location.href);a=new n((({url:e})=>e.href===t.href),s,r)}else if(e instanceof RegExp)a=new i(e,s,r);else if("function"==typeof e)a=new n(e,s,r);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=e}return c().registerRoute(a),a}try{self["workbox:cacheable-response:6.2.4"]&&_()}catch(e){}class h{constructor(e={}){this.h=e.statuses,this.l=e.headers}isResponseCacheable(e){let t=!0;return this.h&&(t=this.h.includes(e.status)),this.l&&t&&(t=Object.keys(this.l).some((t=>e.headers.get(t)===this.l[t]))),t}}try{self["workbox:strategies:6.2.4"]&&_()}catch(e){}const l={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null},f={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},u=e=>[f.prefix,e,f.suffix].filter((e=>e&&e.length>0)).join("-"),d=e=>e||u(f.precache),w=e=>e||u(f.runtime);function p(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class b{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const v=new Set;function m(e){return"string"==typeof e?new Request(e):e}class y{constructor(e,t){this.u={},Object.assign(this,t),this.event=t.event,this.p=e,this.v=new b,this.m=[],this.j=[...e.plugins],this.g=new Map;for(const e of this.j)this.g.set(e,{});this.event.waitUntil(this.v.promise)}async fetch(e){const{event:s}=this;let n=m(e);if("navigate"===n.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const i=this.hasCallback("fetchDidFail")?n.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))n=await e({request:n.clone(),event:s})}catch(e){if(e instanceof Error)throw new t("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}const r=n.clone();try{let e;e=await fetch(n,"navigate"===n.mode?void 0:this.p.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:r,response:e});return e}catch(e){throw i&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:i.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=m(e);let s;const{cacheName:n,matchOptions:i}=this.p,r=await this.getCacheKey(t,"read"),a=Object.assign(Object.assign({},i),{cacheName:n});s=await caches.match(r,a);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:n,matchOptions:i,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(e,s){const n=m(e);var i;await(i=0,new Promise((e=>setTimeout(e,i))));const r=await this.getCacheKey(n,"write");if(!s)throw new t("cache-put-with-no-response",{url:(a=r.url,new URL(String(a),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var a;const c=await this.R(s);if(!c)return!1;const{cacheName:o,matchOptions:h}=this.p,l=await self.caches.open(o),f=this.hasCallback("cacheDidUpdate"),u=f?await async function(e,t,s,n){const i=p(t.url,s);if(t.url===i)return e.match(t,n);const r=Object.assign(Object.assign({},n),{ignoreSearch:!0}),a=await e.keys(t,r);for(const t of a)if(i===p(t.url,s))return e.match(t,n)}(l,r.clone(),["__WB_REVISION__"],h):null;try{await l.put(r,f?c.clone():c)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of v)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:o,oldResponse:u,newResponse:c.clone(),request:r,event:this.event});return!0}async getCacheKey(e,t){if(!this.u[t]){let s=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))s=m(await e({mode:t,request:s,event:this.event,params:this.params}));this.u[t]=s}return this.u[t]}hasCallback(e){for(const t of this.p.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this.p.plugins)if("function"==typeof t[e]){const s=this.g.get(t),n=n=>{const i=Object.assign(Object.assign({},n),{state:s});return t[e](i)};yield n}}waitUntil(e){return this.m.push(e),e}async doneWaiting(){let e;for(;e=this.m.shift();)await e}destroy(){this.v.resolve(null)}async R(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class j{constructor(e={}){this.cacheName=w(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,n="params"in e?e.params:void 0,i=new y(this,{event:t,request:s,params:n}),r=this.q(i,s,t);return[r,this.U(r,i,s,t)]}async q(e,s,n){let i;await e.runCallbacks("handlerWillStart",{event:n,request:s});try{if(i=await this.L(s,e),!i||"error"===i.type)throw new t("no-response",{url:s.url})}catch(t){if(t instanceof Error)for(const r of e.iterateCallbacks("handlerDidError"))if(i=await r({error:t,event:n,request:s}),i)break;if(!i)throw t}for(const t of e.iterateCallbacks("handlerWillRespond"))i=await t({event:n,request:s,response:i});return i}async U(e,t,s,n){let i,r;try{i=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:n,request:s,response:i}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:n,request:s,response:i,error:r}),t.destroy(),r)throw r}}function g(e,t){const s=t();return e.waitUntil(s),s}try{self["workbox:precaching:6.2.4"]&&_()}catch(e){}function R(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(n,location.href),r=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:r.href}}class q{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class U{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this.N.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this.N=e}}let L,N;async function E(e,s){let n=null;if(e.url){n=new URL(e.url).origin}if(n!==self.location.origin)throw new t("cross-origin-copy-response",{origin:n});const i=e.clone(),r={headers:new Headers(i.headers),status:i.status,statusText:i.statusText},a=s?s(r):r,c=function(){if(void 0===L){const e=new Response("");if("body"in e)try{new Response(e.body),L=!0}catch(e){L=!1}L=!1}return L}()?i.body:await i.blob();return new Response(c,a)}class k extends j{constructor(e={}){e.cacheName=d(e.cacheName),super(e),this.k=!1!==e.fallbackToNetwork,this.plugins.push(k.copyRedirectedCacheableResponsesPlugin)}async L(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this.T(e,t):await this._(e,t))}async _(e,s){let n;const i=s.params||{};if(!this.k)throw new t("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{const t=i.integrity,r=e.integrity,a=!r||r===t;n=await s.fetch(new Request(e,{integrity:r||t})),t&&a&&(this.C(),await s.cachePut(e,n.clone()))}return n}async T(e,s){this.C();const n=await s.fetch(e);if(!await s.cachePut(e,n.clone()))throw new t("bad-precaching-response",{url:e.url,status:n.status});return n}C(){let e=null,t=0;for(const[s,n]of this.plugins.entries())n!==k.copyRedirectedCacheableResponsesPlugin&&(n===k.defaultPrecacheCacheabilityPlugin&&(e=s),n.cacheWillUpdate&&t++);0===t?this.plugins.push(k.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}k.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},k.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await E(e):e};class T{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this.O=new Map,this.W=new Map,this.S=new Map,this.p=new k({cacheName:d(e),plugins:[...t,new U({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this.p}precache(e){this.addToCacheList(e),this.M||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this.M=!0)}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:i}=R(n),r="string"!=typeof n&&n.revision?"reload":"default";if(this.O.has(i)&&this.O.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.O.get(i),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.S.has(e)&&this.S.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.S.set(e,n.integrity)}if(this.O.set(i,e),this.W.set(i,r),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return g(e,(async()=>{const t=new q;this.strategy.plugins.push(t);for(const[t,s]of this.O){const n=this.S.get(s),i=this.W.get(t),r=new Request(t,{integrity:n,cache:i,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:e}))}const{updatedURLs:s,notUpdatedURLs:n}=t;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(e){return g(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this.O.values()),n=[];for(const i of t)s.has(i.url)||(await e.delete(i),n.push(i.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this.O}getCachedURLs(){return[...this.O.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.O.get(t.href)}getIntegrityForCacheKey(e){return this.S.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(e){const s=this.getCacheKeyForURL(e);if(!s)throw new t("non-precached-url",{url:e});return t=>(t.request=new Request(e),t.params=Object.assign({cacheKey:s},t.params),this.strategy.handle(t))}}const x=()=>(N||(N=new T),N);class C extends n{constructor(e,t){super((({request:s})=>{const n=e.getURLsToCacheKeys();for(const i of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:i}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const a=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield a.href,s&&a.pathname.endsWith("/")){const e=new URL(a.href);e.pathname+=s,yield e.href}if(n){const e=new URL(a.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=n.get(i);if(t){return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}}),e.strategy)}}var O;self.skipWaiting(),O={ignoreURLParametersMatching:[/.*/]},function(e){x().precache(e)}([{url:"404.html",revision:"681b55a0cc9a74bac56ab98101456a00"},{url:"about.html",revision:"d0fa9d2b2e88a95cfcad26ab27958979"},{url:"css/app.min.css",revision:"719a7b967b1d98c1b13175f78f95b4c5"},{url:"faq.html",revision:"4635230b1a7907eb8d3bb7e30210ae93"},{url:"index.html",revision:"9c1ea4ebd2c99caaf0944b19db69c924"},{url:"js/chunk-3J66WWEF.js",revision:"f6d7beeb775184edcb740c6bc43b9452"},{url:"js/chunk-HNNS32X4.js",revision:"629b8dc85de95a0f0dfd181b490b4af2"},{url:"js/chunk-HQ7D2GSM.js",revision:"41b2fc83ae1e3d01a151d346a18cb16f"},{url:"js/chunk-JF6ZTFSE.js",revision:"657680790ddcbfe4e5366bab2e7ac386"},{url:"js/chunk-KT5CD4BK.js",revision:"4fd4d0b80d2f5ca9a2d652e7d9b84e88"},{url:"js/chunk-RTNLBWNL.js",revision:"b462ce0d0089ac187122e1a197570158"},{url:"js/critical.min.js",revision:"f7f2b98c8dbb30cf824a2848d3fd395a"},{url:"js/editor.worker.js",revision:"177ef2185522489fc474cb55b755eb3c"},{url:"js/esbuild.min.js",revision:"55e39c3072ce3a68e3555e6a11d0b557"},{url:"js/esbuild.worker.js",revision:"67af1d60634ff2d6cf34fac9f1e661d6"},{url:"js/highlightjs-AOQWXNSY.js",revision:"1397909f8ea9e69c06380cea8b21307d"},{url:"js/index.min.css",revision:"d3478d954cedcba016ced8d5d4a04032"},{url:"js/index.min.js",revision:"512cbde6fd4cbe81c998a994ad55ff84"},{url:"js/load-webanimation-polyfill.min.js",revision:"0bed87c265a1ec5abc55e005479032cf"},{url:"js/monaco.min.css",revision:"ba6cd997b0b465ef0c043d61f0822bd2"},{url:"js/monaco.min.js",revision:"8637139d2cb30f7ea33c931b019db8a0"},{url:"js/theme.min.js",revision:"3fc664572e26bd46e012330a7c0c7b6b"},{url:"js/tsMode-RDAZLNBX.js",revision:"4b583694d72f233b8c70a1f086cd0872"},{url:"js/tsMode-TGSQM37E.css",revision:"9b79051f612e8ec0c39543154b1492cd"},{url:"js/typescript-YRZGJFN3.css",revision:"90a483044ed59915c0223868a5d2eea7"},{url:"js/typescript-ZITT4RT7.js",revision:"8312821789fb4ce8781e8efbf6e5eede"},{url:"js/webanimation.min.js",revision:"86c2d5dfaff82d367e4c97d2c5037406"},{url:"manifest.json",revision:"a99ac4288a3286804e3c269417cf27ca"},{url:"badge-dark.svg",revision:"8ad177c0d6edbeea682bf11c7fc00eeb"},{url:"badge-light.svg",revision:"279ded711bb88f4580999d528790e5c8"},{url:"bundle.svg",revision:"71e3cd129093d86c46582cb777068900"},{url:"favicon/favicon.svg",revision:"71e3cd129093d86c46582cb777068900"},{url:"favicon/safari-pinned-tab.svg",revision:"48b75d4786381e0abf7bd913c9e6cdc5"},{url:"js/chunk-3J66WWEF.js.map",revision:"9cb1e48f2f80f2ca06843b1f8ca048ba"},{url:"js/chunk-HNNS32X4.js.map",revision:"4491fe31a18849a91943f4cad7949bd0"},{url:"js/chunk-HQ7D2GSM.js.map",revision:"0b3c726c5018d6ce15c7d7f260c464ca"},{url:"js/chunk-JF6ZTFSE.js.map",revision:"ef622ef01d914a72fc0888f295149d63"},{url:"js/chunk-RTNLBWNL.js.map",revision:"4491fe31a18849a91943f4cad7949bd0"},{url:"js/codicon.ttf",revision:"bda2dba51e7287ea093d42aafcc37986"},{url:"js/critical.min.js.map",revision:"11ff0e1a9144d8c711ebf5681eb9ded8"},{url:"js/editor.worker.js.map",revision:"695db7be1b4f4e99fe99322ddc5df670"},{url:"js/esbuild.min.js.map",revision:"4491fe31a18849a91943f4cad7949bd0"},{url:"js/esbuild.worker.js.map",revision:"6ae57b5da2920ffccaa7921f4f1e7f0e"},{url:"js/highlightjs-AOQWXNSY.js.map",revision:"401a91db26ffdb919903004416dcc9ed"},{url:"js/index.min.css.map",revision:"730e1527939ec5d3d3ec5ba3c16092a5"},{url:"js/index.min.js.map",revision:"3e4840157bf774a49df55a66388a57d0"},{url:"js/load-webanimation-polyfill.min.js.map",revision:"8140a14a1b725f084875e330a8f4738f"},{url:"js/monaco-WLSPK3F4.css.map",revision:"730e1527939ec5d3d3ec5ba3c16092a5"},{url:"js/theme.min.js.map",revision:"4491fe31a18849a91943f4cad7949bd0"},{url:"js/tsMode-RDAZLNBX.js.map",revision:"60f2c59ea18047b85baac11e1bffa3d8"},{url:"js/tsMode-TGSQM37E.css.map",revision:"f8be6768e7f6274a58709f8d1ac6ac84"},{url:"js/typescript-YRZGJFN3.css.map",revision:"f8be6768e7f6274a58709f8d1ac6ac84"},{url:"js/typescript-ZITT4RT7.js.map",revision:"e5007561fc1d61d531c39c85722e5cc9"},{url:"js/webanimation.min.js.map",revision:"4130ea02e8a8de798203c03dd8e96851"}]),function(e){const t=x();o(new C(t,e))}(O),self.addEventListener("activate",(e=>{const t=d();e.waitUntil((async(e,t="-precache-")=>{const s=(await self.caches.keys()).filter((s=>s.includes(t)&&s.includes(self.registration.scope)&&s!==e));return await Promise.all(s.map((e=>self.caches.delete(e)))),s})(t).then((e=>{})))})),o(/\.(?:png|jpg|jpeg|webp|woff2)$/,new class extends j{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(l)}async L(e,s){const n=s.fetchAndCachePut(e).catch((()=>{}));let i,r=await s.cacheMatch(e);if(r);else try{r=await n}catch(e){e instanceof Error&&(i=e)}if(!r)throw new t("no-response",{url:e.url,error:i});return r}}({cacheName:"assets",plugins:[new class{constructor(e){this.cacheWillUpdate=async({response:e})=>this.F.isResponseCacheable(e)?e:null,this.F=new h(e)}}({statuses:[200]})]}),"GET");
//# sourceMappingURL=sw.js.map