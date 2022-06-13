import { Application, ParameterType, JSX } from "typedoc";

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
        defaultValue: "/media/measure.js", // The default
    });

    app.options.addDeclaration({
        name: "keywords",
        type: ParameterType.Array,
        help: "Website keywords",
        defaultValue: [
            "spring easing",
            "spring animation",
            "custom easing",
            "framework agnostic",
            "gsap",
            "animejs",
        ],
    });

    app.renderer.hooks.on("head.begin", (ctx) => {
        const keywords = ctx.options.getValue("keywords") as string[];
        const id = ctx.options.getValue("umami-id") as string;
        const src = ctx.options.getValue("umami-src") as string;

        return (
            <>
                <meta name="keyword" content={keywords.join(", ")} />
                <meta name="color-scheme" content="dark light" />
                <link rel="shortcut icon" href="/media/favicon.ico" />
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/media/assets/favicon.svg"
                />

                <meta name="web-author" content="Okiki Ojo" />
                <meta name="robots" content="index, follow" />

                <meta
                    name="twitter:url"
                    content="https://spring-easing.okikio.dev/"
                />
                <meta name="twitter:site" content="@okikio_dev" />
                <meta name="twitter:creator" content="@okikio_dev" />

                <link href="https://twitter.com/okikio_dev" rel="me" />
                <link
                    rel="webmention"
                    href="https://webmention.io/spring-easing.okikio.dev/webmention"
                />
                <link
                    rel="pingback"
                    href="https://webmention.io/spring-easing.okikio.dev/xmlrpc"
                />
                <link
                    rel="pingback"
                    href="https://webmention.io/webmention?forward=https://spring-easing.okikio.dev/endpoint"
                />

                {ctx.options.isSet("umami-id") && (
                    <script
                        async
                        defer
                        type="module"
                        data-host-url="https://bundlejs.com"
                        data-domains="spring-easing.okikio.dev,okikio.dev"
                        data-website-id={id}
                        src={src}
                    ></script>
                )}
            </>
        );
    });
}
