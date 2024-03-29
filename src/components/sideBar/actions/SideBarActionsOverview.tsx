import { ArrowRightIcon, PlusIcon } from "@heroicons/react/20/solid";
import AddActionModal from "components/actions/AddActionModal";
import MobileHorizontalScroll from "components/common/layout/MobileHorizontalScroll";
import { NO_ACTIONS_PLACEHOLDERS_FOR_EDITORS, NO_ACTIONS_PLACEHOLDERS_FOR_USERS } from "constants/placeholderTexts";
import { useAuth } from "contexts/AuthContext";
import { useMediaQueries } from "contexts/MediaQueryContext";
import { useNav } from "contexts/NavigationContext";
import { useResource } from "contexts/ResourceContext";
import { collection, limit, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import { getRandomItem } from "utils/basicUtils";
import { db, useCollectionOnceWithDependencies } from "utils/firebase";
import { toUrlPart } from "utils/textUtils";
import SideBarItem from "../SideBarItem";
import SideBarActionCard from "./SideBarActionCard";

function SideBarActionsOverview()
{
    const { isAuthenticated, hasEditorRights } = useAuth();
    const { topicId } = useResource();
    const { currentCategory, currentLocation } = useNav();
    const { isTabletOrMobile } = useMediaQueries();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [actionsCollection, actionsLoading] = useCollectionOnceWithDependencies(
        () => query(
            collection(db, "actions"),
            where("topicId", "==", topicId),
            orderBy("updatedAt", "desc"),
            limit(3)
        ), [ topicId ]
    );

    const createActionCards = () => actionsCollection.docs
        .map(doc => ({ id: doc.id, data: doc.data() }))
        .map(doc => <SideBarActionCard key={doc.id} id={doc.id} title={doc.data.title} authorUsername={doc.data.authorUsername} />);

    const createViewAllButton = () => (
        <span>
            <Link
                href={`/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/actions`}
                type="button"
                className="text-xs font-light inline-flex items-center rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-black shadow-sm hover:bg-indigo-500 hover:border-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                View all
                <ArrowRightIcon
                    className="h-3 w-3 ml-1"
                    aria-hidden="true"
                />
            </Link>
        </span>
    );

    return (
        <SideBarItem>
            <div className="bg-gray-100 p-6 rounded-lg">
                <div className="flex items-center">
                    <h2 className="text-xl font-medium leading-6 text-black">
                        Actions
                    </h2>

                    {isAuthenticated() && hasEditorRights() &&
                        <span className="ml-3.5">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
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

                    {isTabletOrMobile &&
                        <>
                            <div className="flex-grow"></div>
                            <div>
                                {createViewAllButton()}
                            </div>
                        </>
                    }
                </div>

                {!actionsLoading && (
                    actionsCollection?.docs?.length !== 0
                        ? (
                            isTabletOrMobile
                                ? <MobileHorizontalScroll className="row-fullscreen left-0 mt-5" childrenClassName="mx-2">
                                    {createActionCards()}
                                </MobileHorizontalScroll>
                                : <ul className="mt-5">
                                    {createActionCards()}
                                </ul>
                        )
                        : (
                            <div className="mt-5 text-sm font-light text-gray-400">
                                {getRandomItem(hasEditorRights() ? NO_ACTIONS_PLACEHOLDERS_FOR_EDITORS : NO_ACTIONS_PLACEHOLDERS_FOR_USERS)}
                            </div>
                        )
                )}

                {!isTabletOrMobile && actionsCollection?.docs?.length > 0 &&
                    <div className="mt-6">
                        {createViewAllButton()}
                    </div>
                }
            </div>

            <AddActionModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </SideBarItem>
    );
}

export default SideBarActionsOverview;
