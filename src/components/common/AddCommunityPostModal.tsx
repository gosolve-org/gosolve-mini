import {
	useState,
	FormEvent,
	SyntheticEvent,
	useContext,
} from "react";
import { useRouter } from "next/router";
import { Dialog } from "@headlessui/react";

import { useAuth } from "context/AuthContext";
import { addPost } from "pages/api/post";
import { ResourceType } from "models/ResourceType";
import { toast } from "react-toastify";
import { toUrlPart } from "utils/textUtils";
import { DataContext } from "context/DataContext";
import { POST_VALIDATIONS } from "constants/validationRules";
import Modal from "./Layout/Modal";

interface AddCommunityPostProps {
	open: boolean;
	onClose: () => void;
	parentResourceType: ResourceType;
	parentResourceId: string;
}

function AddCommunityPostModal({ open, onClose, parentResourceType, parentResourceId }: AddCommunityPostProps) {
	const { user } = useAuth();
	const { currentCategory, currentLocation } = useContext(DataContext);
	const router = useRouter();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const actionId = router?.query?.actionId?.toString() ?? '';

	const handleTitleChange = (e: FormEvent<HTMLInputElement>) =>
		setTitle(e.currentTarget.value);

	const handleDescriptionChange = (e: FormEvent<HTMLTextAreaElement>) =>
		setDescription(e.currentTarget.value);

	const hasChanges = () => !!title && !!location;

	const handleAddCommuntyPostSubmit = async (
		e: SyntheticEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		if (isLoading) return;
		setIsLoading(true);

		const originDetails = {
			[(parentResourceType === ResourceType.Action ? 'actionId' : 'topicId')]: parentResourceId
		};

		try {
			const docId = await addPost({
				details: {
					...originDetails,
					authorId: user?.uid || "",
					title,
					content: description,
					authorUsername: user.username,
					createdAt: new Date()
				},
				category: currentCategory.category,
				location: currentLocation.location
			});

			await router.push(parentResourceType === ResourceType.Topic
				? `/${toUrlPart(currentCategory.category)}/${toUrlPart(currentLocation.location)}/community/${docId}`
				: `/${toUrlPart(currentCategory.category)}/${toUrlPart(currentLocation.location)}/actions/${actionId}/community/${docId}`
			);
		} catch (err) {
			toast.error("Something went wrong");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div className="sm:flex sm:items-start">
				<div className="mt-3 text-left sm:mt-0 ">
					<Dialog.Title
						as="h3"
						className="text-xs text-gray-500 font-normal"
					>
						{`You're creating a post in the community for "${currentCategory?.category} in ${currentLocation?.location}"`}
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
							tabIndex={1}
							autoComplete="off"
							onChange={handleTitleChange}
							maxLength={POST_VALIDATIONS.titleMaxLength}
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
							tabIndex={2}
							onChange={
								handleDescriptionChange
							}
							rows={4}
							maxLength={POST_VALIDATIONS.contentMaxLength}
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
						tabIndex={3}
						disabled={!hasChanges() || isLoading}
						type="submit"
						className="inline-flex w-full justify-center rounded-md disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-indigo-600 border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
					>
						Submit
					</button>
				</div>
			</form>
		</Modal>
	);
}

export default AddCommunityPostModal;
