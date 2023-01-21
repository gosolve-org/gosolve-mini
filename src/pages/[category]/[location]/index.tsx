import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useCollectionOnce, useDocumentOnce } from "react-firebase-hooks/firestore";
import {
	collection,
	query,
	where,
	doc,
	limit,
	orderBy,
} from "firebase/firestore";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/20/solid";

import { ToastContainer, toast } from "react-toastify";
import { AddActionModal, AddCommunityPostModal } from "components/common";
import { updateTopic } from "pages/api/topic";
import { db, useCollectionOnceWithDependencies } from "utils/firebase";
import { useAuth } from "context/AuthContext";
import { DataContext } from "pages/_app";

const EditorJs = dynamic(() => import("components/common/Editor"), {
	ssr: false,
});

import { Layout } from "components/common";
import { ResourceType } from "models/ResourceType";
import { Tab } from "models/Tab";

function TopicPage() {
	const { user } = useAuth();
	const { currentCategoryId, currentLocationId, handleCurrentTabChange } = useContext(DataContext);

	useEffect(() => {
		handleCurrentTabChange(Tab.Topic);
	}, []);

	const [addActionModalOpen, setActionModalOpen] = useState(false);
	const [addCommunityPostModalOpen, setAddCommunityPostModalOpen] =
		useState(false);

	const router = useRouter();

	const categoryQuery = router?.query?.category?.toString();
	const locationQuery = router?.query?.location?.toString();

	const readableCategory = categoryQuery.split("-").join(" ");
	const readableLocation = locationQuery.split("-").join(" ");

	const [topicsCollection, topicsLoading] = useCollectionOnceWithDependencies(
		query(
			collection(db, "topics"),
			where("categoryId", "==", currentCategoryId),
			where("locationId", "==", currentLocationId)
		), [ currentCategoryId, currentLocationId ]
	);

	const topicContent = topicsCollection?.docs?.[0]?.data()?.content;
	const topicId = topicsCollection?.docs?.[0]?.id || "";

	const [userProfile, userLoading] = useDocumentOnce(doc(db, `user`, user?.uid || ""));

	const [actionsCollection, actionsLoading] = useCollectionOnceWithDependencies(
		query(
			collection(db, "actions"),
			where("topicId", "==", topicId),
			orderBy("updatedAt", "desc"),
			limit(3)
		), [ topicId ]
	);

	const [postsCollection, postsLoading] = useCollectionOnceWithDependencies(
		query(
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

	const handleSaveData = async (savedData: string) => {
		await updateTopic({
			docId: topicId,
			details: {
				title: `${readableCategory} in ${readableLocation}`,
				content: savedData,
				categoryId: currentCategoryId,
				locationId: currentLocationId,
			},
		})
			.then(() => toast.success("Saved!"))
			.catch(() => toast.error("Something went wrong"));
	};

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-4xl">
					<div className="bg-gray-100 p-6 rounded-lg">
						<div>
							<div className="flex items-center">
								<h2 className="text-xl font-medium leading-6 text-black">
									Actions
								</h2>

								<span className="ml-3.5">
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

								<span className="mx-3.5">
									<Link
										href={`/${categoryQuery}/${locationQuery}/actions`}
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
								<ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
									{actionsCollection?.docs?.map((item) => {
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
														{
															itemData.authorUsername
														}
													</div>
												</li>
											</Link>
										);
									})}
								</ul>
							) : null}
						</div>

						<div className="mt-10">
							<div className="flex items-center">
								<h2 className="text-xl font-medium leading-6 text-black">
									Community
								</h2>

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

								<span className="mx-3.5">
									<Link
										href={`/${categoryQuery}/${locationQuery}/community`}
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
								<ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
									{postsCollection?.docs?.map((item) => {
										const itemData = item.data();
										return (
											<Link
												key={item.id}
												href={`/${categoryQuery}/${locationQuery}/community/${item.id}`}
											>
												<li className="rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:bg-gray-50">
													<div className="text-xl font-medium text-black">
														{itemData.title}
													</div>

													<div className="mt-10 truncate text-sm font-light text-gray-400">
														{
															itemData.authorUsername
														}
													</div>
												</li>
											</Link>
										);
									})}
								</ul>
							) : null}
						</div>
					</div>

					<div className="mt-10">
						{!topicsLoading && !userLoading ? (
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
				setOpen={setActionModalOpen}
			/>

			<AddCommunityPostModal
				open={addCommunityPostModalOpen}
				setOpen={setAddCommunityPostModalOpen}
				parentResourceType={ResourceType.Topic}
				parentResourceId={topicId}
			/>

			<ToastContainer
				position="bottom-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</Layout>
	);
}

export default TopicPage;
