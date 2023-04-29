import { useResource } from "contexts/ResourceContext";
import { useCallback } from "react";
import SideBarItem from "./SideBarItem";

const getTextClassName = (level) => {
    switch (level) {
        case 1:
            return "text-lg font-semibold";
        case 2:
            return "text-base";
        case 3:
        case 4:
        case 5:
        case 6:
        default:
            return "text-sm font-light";
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
            if (block.type === 'header') {
                titles.push({
                    index,
                    value: block.data.text,
                    level: block.data.level,
                });
            }
        });
    }
    catch (_) { }

    const onLinkClick = useCallback((index) => {
        setFocusedEditorElementIndex(index);
    }, [ content, setFocusedEditorElementIndex ]);

    return (
        <SideBarItem>
            <div className="w-full flex">
                <div className="grow">
                    {titles.map(title =>
                        <span
                            onClick={() => onLinkClick(title.index)}
                            className={`${getTextClassName(title.level)} text-right text-gray-400 hover:text-gray-500 cursor-pointer block mb-3`}
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
