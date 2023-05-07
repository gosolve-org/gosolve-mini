import {
    useState,
    FormEvent,
    SyntheticEvent,
    useRef,
} from "react";
import { useRouter } from "next/router";
import { Dialog } from "@headlessui/react";
import { collection, query, where } from "firebase/firestore";

import { addAction } from "pages/api/action";
import { useAuth } from "contexts/AuthContext";
import { db, useCollectionOnceWithDependencies } from "utils/firebase";
import { toast } from "react-toastify";
import { toUrlPart } from "utils/textUtils";
import { ACTION_VALIDATIONS } from "constants/validationRules";
import { useNav } from "contexts/NavigationContext";
import Modal from "../common/layout/Modal";

interface AddActionModalProps {
    open: boolean;
    onClose: () => void;
}

function AddActionModal({ open, onClose }: AddActionModalProps) {
    const { user } = useAuth();
    const router = useRouter();
    const titleInput = useRef(null);
    const { currentCategory, currentLocation } = useNav();

    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [topicsCollection] = useCollectionOnceWithDependencies(
        () => query(
            collection(db, "topics"),
            where("categoryId", "==", currentCategory.id),
            where("locationId", "==", currentLocation.id)
        ), [ currentCategory?.id, currentLocation?.id ]
    );

    const handleTitleChange = (e: FormEvent<HTMLInputElement>) =>
        setTitle(e.currentTarget.value);

    const hasChanges = () => !!title;

    const handleAddActionSubmit = async (
        e: SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        const topicId = topicsCollection?.docs?.[0]?.id;

        const actionTitle = title || titleInput.current.value;

        try {
            const docId = await addAction({
                authorId: user.uid,
                title: actionTitle,
                topicId,
                authorUsername: user.username,
                createdAt: new Date()
            });

            await router.push(
                `/${toUrlPart(currentCategory.category)}/${toUrlPart(currentLocation.location)}/actions/${docId}`
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
                        {`You're creating an action for "${currentCategory?.category} in ${currentLocation?.location}"`}
                    </Dialog.Title>
                </div>
            </div>
            <form
                className="mt-8"
                action="#"
                method="POST"
                onSubmit={handleAddActionSubmit}
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
                            ref={titleInput}
                            maxLength={ACTION_VALIDATIONS.titleMaxLength}
                            type="title"
                            name="title"
                            id="title"
                            className="p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Write a title..."
                        />
                    </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        tabIndex={2}
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

export default AddActionModal;
