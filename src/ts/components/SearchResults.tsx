import { createSignal } from "solid-js";
import { For, render } from "solid-js/web";
import { EventEmitter } from "@okikio/emitter";
import { animate } from "@okikio/animate";

export const Emitter = new EventEmitter();
export const [getState, setState] = createSignal([]);

export const Card = ({
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

    let btnTextEl: HTMLElement;
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
            <section class="add">
                <button class="btn"
                    onmousedown={() => {
                        let text = btnTextEl.innerText;
                        (async () => {
                            await animate({
                                target: btnTextEl,
                                opacity: [1, 0],
                                duration: 300
                            })

                            Emitter.emit("add-module", `export * from "${name}";`);
                            btnTextEl.innerText = "Added!";

                            await animate({
                                target: btnTextEl,
                                opacity: [0, 1],
                                duration: 300
                            });

                            await animate({
                                target: btnTextEl,
                                opacity: [1, 0],
                                duration: 300
                            });

                            btnTextEl.innerText = text;

                            await animate({
                                target: btnTextEl,
                                opacity: [0, 1],
                                duration: 300
                            });
                        })();
                    }}>
                    <span class="btn-text" ref={btnTextEl}>Add Module</span>
                </button>
            </section>
        </div>
    );
};

export const SearchResults = () => {
    return (
        <div class={`search-results` + (getState().length ? "" : "empty")}>
            <For each={getState()}>
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
        </div>
    );
};

export const renderComponent = (parentEl: Element) => {
   return render(() => <SearchResults />, parentEl);
}