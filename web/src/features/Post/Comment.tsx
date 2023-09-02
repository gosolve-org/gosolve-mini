import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { withBreaks } from 'utils/textUtils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from 'features/Auth/AuthContext';
import ProfileIconSvg from 'common/components/svgs/ProfileIconSvg';

dayjs.extend(relativeTime);

interface CommentProps {
    id: string;
    authorUsername?: string;
    createdAt: Date;
    content?: string | null;
    handleReplyButtonClick?: (id: string) => void;
    isChild?: boolean;
}

const Comment = ({
    id,
    authorUsername,
    createdAt,
    content = null,
    isChild = false,
    handleReplyButtonClick,
}: CommentProps) => {
    const { isAuthenticated } = useAuth();
    const [isContentClamped, setIsContentClamped] = useState(false);
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const [isStartState, setIsStartState] = useState(true);
    const contentEl = useRef<HTMLParagraphElement>(null);
    const containerEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsContentClamped(
            contentEl.current != null &&
                contentEl.current.scrollHeight > contentEl.current.clientHeight,
        );
    }, [contentEl]);

    useEffect(() => {
        if (!isContentExpanded && !isStartState && containerEl.current != null) {
            containerEl.current.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        }
    }, [isContentExpanded, isStartState]);

    const handleClickReadMore = () => {
        setIsContentExpanded(true);
        setIsStartState(false);
    };

    return (
        <div className="mt-6 flex w-full" key={id} ref={containerEl}>
            {isChild ? <div className="flex-shrink-0 w-6 sm:w-12" /> : null}

            <div className="flex flex-col w-full">
                <div>
                    <div className="flex space-x-3 justify-center items-center  mb-4">
                        <div className="flex-shrink-0 flex justify-center">
                            <span className=" inline-block h-7 w-7 overflow-hidden rounded-full bg-gray-100">
                                <ProfileIconSvg className="h-full w-full text-gray-300" />
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium text-gray-900">
                                {authorUsername || 'Anonymous'}
                            </span>
                            <span className="text-sm text-gray-600 ml-4">
                                {dayjs(createdAt).fromNow()}
                            </span>
                        </div>
                    </div>

                    <p
                        className={`mt-1 text-gray-500 ${!isContentExpanded && 'line-clamp-3'}`}
                        ref={contentEl}
                    >
                        {withBreaks(content)}
                    </p>
                    {isContentClamped && !isContentExpanded && (
                        <button
                            type="button"
                            className="cursor-pointer text-sm mt-2 text-indigo-700"
                            onClick={handleClickReadMore}
                        >
                            Read More
                        </button>
                    )}
                    {isContentExpanded && (
                        <button
                            type="button"
                            className="cursor-pointer text-sm mt-2 text-indigo-700"
                            onClick={() => setIsContentExpanded(false)}
                        >
                            Read Less
                        </button>
                    )}
                </div>

                {isAuthenticated() && handleReplyButtonClick && !isChild ? (
                    <button
                        onClick={() => handleReplyButtonClick(id)}
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent mt-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-700"
                    >
                        <ChatBubbleOvalLeftEllipsisIcon
                            className="h-4 w-4 inline-block items-center mr-2"
                            aria-hidden="true"
                        />
                        Reply
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default Comment;
