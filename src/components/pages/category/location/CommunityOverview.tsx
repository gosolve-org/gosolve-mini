import { useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { collection, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";

import { db, useCollectionOnceWithDependencies } from "utils/firebase";
import { Layout, AddCommunityPostModal, Pagination } from "components/common";
import { toUrlPart, trimToFirstLine } from "utils/textUtils";
import { ResourceType } from "models/ResourceType";
import { paginate } from "utils/pagination";
import { getRandomItem } from "utils/basicUtils";
import { NO_POSTS_PLACEHOLDERS } from "constants/placeholderTexts";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import calendar from "dayjs/plugin/calendar";
import { DataContext } from "context/DataContext";
dayjs.extend(localizedFormat);
dayjs.extend(calendar);

const PAGE_SIZE = 10;

interface CommunityOverviewProps {
	resourceType: ResourceType;
}

function CommunityOverview({ resourceType } : CommunityOverviewProps) {
	const { currentCategory, currentLocation } = useContext(DataContext);
	const [addCommunityPostModalOpen, setAddCommunityPostModalOpen] =
		useState(false);

	const [topicsCollection, topicsLoading] = useCollectionOnceWithDependencies(
		resourceType == ResourceType.Topic ? () => query(
			collection(db, "topics"),
			where("categoryId", "==", currentCategory.id),
			where("locationId", "==", currentLocation.id)
		) : null, [ currentCategory?.id, currentLocation?.id ]);


	const router = useRouter();
	const routerQuery = router.query;

	const pageQuery = routerQuery?.page
		? parseInt(routerQuery?.page.toString()) || 1
		: 1;

	let resourceId = '';
	switch (resourceType) {
		case ResourceType.Action:
			resourceId = router?.query?.actionId?.toString() ?? '';
			break;
		case ResourceType.Topic:
			resourceId = topicsCollection?.docs?.[0]?.id || "";
			break;
		default:
			console.error(`Could not determine resource type ${resourceType}.`);
	}

	const handleAddCommunityClick = () => setAddCommunityPostModalOpen(true);

	const [postsCollection, postsLoading] = useCollectionOnceWithDependencies(
		() => query(
			collection(db, "posts"),
			where(resourceType === ResourceType.Action ? 'actionId' : 'topicId', "==", resourceId),
			orderBy("updatedAt", "desc")
		), [ resourceId ]
	);

	const totalPosts = postsCollection?.docs.length || 0;

	// Firebase doesn't have a good way to paginate
	// https://firebase.google.com/docs/firestore/query-data/query-cursors
	// One solution is to generate indexes of generated docIds of paginated queries and use that with '.startAfter' and 'limit' queries
	// Another way is with counters (https://stackoverflow.com/questions/39519021/how-to-create-auto-incremented-key-in-firebase) but could limit filtering and hotspots later
	const paginatePostsCollection = useCallback(() => paginate(postsCollection?.docs, PAGE_SIZE, pageQuery), [ postsCollection, pageQuery ]);

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

					{!postsLoading && (!topicsLoading || resourceType != ResourceType.Topic) ? (postsCollection?.docs?.length > 0 ?
						<>
							<dl className="mt-6 flex flex-col items-center justify-center w-full max-w-4xl gap-5">
								{paginatePostsCollection().map((item) => {
									const itemData = item.data();
									return (
										<Link
											href={resourceType === ResourceType.Topic
												? `/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/community/${item.id}`
												: `/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/actions/${resourceId}/community/${item.id}`
											}
											className="bg-white hover:bg-gray-50 px-4 py-5 sm:px-6 rounded-lg shadow mb w-full"
											key={item.id}
										>
											<h4 className="text-2xl mb-4 truncate">
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
														{dayjs(itemData?.createdAt).calendar(null, {
															sameElse: 'lll',
														})}
													</span>
												</div>
											</div>
											<p className="text-sm text-gray-500 mb-1 truncate">
												{trimToFirstLine(itemData?.content)}
											</p>
										</Link>
									);
								})}
							</dl>
							<Pagination
								totalCount={totalPosts}
								pageSize={PAGE_SIZE}
							/>
						</> : (<div className="mt-5 truncate text-sm font-light text-gray-400">{getRandomItem(NO_POSTS_PLACEHOLDERS)}</div>)
					) : null}
				</div>
			</div>

			<AddCommunityPostModal
				open={addCommunityPostModalOpen}
				setOpen={setAddCommunityPostModalOpen}
				parentResourceType={resourceType}
				parentResourceId={resourceId}
			/>
		</Layout>
	);
}

export default CommunityOverview;
