
import { createState, createResource } from "solid-js";
import { render, For, Suspense, Switch, Match } from "solid-js/web";
import { importShim } from "../util/dynamic-import";

export const [state, setState] = createState({ objects: [] });
export const [_importShim] = createResource(() => "", async () => {
    return Promise.resolve(await importShim("./esbuild.js"));
});

export const Card = ({
    name = "@okikio/native",
    description = "Lorem Ipsium...",
    date = "2021-01-23T07:29:32.575Z",
    author = "okikio",
    size
}) => {
    let _date = new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    let _authorHref = `https://www.skypack.dev/search?q=maintainer:${author}`;
    let _packageHref = `https://www.skypack.dev/${name}`;

    return (
        <div class="card">
            <section class="content">
                <h3 class="font-semibold text-lg">
                    <a href={_packageHref}>{name}</a>
                </h3>
                <p>{description}</p>
                <p class="updated-time">
                    Updated {_date} by <a target="_blank" href={_authorHref}>@{author}</a>.
                </p>
            </section>
            <section class="file-size">
                <div class="self-center uppercase">
                    <Switch fallback={"Error"}>
                        <Match when={size.loading}>
                            <div class="loading"></div>
                        </Match>
                        <Match when={size()}>
                            <h4 class="font-bold text-lg">{size()}</h4>
                        </Match>
                    </Switch>
                    <p>Minified + Gzipped</p>
                </div>
            </section>
        </div>
    );
};

export const SearchResults = () => {
    return (
        <>
            <For each={state.objects} fallback={<div>No Users</div>}>
                {({ name, description, version, author, date }) => {
                    let _package = `${name}${version ? "@" + version : ""}`;
                    let [_size] = createResource(() => _package, (query) => {
                        let { default: size } = _importShim();
                        return size(query);
                    });

                    return (
                        <Card
                            name={_package}
                            description={description}
                            author={author}
                            date={date}
                            size={_size}></Card>
                    );
                }}
            </For>
        </>
    );
};

export const build = () => {
    render(() => <SearchResults />, document.querySelector(".search-results"));
};
