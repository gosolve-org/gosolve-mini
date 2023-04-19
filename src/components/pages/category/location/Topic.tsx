import { useState, useContext, useCallback } from "react";
import {
    collection,
    query,
    where,
    doc,
    limit,
    orderBy,
} from "firebase/firestore";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import { AddActionModal, AddCommunityPostModal, Layout } from "components/common";
import { updateTopic } from "pages/api/topic";
import { db, useCollectionOnceWithDependencies, useDocumentOnceWithDependencies } from "utils/firebase";
import { useAuth } from "context/AuthContext";
import BasicHead from "components/common/Layout/BasicHead";
import { getRandomItem } from "utils/basicUtils";
import { NO_ACTIONS_PLACEHOLDERS_FOR_EDITORS, NO_ACTIONS_PLACEHOLDERS_FOR_USERS, NO_POSTS_PLACEHOLDERS } from "constants/placeholderTexts";
import dynamic from "next/dynamic";
import { ResourceType } from "models/ResourceType";
import { toUrlPart } from "utils/textUtils";
import { DataContext } from "context/DataContext";
import { useMediaQueries } from "context/MediaQueryContext";
import MobileHorizontalScroll from "components/common/Layout/MobileHorizontalScroll";

const EditorJs = dynamic(() => import("components/common/Editor"), {
    ssr: false,
});

const cardTitleStyle = {
    minHeight: '2.5rem'
};

function Topic() {
    const { user, isAuthenticated } = useAuth();
    const { currentCategory, currentLocation } = useContext(DataContext);
    const { isMobile } = useMediaQueries();

    const [addActionModalOpen, setActionModalOpen] = useState(false);
    const [addCommunityPostModalOpen, setAddCommunityPostModalOpen] =
        useState(false);

    const [topicsCollection, topicsLoading] = useCollectionOnceWithDependencies(
        () => query(
            collection(db, "topics"),
            where("categoryId", "==", currentCategory.id),
            where("locationId", "==", currentLocation.id)
        ), [ currentCategory?.id, currentLocation?.id ]
    );

    const topicContent = topicsCollection?.docs?.[0]?.data()?.content;
    const topicId = topicsCollection?.docs?.[0]?.id || "";

    const [userProfile, userLoading] = useDocumentOnceWithDependencies(() => doc(db, `user`, user.uid), [ user?.uid ]);

    const [actionsCollection, actionsLoading] = useCollectionOnceWithDependencies(
        () => query(
            collection(db, "actions"),
            where("topicId", "==", topicId),
            orderBy("updatedAt", "desc"),
            limit(3)
        ), [ topicId ]
    );

    const [postsCollection, postsLoading] = useCollectionOnceWithDependencies(
        () => query(
            collection(db, "posts"),
            where("topicId", "==", topicId),
            orderBy("updatedAt", "desc"),
            limit(3)
        ), [ topicId ]
    );

    const canUserEdit =
        userProfile?.data()?.role === "admin" ||
        userProfile?.data()?.role === "editor";

    const handleAddActionClick = () => setActionModalOpen(true);
    const handleAddCommunityClick = () => setAddCommunityPostModalOpen(true);

    const handleSaveData = useCallback(async (savedData: string) => {
        await updateTopic({
            docId: topicId,
            details: {
                title: `${currentCategory.category} in ${currentLocation.location}`,
                content: savedData,
                categoryId: currentCategory.id,
                locationId: currentLocation.id,
            },
            location: currentLocation.location,
            category: currentCategory.category
        })
            .then(() => toast.success("Saved!"))
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong");
            });
    }, [ topicId, currentCategory, currentLocation ]);

    const renderActions = () => {
        const cards = actionsCollection?.docs?.map((item) => {
            const itemData = item.data();
            return (
                <Link
                    key={item.id}
                    href={`/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/actions/${item.id}`}
                >
                    <li className="rounded-lg bg-white px-4 py-5 shadow-md hover:bg-gray-50 list-none width-card-lg sm:w-auto">
                        <div className="text-sm font-medium text-black line-clamp-2" style={cardTitleStyle}>
                            {itemData.title}
                        </div>

                        <div className="mt-4 truncate text-sm font-light text-gray-400">
                            {
                                itemData.authorUsername
                            }
                        </div>
                    </li>
                </Link>
            );
        });

        return (isMobile
            ? <>
                <MobileHorizontalScroll className="row-fullscreen left-0 mt-5" childrenClassName="mx-2">
                    {cards}
                </MobileHorizontalScroll>
            </>
            : <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {cards}
            </ul>
        );
    };

    const renderCommunityPosts = () => {
        const cards = postsCollection?.docs?.map((item) => {
            const itemData = item.data();
            return (
                <Link
                    key={item.id}
                    href={`/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/community/${item.id}`}
                >
                    <li className="rounded-lg bg-white px-4 py-5 shadow-md hover:bg-gray-50 list-none width-card-lg sm:w-auto">
                        <div className="text-sm font-medium text-black line-clamp-2" style={cardTitleStyle}>
                            {itemData.title}
                        </div>

                        <div className="mt-4 truncate text-sm font-light text-gray-400">
                            {
                                itemData.authorUsername
                            }
                        </div>
                    </li>
                </Link>
            );
        });

        return (isMobile
            ? <>
                <MobileHorizontalScroll className="row-fullscreen left-0 mt-5" childrenClassName="mx-2">
                    {cards}
                </MobileHorizontalScroll>
            </>
            : <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {cards}
            </ul>
        );
    }

    return (
        <Layout>
            <BasicHead title={`goSolve | ${currentCategory?.category ?? ''} in ${currentLocation?.location ?? ''}`} />
            <div className="flex min-h-full flex-col justify-center items-center py-6 sm:py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl">
                    {!!currentCategory?.id && !!currentLocation?.id && !currentCategory.hidden && !currentLocation.hidden &&
                        <div className="bg-gray-100 p-6 rounded-lg">
                            <div>
                                <div className="flex items-center">
                                    <h2 className="text-xl font-medium leading-6 text-black">
                                        Actions
                                    </h2>

                                    {isAuthenticated() && canUserEdit &&
                                        <span className="ml-3.5">
                                            <button
                                                onClick={handleAddActionClick}
                                                type="button"
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
                                    }
                                    
                                    <span className="mx-3.5">
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
                                </div>
                                {!actionsLoading ? (
                                    actionsCollection?.docs?.length !== 0
                                        ? renderActions()
                                        : (
                                            <div className="mt-5 text-sm font-light text-gray-400">
                                            {getRandomItem(canUserEdit ? NO_ACTIONS_PLACEHOLDERS_FOR_EDITORS : NO_ACTIONS_PLACEHOLDERS_FOR_USERS)}
                                            </div>
                                        )
                                ) : null}
                            </div>

                            <div className="mt-5 sm:mt-10">
                                <div className="flex items-center">
                                    <h2 className="text-xl font-medium leading-6 text-black">
                                        Community
                                    </h2>

                                    {isAuthenticated() &&
                                        <span className="ml-3.5">
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
                                    }

                                    <span className="mx-3.5">
                                        <Link
                                            href={`/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/community`}
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
                                </div>
                                {!postsLoading ? (
                                    postsCollection?.docs?.length !== 0
                                        ? renderCommunityPosts()
                                        : (
                                            <div className="mt-5 truncate text-sm font-light text-gray-400">
                                            {getRandomItem(NO_POSTS_PLACEHOLDERS)}
                                            </div>
                                        )
                                ) : null}
                            </div>
                        </div>
                    }

                    <div className="mt-5 sm:mt-10 px-3 px-sm-0">
                        {!topicsLoading && (!userLoading || !isAuthenticated()) ? (
                            <EditorJs
                                readOnly={!canUserEdit}
                                saveData={handleSaveData}
                                defaultValue={topicContent}
                            />
                        ) : null}
                    </div>
                </div>
            </div>

            <AddActionModal
                open={addActionModalOpen}
                onClose={() => setActionModalOpen(false)}
            />

            <AddCommunityPostModal
                open={addCommunityPostModalOpen}
                onClose={() => setAddCommunityPostModalOpen(false)}
                parentResourceType={ResourceType.Topic}
                parentResourceId={topicId}
            />
        </Layout>
    );
}

export default Topic;
