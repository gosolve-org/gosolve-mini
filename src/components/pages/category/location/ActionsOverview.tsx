import { useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { useCollectionOnce, useDocumentOnce } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, orderBy, Query, DocumentData, QuerySnapshot, FirestoreError } from "firebase/firestore";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";

import { db, useCollectionOnceWithDependencies } from "utils/firebase";
import { AddActionModal, Layout, Pagination } from "components/common";
import { useAuth } from "context/AuthContext";
import { DataContext } from "pages/_app";
import { DEFAULT_PAGE_SIZE } from "constants/defaultSearches";

function ActionsOverview() {
	const { user } = useAuth();
	const router = useRouter();
	const routerQuery = router.query;
	const { currentCategoryId, currentLocationId } = useContext(DataContext);

	const [addActionModalOpen, setActionModalOpen] = useState(false);

	const categoryQuery = routerQuery?.category?.toString();
	const locationQuery = routerQuery?.location?.toString();
	const pageQuery = routerQuery?.page
		? parseInt(routerQuery?.page.toString()) || 1
		: 1;

	const handleAddActionClick = () => setActionModalOpen(true);

	const [topicsCollection, topicsLoading] = useCollectionOnceWithDependencies(
		query(
			collection(db, "topics"),
			where("categoryId", "==", currentCategoryId),
			where("locationId", "==", currentLocationId)
		), [ currentCategoryId, currentLocationId ]
	);
	const topicId = topicsCollection?.docs?.[0]?.id || "";

	const [actionsCollection, actionsLoading] = useCollectionOnceWithDependencies(
		query(
			collection(db, "actions"),
			where("topicId", "==", topicId),
			orderBy("updatedAt", "desc")
		), [ topicId ]
	);

	const totalActions = actionsCollection?.docs.length || 0;

	// Firebase doesn't have a good way to paginate
	// https://firebase.google.com/docs/firestore/query-data/query-cursors
	// One solution is to generate indexes of generated docIds of paginated queries and use that with '.startAfter' and 'limit' queries
	// Another way is with counters (https://stackoverflow.com/questions/39519021/how-to-create-auto-incremented-key-in-firebase) but could limit filtering and hotspots later
	const paginatedActionsCollection = useCallback(() => {
		if (!actionsCollection?.docs) return [];

		const pageCount = Math.ceil(totalActions / DEFAULT_PAGE_SIZE);
		const firstIndexOnPage = (pageQuery - 1) * DEFAULT_PAGE_SIZE;
		const isLastPage = pageQuery === pageCount;
		const lastIndexOnPage = isLastPage
			? (totalActions % DEFAULT_PAGE_SIZE === 0
					? DEFAULT_PAGE_SIZE
					: totalActions % DEFAULT_PAGE_SIZE) +
				DEFAULT_PAGE_SIZE * (pageQuery - 1)
			: DEFAULT_PAGE_SIZE * pageQuery;

		return actionsCollection?.docs.slice(
			firstIndexOnPage,
			lastIndexOnPage
		);
	}, [ actionsCollection, totalActions, DEFAULT_PAGE_SIZE, pageQuery ]);

	const [userProfile] = useDocumentOnce(doc(db, `user`, user?.uid || ""));

	const canUserEdit =
		userProfile?.data()?.role === "admin" ||
		userProfile?.data()?.role === "editor";

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-4xl">
					<div className="flex items-center">
						<h2 className="text-2xl font-semibold leading-6 text-black">
							Actions
						</h2>
						<span className="mx-3.5">
							<button
								onClick={handleAddActionClick}
								type="button"
								title={!canUserEdit ? 'Only admins can create actions. Create a community post instead.' : ''}
								disabled={!canUserEdit}
								className={canUserEdit
									? "inline-flex items-center rounded-full border border-gray-300 bg-white p-1.5 text-black shadow-sm hover:bg-indigo-500 hover:border-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									: "inline-flex items-center rounded-full border border-gray-300 bg-gray p-1.5 text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								}
							>
								<PlusIcon
									className="h-4 w-4"
									aria-hidden="true"
								/>
							</button>
						</span>
					</div>
					{!actionsLoading && !topicsLoading ? (
						<>
							<ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
								{paginatedActionsCollection().map((item) => {
									if (item) {
										const itemData = item.data();
										return (
											<Link
												key={item.id}
												href={`/${categoryQuery}/${locationQuery}/actions/${item.id}`}
											>
												<li className="rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:bg-gray-50">
													<div className="text-xl font-medium text-black">
														{itemData.title}
													</div>

													<div className="mt-10 truncate text-sm font-light text-gray-400">
														{itemData.authorUsername}
													</div>
												</li>
											</Link>
										);
									}
								})}
							</ul>

							<Pagination
								totalCount={totalActions}
								pageSize={DEFAULT_PAGE_SIZE}
							/>
						</>
					) : null}

				</div>
			</div>

			<AddActionModal
				open={addActionModalOpen}
				setOpen={setActionModalOpen}
			/>
		</Layout>
	);
}

export default ActionsOverview;
