import { ArrowRightIcon, PlusIcon } from "@heroicons/react/20/solid";
import MobileHorizontalScroll from "components/common/layout/MobileHorizontalScroll";
import AddCommunityPostModal from "components/posts/AddPostModal";
import { NO_POSTS_PLACEHOLDERS } from "constants/placeholderTexts";
import { useAuth } from "contexts/AuthContext";
import { useMediaQueries } from "contexts/MediaQueryContext";
import { useNav } from "contexts/NavigationContext";
import { useResource } from "contexts/ResourceContext";
import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { ResourceType } from "models/ResourceType";
import Link from "next/link";
import { useState } from "react";
import { getRandomItem } from "utils/basicUtils";
import { db, useCollectionOnceWithDependencies } from "utils/firebase";
import { toUrlPart } from "utils/textUtils";
import SideBarItem from "../SideBarItem";
import SideBarPostCard from "./SideBarPostCard";

function SideBarPostsOverview()
{
    const { isAuthenticated } = useAuth();
    const { topicId, resourceType, actionId } = useResource();
    const { currentCategory, currentLocation } = useNav();
    const { isTabletOrMobile } = useMediaQueries();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [topicPostsCollection, topicPostsLoading] = useCollectionOnceWithDependencies(
        () => query(
            collection(db, "posts"),
            where("topicId", "==", topicId),
            orderBy("updatedAt", "desc"),
            limit(3)
        ), [ topicId, resourceType == ResourceType.Topic ]
    );

    const [actionPostsCollection, actionPostsLoading] = useCollectionOnceWithDependencies(
        () => query(
            collection(db, "posts"),
            where("actionId", "==", actionId),
            orderBy("updatedAt", "desc"),
            limit(3)
        ), [ actionId, resourceType == ResourceType.Action ]
    );

    const postsCollection = resourceType == ResourceType.Action ? actionPostsCollection : topicPostsCollection;
    const postsLoading = resourceType == ResourceType.Action ? actionPostsLoading : topicPostsLoading;

    const createPostCards = () => postsCollection.docs
        .map(doc => ({ id: doc.id, data: doc.data() }))
        .map(doc => <SideBarPostCard key={doc.id} id={doc.id} title={doc.data.title} authorUsername={doc.data.authorUsername} resourceType={resourceType} />);

    const createViewAllButton = () => (
        <span>
            <Link
                href={resourceType == ResourceType.Action
                    ? `/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/actions/${actionId}/community`
                    : `/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/community`
                }
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
                        Community
                    </h2>

                    {isAuthenticated() &&
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

                {!postsLoading ? (
                        postsCollection?.docs?.length !== 0
                            ? (
                                isTabletOrMobile
                                    ? <MobileHorizontalScroll className="row-fullscreen left-0 mt-5" childrenClassName="mx-2">
                                        {createPostCards()}
                                    </MobileHorizontalScroll>
                                    : <ul className="mt-5">
                                        {createPostCards()}
                                    </ul>
                            )
                            : (
                                <div className="mt-5 text-sm font-light text-gray-400">
                                    {getRandomItem(NO_POSTS_PLACEHOLDERS)}
                                </div>
                            )
                    ) : null}

                {!isTabletOrMobile && postsCollection?.docs?.length > 0 &&
                    <div className="mt-6">
                        {createViewAllButton()}
                    </div>
                }
            </div>

            <AddCommunityPostModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                parentResourceType={resourceType}
                parentResourceId={resourceType == ResourceType.Action ? actionId : topicId}
            />
        </SideBarItem>
    );
}

export default SideBarPostsOverview;
