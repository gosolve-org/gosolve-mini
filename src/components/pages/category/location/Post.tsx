import { useState, useMemo, Fragment, useCallback, useRef, useEffect } from "react";
import { useCollection, useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc, query, collection, where, orderBy } from "firebase/firestore";

import { useAuth } from "context/AuthContext";
import { db, useDocumentOnceWithDependencies } from "utils/firebase";
import { Layout, Comment } from "components/common";
import { addComment } from "pages/api/comment";
import { withBreaks } from "utils/textUtils";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import calendar from "dayjs/plugin/calendar";
import BasicHead from "components/common/Layout/BasicHead";
import ReplyForm from "components/common/ReplyForm";
dayjs.extend(localizedFormat);
dayjs.extend(calendar);

interface PostProps {
	postId: string;
}

function Post({ postId } : PostProps) {
	const { user } = useAuth();
	const [postComment, setPostComment] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [replyParentCommentId, setReplyParentCommentId] = useState(null);
	const [replyClickCounter, setReplyClickCounter] = useState(0);
	const [discussionCount, setDiscussionCount] = useState(0);

	const [postData, postLoading] = useDocumentOnce(doc(db, "posts", postId));

	const [userProfile] = useDocumentOnceWithDependencies(() => doc(db, `user`, user.uid), [ user?.uid ]);

	const postDoc = postData?.data();

	const [commentsCollection, commentsLoading] = useCollection(
		query(
			collection(db, "comments"),
			where("postId", "==", postId),
			orderBy("createdAt", "desc")
		)
	);

	const handleCommentSubmit = async (comment: string, parentId: string = null) => {
		await addComment({
			details: {
				authorId: user.uid,
				authorUsername: userProfile?.data()?.username,
				content: comment,
				postId,
				parentId,
			},
		});
	};

	const handleReplyButtonClick = useCallback((id: string) => {
		setReplyParentCommentId(id);
		setReplyClickCounter(replyClickCounter + 1);
	}, [ replyClickCounter, setReplyClickCounter, setReplyParentCommentId ]);

	const renderComments = useMemo(() => {
		const parentComments = commentsCollection?.docs?.filter(
			(item) => !item?.data()?.parentId
		);

		setDiscussionCount(parentComments?.length || 0);

		return (
			<>
				{parentComments?.map((parentComment, index) => {
					if (parentComment) {
						const parentCommentData = parentComment.data();

						return (
							<Fragment key={parentComment.id}>
								<Comment
									id={parentComment.id}
									authorUsername={
										parentCommentData?.authorUsername
									}
									createdAt={parentCommentData?.createdAt}
									content={parentCommentData?.content}
									handleReplyButtonClick={
										handleReplyButtonClick
									}
								/>

								{commentsCollection
									?.docs
									?.filter(el => el?.data()?.parentId === parentComment.id)
									.sort((a, b) => a.data().createdAt - b.data().createdAt)
									.map((childComment) => {
										const childCommentData =
											childComment.data();

										return (
											<Fragment key={childComment.id}>
												<Comment
													isChild
													id={childComment.id}
													authorUsername={
														childCommentData?.authorUsername
													}
													createdAt={
														childCommentData?.createdAt
													}
													content={
														childCommentData?.content
													}
													handleReplyButtonClick={
														handleReplyButtonClick
													}
												/>
											</Fragment>
										);
									}
								)}
								<Fragment key={`reply-${parentComment.id}`}>
									<ReplyFormContainer
										hidden={replyParentCommentId !== parentComment.id}
										replyClickCounter={replyClickCounter}
										handleSubmit={(reply) => handleCommentSubmit(reply, parentComment.id)}
									/>
								</Fragment>
								{parentComments?.length - 1 !== index ? (
									<div className="w-full border-t border-gray-300 mt-6" />
								) : null}
							</Fragment>
						);
					} else return null;
				})}
			</>
		);
	}, [commentsCollection, replyParentCommentId, replyClickCounter]);

	return (
		<Layout>
			<BasicHead title={`goSolve | ${postDoc?.title ?? ''}`} />
			<div className="flex min-h-full flex-col justify-center items-center pb-20 pt-4 px-4 sm:px-6 lg:px-8">
				{!postLoading ? (
					<div className="w-full max-w-4xl">
						<div className="bg-white px-4 py-5 sm:px-6 rounded-lg shadow mb w-full">
							<h4 className="text-2xl mb-4">{postDoc?.title}</h4>
							<div className="flex space-x-3 justify-center items-center  mb-4">
								<div className="flex-shrink-0">
									<span className=" inline-block h-7 w-7 overflow-hidden rounded-full bg-gray-100">
										<svg
											className="h-full w-full text-gray-300"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
										</svg>
									</span>
								</div>
								<div className="min-w-0 flex-1">
									<span className="text-sm font-medium text-gray-900">
										{postDoc?.authorUsername || "Anonymous"}
									</span>
									<span className="text-sm text-gray-500 ml-4">
										{dayjs(postDoc?.createdAt).calendar(null, {
											sameElse: 'lll',
										})}
									</span>
								</div>
							</div>
							<p className="text-sm text-gray-500 mb-1">
								{withBreaks(postDoc?.content)}
							</p>
						</div>
					</div>
				) : null}

				<div className="flex flex-col w-full max-w-2xl mt-20">
					<h4 className="text-xl">{`Discussion (${discussionCount})`}</h4>
					<ReplyForm 
						handleSubmit={handleCommentSubmit}
						buttonText="Post comment"
						placeholderText="Add your comment"
					/>

					<div className="flex w-full max-w-2xl mt-10">
						<div className="w-full">
							{!commentsLoading ? renderComments : null}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

interface ReplyFormContainer {
	hidden: boolean;
	replyClickCounter: number;
	handleSubmit: (reply: string) => Promise<void>;
}

function ReplyFormContainer({
	hidden,
	replyClickCounter,
	handleSubmit,
}: ReplyFormContainer) {
	const replyForm = useRef(null);
	const textareaRef = useRef(null);

	useEffect(() => {
		if (!hidden) {
			replyForm.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			textareaRef.current.focus({ preventScroll: true });
		}
	}, [ replyClickCounter ]);

	return (
		<div
			className={`mt-6 w-full ${hidden ? 'hidden' : 'flex'}`}
		>
			<div className="flex-shrink-0 w-12"></div>
			<div className="flex flex-col w-full" ref={replyForm}>
				<ReplyForm
					handleSubmit={handleSubmit}
					buttonText="Reply"
					placeholderText="Add your reply"
					showSuccessToast={false}
					textareaRef={textareaRef}
				/>
			</div>
		</div>
	);
}

export default Post;
