import { useResource } from "contexts/ResourceContext";
import { useCallback } from "react";
import SideBarItem from "./SideBarItem";

const HEADER_LEVELS_TO_SHOW = [1, 2, 3];

const getTitleClassName = (level, isFirstInSection) => {
    switch (level) {
        case 1:
            return `text-lg font-semibold mb-1 ${!isFirstInSection && 'mt-4'}`;
        case 2:
            return `text-base mb-1 ${!isFirstInSection && 'mt-3'}`;
        case 3:
        default:
            return "text-sm font-light mb-0.5";
    }
}

function SideBarTableOfContents()
{
    const { content, setFocusedEditorElementIndex } = useResource();
    const titles = [];
    try
    {
        const data = JSON.parse(content);
        data.blocks.forEach((block, index) => {
            if (block.type === 'header' && HEADER_LEVELS_TO_SHOW.includes(block.data.level)) {
                titles.push({
                    index,
                    id: block.id,
                    value: block.data.text,
                    level: block.data.level,
                });
            }
        });
    }
    catch (_) { }

    const onLinkClick = useCallback((index) => {
        setFocusedEditorElementIndex(index);
    }, [ setFocusedEditorElementIndex ]);

    return (
        <SideBarItem>
            <div className="w-full flex">
                <div className="grow">
                    {titles.map((title, i) =>
                        <span
                            key={title.id}
                            onClick={() => onLinkClick(title.index)}
                            className={`${getTitleClassName(title.level, i === 0 || titles[i - 1].level < title.level)} text-right text-gray-400 hover:text-gray-500 cursor-pointer block`}
                        >{title.value}</span>
                    )}
                </div>
                <div className="ml-5 bg-gray-200" style={{
                    width: "0.5px",
                    height: "110px",
                }}></div>
            </div>
        </SideBarItem>
    );
}

export default SideBarTableOfContents;
