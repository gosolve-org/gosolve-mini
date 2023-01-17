import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

import { Layout, AddCommunityPostModal } from "components/common";

const post = {
	id: "ASdsadjihasDsa",
	title: "Fundraiser for Cancer Research",
	createdBy: "Barack Obama",
	createdAt: "December 9 at 11:43 AM",
	description:
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus sit amet est placerat in egestas",
};

function SinglePost() {
	const router = useRouter();
	const routerPathname = router.pathname;

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center pb-20 pt-4 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-4xl">
					<div className="bg-white px-4 py-5 sm:px-6 rounded-lg shadow mb w-full">
						<h4 className="text-2xl mb-4">{post.title}</h4>
						<div className="flex space-x-3 justify-center items-center  mb-4">
							<div className="flex-shrink-0">
								<img
									className="h-7 w-7 rounded-full"
									src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt=""
								/>
							</div>
							<div className="min-w-0 flex-1">
								<span className="text-sm font-medium text-gray-900">
									{post.createdBy}
								</span>
								<span className="text-sm text-gray-500 ml-4">
									{post.createdAt}
								</span>
							</div>
						</div>
						<p className="text-sm text-gray-500 mb-1">
							{post.description}
						</p>
					</div>
				</div>

				<div className="flex flex-col w-full max-w-2xl mt-20">
					<h4 className="text-xl">{`Discussion (${"3"})`}</h4>
					<div className="min-w-0 flex-1 mt-4">
						<form action="#" className="relative">
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
								/>
							</div>

							<div className="flex-shrink-0 mt-4">
								<button
									type="submit"
									className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									Post comment
								</button>
							</div>
						</form>
					</div>

					<div className="flex w-full max-w-2xl mt-20">
						<div>
							<div className="mt-6 flex">
								<div className="flex flex-col">
									<div>
										<div className="flex space-x-3 justify-center items-center  mb-4">
											<div className="flex-shrink-0">
												<img
													className="h-7 w-7 rounded-full"
													src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
													alt=""
												/>
											</div>
											<div className="min-w-0 flex-1">
												<span className="text-sm font-medium text-gray-900">
													{post.createdBy}
												</span>
												<span className="text-sm text-gray-600 ml-4">
													{post.createdAt}
												</span>
											</div>
										</div>

										<p className="mt-1 text-gray-500">
											Repudiandae sint consequuntur vel.
											Amet ut nobis explicabo numquam
											expedita quia omnis voluptatem.
											Minus quidem ipsam quia iusto.
										</p>
									</div>
									<button
										type="button"
										className="inline-flex items-center rounded-md border border-transparent mt-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-700"
									>
										<ChatBubbleOvalLeftEllipsisIcon
											className="h-4 w-4 inline-block items-center mr-2"
											aria-hidden="true"
										/>
										Reply
									</button>
								</div>
							</div>

							<div className="mt-6 flex">
								<div className="flex-shrink-0 w-12"></div>

								<div className="flex flex-col">
									<div>
										<div className="flex space-x-3 justify-center items-center  mb-4">
											<div className="flex-shrink-0">
												<img
													className="h-7 w-7 rounded-full"
													src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
													alt=""
												/>
											</div>
											<div className="min-w-0 flex-1">
												<span className="text-sm font-medium text-gray-900">
													{post.createdBy}
												</span>
												<span className="text-sm text-gray-600 ml-4">
													{post.createdAt}
												</span>
											</div>
										</div>

										<p className="mt-1 text-gray-500">
											Repudiandae sint consequuntur vel.
											Amet ut nobis explicabo numquam
											expedita quia omnis voluptatem.
											Minus quidem ipsam quia iusto.
										</p>
									</div>

									<button
										type="button"
										className="inline-flex items-center rounded-md border border-transparent mt-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-700"
									>
										<ChatBubbleOvalLeftEllipsisIcon
											className="h-4 w-4 inline-block items-center mr-2"
											aria-hidden="true"
										/>
										Reply
									</button>
								</div>
							</div>

							<div className="w-full border-t border-gray-300 mt-6" />

							<div className="mt-6 flex flex-col">
								<div>
									<div className="flex-shrink-0 w-12"></div>
									<div>
										<div className="flex space-x-3 justify-center items-center  mb-4">
											<div className="flex-shrink-0">
												<img
													className="h-7 w-7 rounded-full"
													src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
													alt=""
												/>
											</div>
											<div className="min-w-0 flex-1">
												<span className="text-sm font-medium text-gray-900">
													{post.createdBy}
												</span>
												<span className="text-sm text-gray-600 ml-4">
													{post.createdAt}
												</span>
											</div>
										</div>

										<p className="mt-1 text-gray-500">
											Repudiandae sint consequuntur vel.
											Amet ut nobis explicabo numquam
											expedita quia omnis voluptatem.
											Minus quidem ipsam quia iusto.
										</p>
									</div>

									<button
										type="button"
										className="inline-flex items-center rounded-md border border-transparent mt-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-700"
									>
										<ChatBubbleOvalLeftEllipsisIcon
											className="h-4 w-4 inline-block items-center mr-2"
											aria-hidden="true"
										/>
										Reply
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default SinglePost;
