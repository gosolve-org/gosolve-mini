import { useResource } from 'features/Resource/ResourceContext';
import { useCallback } from 'react';
import SidebarItem from './SidebarItem';

const HEADER_LEVELS_TO_SHOW = [1, 2, 3];

const getTitleClassName = (level, isFirstInSection) => {
    switch (level) {
        case 1:
            return `text-lg font-semibold mb-1 ${!isFirstInSection && 'mt-4'}`;
        case 2:
            return `text-base mb-1 ${!isFirstInSection && 'mt-3'}`;
        case 3:
        default:
            return 'text-sm font-light mb-0.5';
    }
};

interface Title {
    index: number;
    id: string;
    value: string;
    level: number;
}

const SidebarTableOfContents = () => {
    const { content, setFocusedEditorElementIndex } = useResource();

    const onLinkClick = useCallback(
        (index) => {
            setFocusedEditorElementIndex(index);
        },
        [setFocusedEditorElementIndex],
    );

    if (!content) return null;

    const titles: Title[] = [];
    try {
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
    } catch (_) {}

    return (
        <SidebarItem>
            <div className="w-full flex">
                <div className="grow">
                    {titles.map((title, i) => (
                        <button
                            type="button"
                            key={title.id}
                            onClick={() => onLinkClick(title.index)}
                            aria-label={title.value}
                            className={`${getTitleClassName(
                                title.level,
                                i === 0 || titles[i - 1].level < title.level,
                            )} ml-auto text-gray-400 hover:text-gray-500 cursor-pointer block`}
                            // The content is already sanitized
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: title.value }}
                        />
                    ))}
                </div>
                <div
                    className="ml-5 bg-gray-200"
                    style={{
                        width: '0.5px',
                        height: '110px',
                    }}
                />
            </div>
        </SidebarItem>
    );
};

export default SidebarTableOfContents;
