import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, limit } from "firebase/firestore";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/20/solid";

import { ToastContainer, toast } from "react-toastify";
import { AddActionModal, AddCommunityPostModal } from "components/common";
import { updateTopic } from "pages/api/topic";
import { db } from "utils/firebase";
import { useAuth } from "context/AuthContext";
import { DataContext } from "pages/_app";

const EditorJs = dynamic(() => import("components/common/Editor"), {
	ssr: false,
});

import { Layout } from "components/common";

const communities = [
	{
		id: "ASdsadjihasDsa",
		title: "Fundraiser for Cancer Research",
		createdBy: "Barack Obama",
		createdAt: "December 9 at 11:43 AM",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus sit amet est placerat in egestas",
	},
	{
		id: "jklhAsdjGFdssdf",
		title: "Fundraiser for Cancer Research",
		createdBy: "Barack Obama",
		createdAt: "December 9 at 11:43 AM",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus sit amet est placerat in egestas",
	},
	{
		id: "kjldsaERtsfdsad",
		title: "Fundraiser for Cancer Research",
		createdBy: "Barack Obama",
		createdAt: "December 9 at 11:43 AM",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus sit amet est placerat in egestas",
	},
];

function Topic() {
	const { user } = useAuth();
	const { currentCategoryId, currentLocationId } = useContext(DataContext);

	const [addActionModalOpen, setActionModalOpen] = useState(false);
	const [addCommunityPostModalOpen, setAddCommunityPostModalOpen] =
		useState(false);

	const router = useRouter();

	const categoryQuery = router?.query?.category
		? router?.query?.category.toString()
		: "...";
	const locationQuery = router?.query?.location
		? router?.query?.location.toString()
		: "...";

	const readableCategory = categoryQuery.split("-").join(" ");
	const readableLocation = locationQuery.split("-").join(" ");

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

	// TODO Seems like error with library if there are no blocks so set default block
	const topicContent =
		topicsCollection?.docs?.[0]?.data()?.content ||
		`{"time":1674009351098,"blocks":[{"id":"lLg8bWk7VH","type":"header","data":{"text": "${readableCategory} in ${readableLocation}","level":1}}],"version":"2.26.4"}`;
	const topicId = topicsCollection?.docs?.[0]?.id || "";

	const [userProfile, userLoading] = useDocument(
		doc(db, `user`, user?.uid || ""),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const [actionsCollection, actionsLoading] = useCollection(
		query(
			collection(db, "actions"),
			where("topicId", "==", topicId),
			limit(3)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const [postsCollection, postsLoading] = useCollection(
		query(
			collection(db, "posts"),
			where("topicId", "==", topicId),
			limit(3)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
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

								{canUserEdit ? (
									<span className="ml-3.5">
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
									})}
								</ul>
							) : null}
						</div>

						<div className="mt-10">
							<div className="flex items-center">
								<h2 className="text-xl font-medium leading-6 text-black">
									Community
								</h2>

								{canUserEdit ? (
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
								) : null}

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
												href={`/${categoryQuery}/${locationQuery}/community?post=${item.id}`}
											>
												<li className="rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:bg-gray-50">
													<div className="text-xl font-medium text-black">
														{itemData.title}
													</div>

													<div className="mt-10 truncate text-sm font-light text-gray-400">
														{itemData.createdBy}
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

export default Topic;
