import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PlusIcon,
} from "@heroicons/react/20/solid";

import { Layout, AddCommunityPostModal, Pagination } from "components/common";
import { db } from "utils/firebase";
import { useAuth } from "context/AuthContext";
import { DataContext } from "pages/_app";
import { DEFAULT_PAGE_SIZE } from "constants/defaultSearches";

function MultiplePosts() {
	const { user } = useAuth();
	const router = useRouter();
	const routerQuery = router.query;
	const { currentCategoryId, currentLocationId } = useContext(DataContext);

	const [usernames, setUsernames] = useState();
	const [addCommunityPostModalOpen, setAddCommunityPostModalOpen] =
		useState(false);

	const categoryQuery = routerQuery?.category
		? routerQuery?.category.toString()
		: "...";
	const locationQuery = routerQuery?.location
		? routerQuery?.location.toString()
		: "...";
	const pageQuery = routerQuery?.page
		? parseInt(routerQuery?.page.toString()) || 1
		: 1;

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
		query(
			collection(db, "posts"),
			where("topicId", "==", topicId),
			orderBy("updatedAt", "desc")
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const totalPosts = postsCollection?.docs.length || 0;

	// Firebase doesn't have a good way to paginate
	// https://firebase.google.com/docs/firestore/query-data/query-cursors
	// One solution is to generate indexes of generated docIds of paginated queries and use that with '.startAfter' and 'limit' queries
	// Another way is with counters (https://stackoverflow.com/questions/39519021/how-to-create-auto-incremented-key-in-firebase) but could limit filtering and hotspots later
	const paginatedPostsCollection = () => {
		if (postsCollection?.docs) {
			const pageCount = Math.ceil(totalPosts / DEFAULT_PAGE_SIZE);
			const firstIndexOnPage = (pageQuery - 1) * DEFAULT_PAGE_SIZE;
			const isLastPage = pageQuery === pageCount;
			const lastIndexOnPage = isLastPage
				? (totalPosts % DEFAULT_PAGE_SIZE) +
				  DEFAULT_PAGE_SIZE * (pageQuery - 1)
				: DEFAULT_PAGE_SIZE * pageQuery;

			return postsCollection?.docs.slice(
				firstIndexOnPage,
				lastIndexOnPage
			);
		}
		return [];
	};

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-4xl">
					<div className="flex items-center">
						<h2 className="text-2xl font-xl font-semibold leading-6 text-black">
							Community
						</h2>

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
					</div>
					{!postsLoading && !topicsLoading ? (
						<dl className="mt-6 flex flex-col items-center justify-center w-full max-w-4xl gap-5">
							{paginatedPostsCollection()?.map((item) => {
								if (item) {
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
								}
							})}
						</dl>
					) : null}

					<Pagination
						totalCount={totalPosts}
						pageSize={DEFAULT_PAGE_SIZE}
					/>
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
