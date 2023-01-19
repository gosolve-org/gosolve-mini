import {
	Fragment,
	useState,
	FormEvent,
	useContext,
	SyntheticEvent,
} from "react";
import { useRouter } from "next/router";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, query, where, doc } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { useAuth } from "context/AuthContext";
import { db } from "utils/firebase";
import { DataContext } from "pages/_app";
import { addPost } from "pages/api/post";

interface AddCommunityPostProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

function AddCommunityPost({ open, setOpen }: AddCommunityPostProps) {
	const { user } = useAuth();
	const router = useRouter();
	const { currentCategoryId, currentLocationId } = useContext(DataContext);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const [topicsCollection] = useCollection(
		query(
			collection(db, "topics"),
			where("categoryId", "==", currentCategoryId),
			where("locationId", "==", currentLocationId)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const [userProfile] = useDocument(doc(db, `user`, user?.uid || ""), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const categoryQuery = router?.query?.category
		? router?.query?.category.toString()
		: "...";
	const locationQuery = router?.query?.location
		? router?.query?.location.toString()
		: "...";
	const actionId = router?.query?.action
		? router?.query?.action.toString()
		: "";

	const readableCategoryId = categoryQuery.split("-").join(" ");
	const readableLocationId = locationQuery.split("-").join(" ");

	const handleTitleChange = (e: FormEvent<HTMLInputElement>) =>
		setTitle(e.currentTarget.value);

	const handleDescriptionChange = (e: FormEvent<HTMLTextAreaElement>) =>
		setDescription(e.currentTarget.value);

	const hasChanges = () => !!title && !!location;

	const handleAddCommuntyPostSubmit = async (
		e: SyntheticEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		const topicId = topicsCollection?.docs?.[0]?.id || "";
		const originDetails = actionId ? { actionId } : { topicId };

		await addPost({
			details: {
				...originDetails,
				authorId: user?.uid || "",
				title,
				content: description,
				authorUsername: userProfile?.data()?.username,
			},
		}).then((docId) => {
			setOpen(false);
			router.push(
				`/${categoryQuery}/${locationQuery}/community?post=${docId}`
			);
		});
	};

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all my-8 p-6 w-full max-w-3xl">
								<div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
									<button
										type="button"
										className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										onClick={() => setOpen(false)}
									>
										<span className="sr-only">Close</span>
										<XMarkIcon
											className="h-6 w-6"
											aria-hidden="true"
										/>
									</button>
								</div>
								<div className="sm:flex sm:items-start">
									<div className="mt-3 text-left sm:mt-0 ">
										<Dialog.Title
											as="h3"
											className="text-xs text-gray-500 font-normal truncate"
										>
											{`You're creating a post in the community for "${readableCategoryId} in ${readableLocationId}"`}
										</Dialog.Title>
									</div>
								</div>
								<form
									action="#"
									method="POST"
									className="mt-8"
									onSubmit={handleAddCommuntyPostSubmit}
								>
									<div>
										<label
											htmlFor="title"
											className="block text-m font-medium text-black"
										>
											Title
										</label>
										<div className="mt-1">
											<input
												onChange={handleTitleChange}
												type="title"
												name="title"
												id="title"
												className="p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												placeholder="Write a title..."
											/>
										</div>
									</div>
									<div className="mt-6">
										<label
											htmlFor="description"
											className="block text-m font-medium text-black"
										>
											Description
										</label>
										<div className="mt-1">
											<textarea
												onChange={
													handleDescriptionChange
												}
												rows={4}
												name="description"
												id="description"
												className="p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												defaultValue={""}
												placeholder="Write a comment..."
											/>
										</div>
									</div>
									<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
										<button
											disabled={!hasChanges()}
											type="submit"
											className="inline-flex w-full justify-center rounded-md disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-indigo-600 border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
										>
											Submit
										</button>
									</div>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}

export default AddCommunityPost;
