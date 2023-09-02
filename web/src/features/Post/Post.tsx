import { useState, useMemo, Fragment, useCallback, useRef, useEffect } from 'react';
import { useCollection, useDocumentOnce } from 'react-firebase-hooks/firestore';
import { doc, query, collection, where, orderBy } from 'firebase/firestore';

import { useAuth } from 'features/Auth/AuthContext';
import { db, useDocumentOnceWithDependencies } from 'utils/firebase';
import { addComment } from 'pages/api/comment';
import { withBreaks } from 'utils/textUtils';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import calendar from 'dayjs/plugin/calendar';
import ReplyForm from 'features/Post/ReplyForm';
import Comment from 'features/Post/Comment';
import { useAnalytics } from 'features/Analytics/AnalyticsContext';
import { AnalyticsEventEnum } from 'features/Analytics/AnalyticsEventEnum';
import ProfileIconSvg from 'common/components/svgs/ProfileIconSvg';

dayjs.extend(localizedFormat);
dayjs.extend(calendar);

interface PostProps {
    postId: string;
}

interface ReplyFormContainer {
    hidden: boolean;
    replyClickCounter: number;
    handleSubmit: (reply: string) => Promise<void>;
}

const ReplyFormContainer = ({ hidden, replyClickCounter, handleSubmit }: ReplyFormContainer) => {
    const replyForm = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!hidden && replyForm.current && textareaRef.current) {
            replyForm.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            textareaRef.current.focus({ preventScroll: true });
        }
    }, [replyClickCounter, hidden]);

    return (
        <div className={`mt-6 w-full ${hidden ? 'hidden' : 'flex'}`}>
            <div className="flex-shrink-0 w-6 sm:w-12" />
            <div className="flex flex-col w-full" ref={replyForm}>
                <ReplyForm
                    handleSubmit={handleSubmit}
                    buttonText="Reply"
                    placeholderText="Add your reply"
                    textareaRef={textareaRef}
                />
            </div>
        </div>
    );
};

const Post = ({ postId }: PostProps) => {
    const { user, isAuthenticated } = useAuth();
    const { logAnalyticsEvent } = useAnalytics();
    const [replyParentCommentId, setReplyParentCommentId] = useState<string | null>(null);
    const [replyClickCounter, setReplyClickCounter] = useState(0);
    const [discussionCount, setDiscussionCount] = useState(0);

    const [postData, postLoading] = useDocumentOnce(doc(db, 'posts', postId));
    const postDoc = postData?.data();

    const [userProfile] = useDocumentOnceWithDependencies(
        () => doc(db, `user`, user!.uid),
        [user?.uid],
    );

    const [commentsCollection, commentsLoading] = useCollection(
        query(
            collection(db, 'comments'),
            where('postId', '==', postId),
            orderBy('createdAt', 'desc'),
        ),
    );

    const handleCommentSubmit = useCallback(
        async (comment: string, parentId: string | null = null) => {
            if (!isAuthenticated() || user == null) return;

            await addComment({
                details: {
                    id: '',
                    authorId: user.uid,
                    authorUsername: userProfile?.data()?.username,
                    content: comment,
                    postId,
                    parentId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            logAnalyticsEvent(AnalyticsEventEnum.CommentCreate, { postId });
        },
        [user, userProfile, postId, logAnalyticsEvent],
    );

    const handleReplyButtonClick = useCallback(
        (id: string) => {
            setReplyParentCommentId(id);
            setReplyClickCounter(replyClickCounter + 1);
        },
        [replyClickCounter, setReplyClickCounter, setReplyParentCommentId],
    );

    const renderedComments = useMemo(() => {
        const parentComments = commentsCollection?.docs?.filter((item) => !item?.data()?.parentId);

        setDiscussionCount(parentComments?.length || 0);

        return parentComments
            ?.filter((el) => el)
            .map((parentComment, index) => {
                const parentCommentData = parentComment.data();

                return (
                    <Fragment key={parentComment.id}>
                        <Comment
                            id={parentComment.id}
                            authorUsername={parentCommentData?.authorUsername}
                            createdAt={parentCommentData?.createdAt}
                            content={parentCommentData?.content}
                            handleReplyButtonClick={handleReplyButtonClick}
                        />

                        {commentsCollection?.docs
                            ?.filter((el) => el?.data() && el?.data().parentId === parentComment.id)
                            .sort((a, b) => a.data().createdAt - b.data().createdAt)
                            .map((childComment) => {
                                const childCommentData = childComment.data();

                                return (
                                    <Fragment key={childComment.id}>
                                        <Comment
                                            isChild
                                            id={childComment.id}
                                            authorUsername={childCommentData?.authorUsername}
                                            createdAt={childCommentData?.createdAt}
                                            content={childCommentData?.content}
                                            handleReplyButtonClick={handleReplyButtonClick}
                                        />
                                    </Fragment>
                                );
                            })}
                        <Fragment key={`reply-${parentComment.id}`}>
                            <ReplyFormContainer
                                hidden={replyParentCommentId !== parentComment.id}
                                replyClickCounter={replyClickCounter}
                                handleSubmit={async (reply) =>
                                    handleCommentSubmit(reply, parentComment.id)
                                }
                            />
                        </Fragment>
                        {parentComments != null && parentComments.length - 1 !== index && (
                            <div className="w-full border-t border-gray-300 mt-6" />
                        )}
                    </Fragment>
                );
            });
    }, [
        commentsCollection,
        replyParentCommentId,
        replyClickCounter,
        handleCommentSubmit,
        handleReplyButtonClick,
    ]);

    return (
        <div className="flex min-h-full flex-col justify-center items-center pb-20 pt-4 px-4 sm:px-6 lg:px-8">
            {!postLoading && (
                <div className="w-full max-w-4xl">
                    <div className="bg-white px-4 py-5 sm:px-6 rounded-lg shadow mb w-full">
                        <h4 className="text-2xl mb-4">{postDoc?.title}</h4>
                        <div className="flex space-x-3 justify-center items-center  mb-4">
                            <div className="flex-shrink-0">
                                <span className=" inline-block h-7 w-7 overflow-hidden rounded-full bg-gray-100">
                                    <ProfileIconSvg className="h-full w-full text-gray-300" />
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-sm font-medium text-gray-900">
                                    {postDoc?.authorUsername || 'Anonymous'}
                                </span>
                                <span className="text-sm text-gray-500 ml-4">
                                    {dayjs(postDoc?.createdAt).calendar(null, {
                                        sameElse: 'lll',
                                    })}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{withBreaks(postDoc?.content)}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col w-full max-w-2xl mt-20">
                <h4 className="text-xl">{`Discussion (${discussionCount})`}</h4>

                {isAuthenticated() && (
                    <>
                        <ReplyForm
                            handleSubmit={handleCommentSubmit}
                            buttonText="Post comment"
                            placeholderText="Add your comment"
                        />
                        <div className="mt-8" />
                    </>
                )}

                <div className="flex w-full max-w-2xl mt-2">
                    <div className="w-full">{!commentsLoading && renderedComments}</div>
                </div>
            </div>
        </div>
    );
};

export default Post;
