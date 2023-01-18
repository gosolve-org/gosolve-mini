import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, query, where, doc } from "firebase/firestore";
import Link from "next/link";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PlusIcon,
} from "@heroicons/react/20/solid";

import { Layout, AddCommunityPostModal } from "components/common";
import { db } from "utils/firebase";
import { useAuth } from "context/AuthContext";
import { DataContext } from "pages/_app";

function MultiplePosts() {
	const { user } = useAuth();
	const router = useRouter();
	const { currentCategoryId, currentLocationId } = useContext(DataContext);

	const [usernames, setUsernames] = useState();
	const [addCommunityPostModalOpen, setAddCommunityPostModalOpen] =
		useState(false);

	const categoryQuery = router?.query?.category
		? router?.query?.category.toString()
		: "...";
	const locationQuery = router?.query?.location
		? router?.query?.location.toString()
		: "...";

	const handleAddCommunityClick = () => setAddCommunityPostModalOpen(true);

	const [topicsCollection, topicsLoading] = useCollection(
		query(
			collection(db, "topics"),
			where("categoryId", "==", currentCategoryId),
			where("locationId", "==", currentLocationId)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const topicId = topicsCollection?.docs?.[0]?.id || "";

	const [postsCollection, postsLoading] = useCollection(
		query(collection(db, "posts"), where("topicId", "==", topicId)),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const [userProfile] = useDocument(doc(db, `user`, user?.uid || ""), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const canUserEdit =
		userProfile?.data()?.role === "admin" ||
		userProfile?.data()?.role === "editor";

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-4xl">
					<div className="flex items-center">
						<h2 className="text-2xl font-xl font-semibold leading-6 text-black">
							Community
						</h2>
						{canUserEdit ? (
							<span className="mx-3.5">
								<button
									onClick={handleAddCommunityClick}
									type="button"
									className="inline-flex items-center rounded-full border border-gray-300 bg-white p-1.5 text-black shadow-sm hover:bg-indigo-500 hover:border-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									<PlusIcon
										className="h-4 w-4"
										aria-hidden="true"
									/>
								</button>
							</span>
						) : null}
					</div>
					{!postsLoading && !topicsLoading ? (
						<dl className="mt-6 flex flex-col items-center justify-center w-full max-w-4xl gap-5">
							{postsCollection?.docs?.map((item) => {
								const itemData = item.data();
								return (
									<Link
										href={`/${categoryQuery}/${locationQuery}/community?post=${item.id}`}
										className="bg-white hover:bg-gray-50 px-4 py-5 sm:px-6 rounded-lg shadow mb w-full"
										key={item.id}
									>
										<h4 className="text-2xl mb-4">
											{itemData?.title}
										</h4>
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
													{itemData?.authorUsername ||
														"Anonymous"}
												</span>
												<span className="text-sm text-gray-500 ml-4">
													{new Date(
														itemData?.createdAt
													).toUTCString()}
												</span>
											</div>
										</div>
										<p className="text-sm text-gray-500 mb-1">
											{itemData?.content}
										</p>
									</Link>
								);
							})}
						</dl>
					) : null}
					<div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-10">
						<div className="flex flex-1 justify-between sm:hidden">
							<a
								href="#"
								className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								Previous
							</a>
							<a
								href="#"
								className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								Next
							</a>
						</div>
						<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-gray-700">
									Showing{" "}
									<span className="font-medium">1</span> to{" "}
									<span className="font-medium">10</span> of{" "}
									<span className="font-medium">97</span>{" "}
									results
								</p>
							</div>
							<div>
								<nav
									className="isolate inline-flex -space-x-px rounded-md shadow-sm"
									aria-label="Pagination"
								>
									<a
										href="#"
										className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
									>
										<span className="sr-only">
											Previous
										</span>
										<ChevronLeftIcon
											className="h-5 w-5"
											aria-hidden="true"
										/>
									</a>
									{/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
									<a
										href="#"
										aria-current="page"
										className="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
									>
										1
									</a>
									<a
										href="#"
										className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
									>
										2
									</a>
									<a
										href="#"
										className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex"
									>
										3
									</a>
									<span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
										...
									</span>
									<a
										href="#"
										className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex"
									>
										8
									</a>
									<a
										href="#"
										className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
									>
										9
									</a>
									<a
										href="#"
										className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
									>
										10
									</a>
									<a
										href="#"
										className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
									>
										<span className="sr-only">Next</span>
										<ChevronRightIcon
											className="h-5 w-5"
											aria-hidden="true"
										/>
									</a>
								</nav>
							</div>
						</div>
					</div>
				</div>
			</div>

			<AddCommunityPostModal
				open={addCommunityPostModalOpen}
				setOpen={setAddCommunityPostModalOpen}
			/>
		</Layout>
	);
}

export default MultiplePosts;
