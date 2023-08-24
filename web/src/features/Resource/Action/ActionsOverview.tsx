import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { collection, query, where, doc, orderBy } from "firebase/firestore";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";

import { db, useCollectionOnceWithDependencies, useDocumentOnceWithDependencies } from "utils/firebase";
import { useAuth } from "features/Auth/AuthContext";
import { paginate } from "utils/pagination";
import { getRandomItem } from "utils/basicUtils";
import { NO_ACTIONS_PLACEHOLDERS_FOR_EDITORS, NO_ACTIONS_PLACEHOLDERS_FOR_USERS } from "features/Resource/placeholderTexts";
import { toUrlPart } from "utils/textUtils";
import Pagination from "common/components/Pagination";
import AddActionModal from "features/Resource/Action/AddActionModal";
import { useNav } from "features/Nav/NavigationContext";

const PAGE_SIZE = 12;

function ActionsOverview() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const routerQuery = router.query;
    const { currentCategory, currentLocation } = useNav();

    const [addActionModalOpen, setAddActionModalOpen] = useState(false);

    const pageQuery = routerQuery?.page
        ? parseInt(routerQuery?.page.toString()) || 1
        : 1;

    const handleAddActionClick = () => setAddActionModalOpen(true);

    const [topicsCollection, topicsLoading] = useCollectionOnceWithDependencies(
        () => query(
            collection(db, "topics"),
            where("categoryId", "==", currentCategory.id),
            where("locationId", "==", currentLocation.id)
        ), [ currentCategory?.id, currentLocation?.id ]
    );
    const topicId = topicsCollection?.docs?.[0]?.id || "";

    const [actionsCollection, actionsLoading] = useCollectionOnceWithDependencies(
        () => query(
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
    const paginateActionsCollection = useCallback(() => paginate(actionsCollection?.docs, PAGE_SIZE, pageQuery), [ actionsCollection, pageQuery ]);

    const [userProfile] = useDocumentOnceWithDependencies(() => doc(db, `user`, user.uid), [ user?.uid ]);

    const canUserEdit =
        userProfile?.data()?.role === "admin" ||
        userProfile?.data()?.role === "editor";

    return (
        <>
            <div className="flex min-h-full flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-xl font-semibold leading-6 text-black">
                            Actions
                        </h2>
                        {isAuthenticated() && canUserEdit &&
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
                        }
                    </div>
                    {!actionsLoading && !topicsLoading ? (actionsCollection?.docs?.length > 0 ?
                        <>
                            <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                {paginateActionsCollection().map((item) => {
                                    const itemData = item.data();
                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/actions/${item.id}`}
                                        >
                                            <li className="rounded-lg bg-white px-4 py-5 shadow hover:bg-gray-50">
                                                <div className="text-sm font-medium text-black">
                                                    {itemData.title}
                                                </div>

                                                <div className="mt-5 text-sm font-light text-gray-400">
                                                    {itemData.authorUsername}
                                                </div>
                                            </li>
                                        </Link>
                                    );
                                })}
                            </ul>

                            <Pagination
                                totalCount={totalActions}
                                pageSize={PAGE_SIZE}
                            />
                        </> : (
                            <div className="mt-5 truncate text-sm font-light text-gray-400">
                                {getRandomItem(canUserEdit ? NO_ACTIONS_PLACEHOLDERS_FOR_EDITORS : NO_ACTIONS_PLACEHOLDERS_FOR_USERS)}
                            </div>
                        )
                    ) : null}
                </div>
            </div>

            <AddActionModal
                open={addActionModalOpen}
                onClose={() => setAddActionModalOpen(false)}
            />
        </>
    );
}

export default ActionsOverview;
