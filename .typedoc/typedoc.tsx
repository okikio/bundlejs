import { Application, ParameterType, JSX } from "typedoc";

export function load(app: Application) {
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
            </>
        );
    });
}
