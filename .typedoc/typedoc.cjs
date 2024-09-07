var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var typedoc_exports = {};
__export(typedoc_exports, {
  load: () => load
});
module.exports = __toCommonJS(typedoc_exports);
var import_typedoc = require("typedoc");
function load(app) {
  app.options.addDeclaration({
    name: "keywords",
    type: import_typedoc.ParameterType.Array,
    help: "Website keywords",
    defaultValue: [
      "spring easing",
      "spring animation",
      "custom easing",
      "framework agnostic",
      "gsap",
      "animejs"
    ]
  });
  app.renderer.hooks.on("head.begin", (ctx) => {
    const keywords = ctx.options.getValue("keywords");
    return /* @__PURE__ */ import_typedoc.JSX.createElement(import_typedoc.JSX.Fragment, null, /* @__PURE__ */ import_typedoc.JSX.createElement("meta", {
      name: "keyword",
      content: keywords.join(", ")
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("meta", {
      name: "color-scheme",
      content: "dark light"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("link", {
      rel: "shortcut icon",
      href: "/media/favicon.ico"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("link", {
      rel: "icon",
      type: "image/svg+xml",
      href: "/media/assets/favicon.svg"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("meta", {
      name: "web-author",
      content: "Okiki Ojo"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("meta", {
      name: "robots",
      content: "index, follow"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("meta", {
      name: "twitter:url",
      content: "https://spring-easing.okikio.dev/"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("meta", {
      name: "twitter:site",
      content: "@okikio_dev"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("meta", {
      name: "twitter:creator",
      content: "@okikio_dev"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("link", {
      href: "https://twitter.com/okikio_dev",
      rel: "me"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("link", {
      rel: "webmention",
      href: "https://webmention.io/spring-easing.okikio.dev/webmention"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("link", {
      rel: "pingback",
      href: "https://webmention.io/spring-easing.okikio.dev/xmlrpc"
    }), /* @__PURE__ */ import_typedoc.JSX.createElement("link", {
      rel: "pingback",
      href: "https://webmention.io/webmention?forward=https://spring-easing.okikio.dev/endpoint"
    }));
  });
}
