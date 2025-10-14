import React from "react";

import ListCategory from "./ListCategory";
import ListFilter from "./ListFilter";
import { EmojiData, getEmojiList } from "src/EmojiList";

import ListSearch from "./ListSearch";

import "css/components/List.css";

interface ListProps {
    onEmojiChange: (emoji: EmojiData) => void;
}

export type RefList = {
    [category: string]: React.RefObject<HTMLHeadingElement>;
}

export default function List(props: ListProps) {
    const [selectedEmoji, setSelectedEmoji] = React.useState<EmojiData | undefined>(undefined);
    const [searchSelected, setSearchSelected] = React.useState<boolean>(false);
    const [list, setList] = React.useState<Record<string, EmojiData[]>>({});

    React.useEffect(() => {
        getEmojiList().then(setList);
    }, []);

    function onEmojiChange(toEmoji: EmojiData) {
        setSelectedEmoji(toEmoji);
        props.onEmojiChange(toEmoji);
    }

    const categoryBarRef = React.createRef<HTMLDivElement>();
    const categoryRefs: RefList = {};

    function onCategoryChange(filter: string) {
        if(filter === "Search") {
            return;
        }
        setSearchSelected(false);
        const offset = categoryBarRef.current!.getBoundingClientRect().height;
        const y = categoryRefs[filter].current!.getBoundingClientRect().bottom + window.scrollY - offset;

        window.scrollTo({top: y, behavior: "smooth"});
    }

    function onQueryRun(query: string, unicodeRepr: string) {
        const listItems = document.querySelectorAll("button.list-item");
        for (let i = 0; i < listItems.length; i++) {
            const item = listItems[i] as HTMLElement;
            item.removeAttribute("hidden");
            let notFound = unicodeRepr !== item.id;
            notFound = notFound ? !item.dataset.name.toLowerCase().includes(query) : notFound;
            for (const j of item.dataset.keywords.split(" ")) {
                if (!notFound) break;
                if (j.toLowerCase().replace(/_/g, " ").includes(query)) {
                    notFound = false;
                }
            }
            if (notFound) {
                item.setAttribute("hidden", "");
            }
        }
    }

    return (
        <div id="list">
            <ListFilter
                onCategoryChange={onCategoryChange}
                barRef={categoryBarRef}
                categoryRefs={categoryRefs}
                searchSelected={searchSelected}
                setSearchSelected={setSearchSelected}
            />
            <div id="list-items" aria-label="Emoji list" role="group">
                {
                    Object.entries(list).map(([category, emojis]) => {
                        if(category === "Component") return null;
                        categoryRefs[category] = React.createRef<HTMLHeadingElement>();
                        return (
                            <ListCategory
                                key={category}
                                category={category}
                                emojis={emojis}
                                onEmojiChange={onEmojiChange}
                                headingRef={categoryRefs[category]}
                                selectedEmoji={selectedEmoji}
                            />
                        );
                    })
                }
            </div>
            <ListSearch onQueryRun={onQueryRun} />
        </div>
    );
}
