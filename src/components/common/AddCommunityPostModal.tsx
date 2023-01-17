import { Fragment } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AddCommunityPostProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

function AddCommunityPost({ open, setOpen }: AddCommunityPostProps) {
	const router = useRouter();
	const categoryId = router?.query?.category
		? router?.query?.category.toString()
		: "...";
	const locationId = router?.query?.location
		? router?.query?.location.toString()
		: "...";

	const readableCategoryId = categoryId.split("-").join(" ");
	const readableLocationId = locationId.split("-").join(" ");

	const handleAddCommuntyPostSubmit = () => {};

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
											htmlFor="comment"
											className="block text-m font-medium text-black"
										>
											Add your comment
										</label>
										<div className="mt-1">
											<textarea
												rows={4}
												name="comment"
												id="comment"
												className="p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												defaultValue={""}
												placeholder="Write a comment..."
											/>
										</div>
									</div>
									<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
										<button
											type="submit"
											className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
											onClick={() => setOpen(false)}
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
