
import { render } from "solid-js/web";
export type Props = {
    name?: string;
    description?: string;
    date?: string;
    author?: string;
};

export const Card = ({
    name = "@okikio/native",
    description = "Lorem Ipsium...",
    date = "2021-01-23T07:29:32.575Z",
    author = "okikio"
}: Props) => {
    return (
        <div class="card">
            <section class="content">
                <h3 class="font-semibold text-lg"> <a href="./">{name}</a></h3>
                <p>{description}</p>
                <p class="updated-time">
                    Updated {new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} by
                    <a target="_blank" href={`https://www.skypack.dev/search?q=maintainer:${author}`}>@{author}</a>.
                </p>
            </section>
            <section class="file-size">
                <div class="self-center uppercase">
                    <h4 class="font-bold text-lg">7 KB</h4>
                    <p>Minified + Gzipped</p>
                </div>
            </section>
        </div>
    );
};

export const SearchResults = () => { 
    return (
        <> 
            <Card></Card>
        </>
    );
};

export const build = () => {
    render(() => <SearchResults />, document.querySelector(".search-results"));
};
