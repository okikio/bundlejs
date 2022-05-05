import { createSignal, useTransition } from "solid-js";
import { For, render } from "solid-js/web";

import { EventEmitter } from "@okikio/emitter";
import { timeline, animate } from "@okikio/animate";

export const ResultEvents = new EventEmitter();
export const [getState, setState] = createSignal([]);
export const [isInitial, setIsInitial] = createSignal(true);

export const [pending, start] = useTransition();
export const updateState = (state: any[]) => () => start(() => setState(state));

export const ErrorCard = ({
    name = "@okikio/native",
    description = "Lorem Ipsium..."
}) => {
    return (
        <div class="card">
            <section class="content error">
                <h2 class="font-semibold text-lg">
                    <div class="text-center">{name}</div>
                </h2>
                <p class="text-center">{description}</p>
            </section>
        </div>
    );
};

export const toLocaleDateString = (date: string | number | Date) => new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
export const Card = ({
    name = "@okikio/native",
    description = "Lorem Ipsium...",
    date = "2021-01-23T07:29:32.575Z",
    author = "okikio",
    version = ""
}) => {
    let _date = toLocaleDateString(date);
    let _authorHref = `https://www.skypack.dev/search?q=maintainer:${author}`;
    let _package = `${name}${version ? "@" + version : ""}`;
    let _packageHref = `https://www.skypack.dev/view/${_package}`;

    let btnTextEl: HTMLElement;
    let btnEl: HTMLButtonElement;

    // When user clicks the "Add Module button" give the user some feedback
    let onclick = () => {
        let text = btnTextEl.innerText;
        let opts = {
            target: btnTextEl,
            duration: 400,
            fillMode: "forwards"
        };

        timeline()
            .add({
                ...opts,
                opacity: [1, 0],
                onfinish() {
                    btnTextEl.innerText = "Added!";
                    ResultEvents.emit("add-module", `export * from "${_package}";`);
                }
            })
            .add({
                ...opts,
                opacity: [0, 1],
            })
            .add({
                ...opts,
                opacity: [1, 0],
                onfinish: () => { btnTextEl.innerText = text; }
            })
            .add({
                ...opts,
                opacity: [0, 1],
                onfinish: () => { ResultEvents.emit("complete"); }
            });
    };

    return (
        <div class="card">
            <section class="content">
                <h2 class="font-semibold text-lg">
                    <a href={_packageHref} target="_blank">{name}</a>
                </h2>
                <p>{description}</p>
                <p class="updated-time">
                    {_date && `Updated ${_date} `}
                    {author && (<>
                        by <a href={_authorHref} target="_blank">@{author}</a>.
                    </>)}
                </p>
            </section>
            <section class="add">
                <button ref={btnEl} class="btn" onclick={onclick}>
                    <span class="btn-text" ref={btnTextEl}>Add Module</span>
                </button>
            </section>
        </div>
    );
};

export const SearchResults = () => {
    return (
        <div class={`search-results`}>
            {getState().length == 0 && (
                <ErrorCard 
                    name="No results..."
                    description=""
                ></ErrorCard>
            )}
            <For each={getState()}>
                {({ name, description, version, author, date, type }) => {
                    return (type == "error" ? 
                        <ErrorCard 
                            name={name}
                            description={description}
                        ></ErrorCard> :
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
};
