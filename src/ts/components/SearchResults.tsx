import {
    createState,
    createResource,
    createEffect,
    createSignal,
    Suspense,
} from "solid-js";
import { render, For, Switch, Match } from "solid-js/web";
import { importShim } from "../util/dynamic-import";

export const [state, setState] = createState({
    objects: [],
    index: 0,
});

export const build = () => {
    const Card = ({
        name = "@okikio/native",
        description = "Lorem Ipsium...",
        date = "2021-01-23T07:29:32.575Z",
        author = "okikio",
        version,
    }) => {
        let _date = new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        let _authorHref = `https://www.skypack.dev/search?q=maintainer:${author}`;
        let _package = `${name}${version ? "@" + version : ""}`;
        let _packageHref = `https://www.skypack.dev/view/${_package}`;

        const [getSize, setSize] = createSignal();
        // createEffect(() => {
        //     (async () => {
        //         let { default: size } = await importShim("./esbuild.js");
        //         let result = new Promise<void>(async (resolve) => {
        //             await size(name);
        //             resolve();
        //         });

        //         setState("promises", state.objects[state.index].name, result);
        //         setState("index", state.index + 1);

        //         console.log(state.index);
        //         if (state.objects?.[state.index]?.name == name) {
        //             let sz = state.promises[name];
        //             setSize(sz);
        //         }
        //     })();
        // });

        return (
            <div class="card">
                <section class="content">
                    <h3 class="font-semibold text-lg">
                        <a href={_packageHref} target="_blank">
                            {name}
                        </a>
                    </h3>
                    <p>{description}</p>
                    <p class="updated-time">
                        Updated {_date} by{" "}
                        <a href={_authorHref} target="_blank">
                            @{author}
                        </a>
                        .
                    </p>
                </section>
                <section class="file-size">
                    <div class="self-center uppercase">
                        <div class="loading"></div>
                        {/* <Suspense fallback={<div class="loading"></div>}>
                            <h4 class="font-bold text-lg">{getSize() as string}</h4>
                            <Switch fallback={"Error"}>
                                <Match when={getSize()}>
                                    <h4 class="font-bold text-lg">{getSize()}</h4>
                                </Match>
                            </Switch>
                        </Suspense> */}
                        <p>Minified + Gzipped</p>
                    </div>
                </section>
            </div>
        );
    };

    const SearchResults = () => {
        return (
            <>
                <For each={state.objects}>
                    {({ name, description, version, author, date }) => {
                        return (
                            <Card
                                name={name}
                                description={description}
                                author={author}
                                date={date}
                                version={version}
                            ></Card>
                        );
                    }}
                </For>
            </>
        );
    };

    render(() => <SearchResults />, document.querySelector(".search-results"));
};
