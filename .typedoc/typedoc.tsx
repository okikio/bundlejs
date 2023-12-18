/** @jsxFactory JSX.createElement */
/** @jsxFragmentFactory JSX.Fragment */
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
      "bundlejs",
      "polyfill",
      "ponyfill",
      "framework agnostic",
      "es2023",
      "web",
    ],
  });

  app.renderer.hooks.on("head.begin", (ctx) => {
    const keywords = ctx.options.getValue("keywords") as string[];
    const id = ctx.options.getValue("umami-id") as string;
    const src = ctx.options.getValue("umami-src") as string;

    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;700&amp;display=swap"
          rel="stylesheet"
        />

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

        <meta name="twitter:url" content="https://docs.bundlejs.com" />
        <meta name="twitter:site" content="@okikio_dev" />
        <meta name="twitter:creator" content="@okikio_dev" />

        <link href="https://twitter.com/okikio_dev" rel="me" />
        <link
          rel="webmention"
          href="https://webmention.io/docs.bundlejs.com/webmention"
        />
        <link
          rel="pingback"
          href="https://webmention.io/docs.bundlejs.com/xmlrpc"
        />
        <link
          rel="pingback"
          href="https://webmention.io/webmention?forward=https://docs.bundlejs.com/endpoint"
        />

        {ctx.options.isSet("umami-id") && (
          <script
            async
            defer
            type="module"
            data-host-url="https://bundlejs.com"
            data-domains="docs.bundlejs.com,okikio.dev"
            data-website-id={id}
            src={src}
          ></script>
        )}
      </>
    );
  });
}
