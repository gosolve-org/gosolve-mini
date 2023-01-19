import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

interface CommentProps {
	id: string;
	authorUsername?: string;
	createdAt: Date;
	content?: string;
	handleReplyButtonClick?: (id: string) => void;
	isChild?: boolean;
}

function Comment({
	id,
	authorUsername,
	createdAt,
	content,
	isChild = false,
	handleReplyButtonClick,
}: CommentProps) {
	return (
		<div className="mt-6 flex w-full" key={id}>
			{isChild ? <div className="flex-shrink-0 w-12"></div> : null}

			<div className="flex flex-col w-full">
				<div>
					<div className="flex space-x-3 justify-center items-center  mb-4">
						<div className="flex-shrink-0 flex justify-center">
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
								{authorUsername || "Anonymous"}
							</span>
							<span className="text-sm text-gray-600 ml-4">
								{new Date(createdAt).toUTCString()}
							</span>
						</div>
					</div>

					<p className="mt-1 text-gray-500">{content}</p>
				</div>

				{handleReplyButtonClick ? (
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
}

export default Comment;