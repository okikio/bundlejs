import { createSignal } from "solid-js";
import { For, render } from "solid-js/web";
import { EventEmitter } from "@okikio/emitter";
import { timeline } from "@okikio/animate";

export const ResultEvents = new EventEmitter();
export const [getState, setState] = createSignal([]);
export const [isInitial, setIsInitial] = createSignal(true);

export const Card = ({
    type = "",
    name = "@okikio/native",
    description = "Lorem Ipsium...",
    date = "2021-01-23T07:29:32.575Z",
    author = "okikio",
    version = ""
}) => {
    let _date = type ? "" : new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    let _authorHref = `https://www.skypack.dev/search?q=maintainer:${author}`;
    let _package = `${name}${version ? "@" + version : ""}`;
    let _packageHref = `https://www.skypack.dev/view/${_package}`;

    let btnTextEl: HTMLElement;
    let btnEl: HTMLButtonElement;
    return (
        <div class="card">
            <section class={`content ${type ? "special" : ""}`}>
                <h3 class={`font-semibold text-lg`}>
                {
                    type ? 
                        (<div class="text-center">{type}</div>) : 
                        (<a href={_packageHref} target="_blank">{type || name}</a>)
                }
                </h3>
                <p class={type ? "text-center" : ""}>{description}</p>
                <p class="updated-time">
                    {type || (_date == undefined && author == undefined) ? "" : `Updated ${_date} `}
                    {author && !type ? (<>
                        by
                        <a href={_authorHref} target="_blank">
                            @{author}
                        </a>
                        .
                    </>) : ""}
                </p>
            </section>
            {type ? "" :
                (<section class="add">
                    <button ref={btnEl}
                        class="btn"
                        onclick={() => {
                            let text = btnTextEl.innerText;

                            timeline()
                                .add({
                                    target: btnTextEl,
                                    opacity: [1, 0],
                                    duration: 400,
                                    fillMode: "forwards",
                                    onfinish() {
                                        btnTextEl.innerText = "Added!";
                                        ResultEvents.emit(
                                            "add-module",
                                            `export * from "${_package}";`
                                        );
                                    }
                                })
                                .add({
                                    target: btnTextEl,
                                    opacity: [0, 1],
                                    duration: 400,
                                    fillMode: "forwards",
                                    onfinish() {
                                        // btnEl.blur();
                                    }
                                })
                                .add({
                                    target: btnTextEl,
                                    opacity: [1, 0],
                                    duration: 400,
                                    fillMode: "forwards",
                                    onfinish() {
                                        btnTextEl.innerText = text;
                                    }
                                })
                                .add({
                                    target: btnTextEl,
                                    opacity: [0, 1],
                                    duration: 400,
                                    fillMode: "forwards",
                                    onfinish() {
                                        ResultEvents.emit("complete");
                                    }
                                });

                        }}
                    >
                        <span class="btn-text" ref={btnTextEl}>
                            Add Module
                        </span>
                    </button>
                </section>
                )
            }
        </div>
    );
};

export const SearchResults = () => {
    return (
        <div class={`search-results`}>
            {getState().length == 0 ? (
                <Card 
                    type="No results..."
                    description=""
                ></Card>
            ) : ""}
            <For each={getState()}>
                {({ name, description, version, author, date, type }) => {
                    return (
                        <Card
                            type={type ?? ""}
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
};
