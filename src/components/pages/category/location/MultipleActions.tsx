import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, orderBy } from "firebase/firestore";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";

import { db } from "utils/firebase";
import { AddActionModal, Layout, Pagination } from "components/common";
import { useAuth } from "context/AuthContext";
import { DataContext } from "pages/_app";
import { DEFAULT_PAGE_SIZE } from "constants/defaultSearches";

function MultipleActions() {
	const { user } = useAuth();
	const router = useRouter();
	const routerQuery = router.query;
	const { currentCategoryId, currentLocationId } = useContext(DataContext);

	const [addActionModalOpen, setActionModalOpen] = useState(false);

	const categoryQuery = routerQuery?.category
		? routerQuery?.category.toString()
		: "...";
	const locationQuery = routerQuery?.location
		? routerQuery?.location.toString()
		: "...";
	const pageQuery = routerQuery?.page
		? parseInt(routerQuery?.page.toString()) || 1
		: 1;

	const handleAddActionClick = () => setActionModalOpen(true);

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

	const [actionsCollection, actionsLoading] = useCollection(
		query(
			collection(db, "actions"),
			where("topicId", "==", topicId),
			orderBy("updatedAt", "desc")
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const totalActions = actionsCollection?.docs.length || 0;

	// Firebase doesn't have a good way to paginate
	// https://firebase.google.com/docs/firestore/query-data/query-cursors
	// One solution is to generate indexes of generated docIds of paginated queries and use that with '.startAfter' and 'limit' queries
	// Another way is with counters (https://stackoverflow.com/questions/39519021/how-to-create-auto-incremented-key-in-firebase) but could limit filtering and hotspots later
	const paginatedActionsCollection = () => {
		if (actionsCollection?.docs) {
			const pageCount = Math.ceil(totalActions / DEFAULT_PAGE_SIZE);
			const firstIndexOnPage = (pageQuery - 1) * DEFAULT_PAGE_SIZE;
			const isLastPage = pageQuery === pageCount;
			const lastIndexOnPage = isLastPage
				? (totalActions % DEFAULT_PAGE_SIZE) +
				  DEFAULT_PAGE_SIZE * (pageQuery - 1)
				: DEFAULT_PAGE_SIZE * pageQuery;

			return actionsCollection?.docs.slice(
				firstIndexOnPage,
				lastIndexOnPage
			);
		}
		return [];
	};

	const [userProfile] = useDocument(doc(db, `user`, user?.uid || ""), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

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
						{canUserEdit ? (
							<span className="mx-3.5">
								<button
									onClick={handleAddActionClick}
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
					{!actionsLoading && !topicsLoading ? (
						<ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
							{paginatedActionsCollection().map((item) => {
								if (item) {
									const itemData = item.data();
									return (
										<Link
											key={itemData.id}
											href={`/${categoryQuery}/${locationQuery}/actions?action=${item.id}&tab=action`}
										>
											<li className="rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:bg-gray-50">
												<div className="text-xl font-medium text-black">
													{itemData.title}
												</div>

												<div className="mt-10 truncate text-sm font-light text-gray-400">
													{itemData.location}
												</div>
											</li>
										</Link>
									);
								}
							})}
						</ul>
					) : null}

					<Pagination
						totalCount={totalActions}
						pageSize={DEFAULT_PAGE_SIZE}
					/>
				</div>
			</div>

			<AddActionModal
				open={addActionModalOpen}
				setOpen={setActionModalOpen}
			/>
		</Layout>
	);
}

export default MultipleActions;
