import { Application, DefaultTheme, DefaultThemeRenderContext, ParameterType, JSX } from "typedoc";

class MyThemeContext extends DefaultThemeRenderContext {
    // Important: If you use `this`, this function MUST be bound! Template functions are free
    // to destructure the context object to only grab what they care about.
    override analytics = () => {
        // Reusing existing option rather than declaring our own for brevity
        if (!this.options.isSet("umami-id")) return;

        const id = this.options.getValue("umami-id");
        const src = this.options.getValue("umami-src");

        return (
            <script async defer data-website-id={id} src={src}></script>
        );
    };
}

class MyTheme extends DefaultTheme {
    private _contextCache?: MyThemeContext;
    override getRenderContext() {
        if (!this._contextCache) {
            this._contextCache = new MyThemeContext(this, this.application.options);
        }
        return this._contextCache;
    }
}

export function load(app: Application) {
    app.options.addDeclaration({
        name: "umami-id",
        help: "The id you receive from umami analytics.",
        type: ParameterType.String, // The default
        defaultValue: "", // The default
    });
    app.options.addDeclaration({
        name: "umami-src",
        help: "The website source for umami analytics.",
        type: ParameterType.String, // The default
        defaultValue: "https://analytics.bundlejs.com/umami.js", // The default
    });
    app.renderer.defineTheme("umami-analytics", MyTheme);
}