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
class MyThemeContext extends import_typedoc.DefaultThemeRenderContext {
  analytics = () => {
    if (!this.options.isSet("umami-id"))
      return;
    const id = this.options.getValue("umami-id");
    const src = this.options.getValue("umami-src");
    return /* @__PURE__ */ import_typedoc.JSX.createElement("script", {
      async: true,
      defer: true,
      "data-website-id": id,
      src
    });
  };
}
class MyTheme extends import_typedoc.DefaultTheme {
  _contextCache;
  getRenderContext() {
    if (!this._contextCache) {
      this._contextCache = new MyThemeContext(this, this.application.options);
    }
    return this._contextCache;
  }
}
function load(app) {
  app.options.addDeclaration({
    name: "umami-id",
    help: "The id you receive from umami analytics.",
    type: import_typedoc.ParameterType.String,
    defaultValue: ""
  });
  app.options.addDeclaration({
    name: "umami-src",
    help: "The website source for umami analytics.",
    type: import_typedoc.ParameterType.String,
    defaultValue: "https://analytics.bundlejs.com/umami.js"
  });
  app.renderer.defineTheme("umami-analytics", MyTheme);
}
