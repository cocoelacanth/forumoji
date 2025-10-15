import React from "react";

import "css/components/ListSearch.css";

interface ListSearchProps {
    searchSelected: boolean;
    onSearch: (query: string) => void;
}

export default function ListSearch(props: ListSearchProps) {
    function search(e) {
        const query = String(e.target.value).toLowerCase();
        props.onSearch(query);
    }

    return (
        <div id="search" role="search" data-active={props.searchSelected}>
            <input
                type="search"
                placeholder="Search"
                defaultValue=""
                onChange={search}
            ></input>
        </div>
    );
}
