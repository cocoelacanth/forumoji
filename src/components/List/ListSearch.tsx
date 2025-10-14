import React from "react";

import "css/components/ListSearch.css";

interface ListSearchProps {
    onQueryRun: (query: string, unicodeRepr: string) => void;
}

export default function ListSearch(props: ListSearchProps) {
    function runQuery(e) {
        const query = String(e.target.value);
        const unicodeRepr = Array.from(query)
            .map(s => s.codePointAt(0))
            .map(c => c.toString(16))
            .map(n => (n.length > 3 ? "" : "0".repeat(4 - n.length)) + n)
            .join("-");
        props.onQueryRun(query.toLowerCase(), unicodeRepr);
    }

    return (
        <div id="search" role="search">
            {/* <SearchBar handleSearch={props.handleSearch} /> */}
            <input
                type="search"
                placeholder="Search"
                defaultValue=""
                onChange={runQuery}
            ></input>
        </div>
    );
}
