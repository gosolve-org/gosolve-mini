import { useState, SyntheticEvent, FormEvent, useMemo, Fragment } from "react";
import { useRouter } from "next/router";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { doc, query, collection, where, orderBy } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

import { useAuth } from "context/AuthContext";
import { db } from "utils/firebase";
import { Layout, Comment, AddCommentModal } from "components/common";
import { addComment } from "pages/api/comment";

function SinglePost() {
	const { user } = useAuth();
	const [postComment, setPostComment] = useState("");
	const [replyParentId, setReplyParentId] = useState("");
	const [discussionCount, setDiscussionCount] = useState(0);
	const [addCommentModalOpen, setAddCommentModalOpen] = useState(false);
	const router = useRouter();
	const postId = router?.query?.post ? router?.query?.post.toString() : "";

	const [postData, postLoading] = useDocument(doc(db, "posts", postId), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const [userProfile] = useDocument(doc(db, `user`, user?.uid || ""), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const postDoc = postData?.data();

	const [commentsCollection, commentsLoading] = useCollection(
		query(
			collection(db, "comments"),
			where("postId", "==", postId),
			orderBy("createdAt", "desc")
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const handlePostCommentChanges = (e: FormEvent<HTMLTextAreaElement>) =>
		setPostComment(e.currentTarget.value);

	const handlePostComment = async (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPostComment("");

		await addComment({
			details: {
				authorId: user?.uid || "",
				authorUsername: userProfile?.data()?.username,
				content: postComment,
				postId,
			},
		}).then(() => toast.success("Posted!"));
	};

	const hasChanges = () => !!postComment;

	const handleReplyButtonClick = (id: string) => {
		setReplyParentId(id);
		setAddCommentModalOpen(true);
	};

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

								{commentsCollection?.docs?.map(
									(childComment) => {
										if (
											childComment &&
											childComment?.data()?.parentId ===
												parentComment.id
										) {
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
										} else return <></>;
									}
								)}
								{parentComments?.length - 1 !== index ? (
									<div className="w-full border-t border-gray-300 mt-6" />
								) : null}
							</Fragment>
						);
					} else return <></>;
				})}
			</>
		);
	}, [commentsCollection]);

	return (
		<Layout>
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
										{new Date(
											postDoc?.createdAt
										).toUTCString()}
									</span>
								</div>
							</div>
							<p className="text-sm text-gray-500 mb-1">
								{postDoc?.content}
							</p>
						</div>
					</div>
				) : null}

				<div className="flex flex-col w-full max-w-2xl mt-20">
					<h4 className="text-xl">{`Discussion (${discussionCount})`}</h4>
					<div className="min-w-0 flex-1 mt-4">
						<form
							action="#"
							className="relative"
							method="POST"
							onSubmit={handlePostComment}
						>
							<div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
								<label htmlFor="comment" className="sr-only">
									Add your comment
								</label>
								<textarea
									rows={3}
									name="comment"
									id="comment"
									className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
									placeholder="Add your comment..."
									defaultValue={""}
									value={postComment}
									onChange={handlePostCommentChanges}
								/>
							</div>

							<div className="flex-shrink-0 mt-4">
								<button
									disabled={!hasChanges()}
									type="submit"
									className="inline-flex items-center disabled:opacity-70 disabled:bg-indigo-600 disabled:cursor-not-allowed rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									Post comment
								</button>
							</div>
						</form>
					</div>

					<div className="flex w-full max-w-2xl mt-20">
						<div className="w-full">
							{!commentsLoading ? renderComments : null}
						</div>
					</div>
				</div>
			</div>
			<AddCommentModal
				postId={postId}
				parentId={replyParentId}
				open={addCommentModalOpen}
				setOpen={setAddCommentModalOpen}
			/>

			<ToastContainer
				position="bottom-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</Layout>
	);
}

export default SinglePost;
