import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/20/solid";

import { AddCommunityPostModal } from "components/common";

const EditorJs = dynamic(() => import("components/common/Editor"), {
	ssr: false,
});

import { Layout } from "components/common";

const actions = [
	{
		name: "Fundraiser for Cancer Research",
		location: "Los Angeles Children’s Hospital",
	},
	{
		name: "Fundraiser for Cancer Research",
		location: "Los Angeles Children’s Hospital",
	},
	{
		name: "Fundraiser for Cancer Research",
		location: "Los Angeles Children’s Hospital",
	},
];

const communities = [
	{
		title: "Fundraiser for Cancer Research",
		createdBy: "Barack Obama",
		createdAt: "December 9 at 11:43 AM",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus sit amet est placerat in egestas",
	},
	{
		title: "Fundraiser for Cancer Research",
		createdBy: "Barack Obama",
		createdAt: "December 9 at 11:43 AM",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus sit amet est placerat in egestas",
	},
	{
		title: "Fundraiser for Cancer Research",
		createdBy: "Barack Obama",
		createdAt: "December 9 at 11:43 AM",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus sit amet est placerat in egestas",
	},
];

function Topic() {
	const [addCommunityPostModalOpen, setAddCommunityPostModalOpen] =
		useState(false);

	const router = useRouter();

	const topicId = router?.query?.topic
		? router?.query?.topic.toString()
		: "...";
	const locationId = router?.query?.location
		? router?.query?.location.toString()
		: "...";

	const readableTopicId = topicId.split("-").join(" ");
	const readableLocationId = locationId.split("-").join(" ");

	const handleAddCommunityClick = () => setAddCommunityPostModalOpen(true);

	const handleSaveClick = () => {};

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="min-w-[75%]">
					<div className="bg-gray-100 p-6 rounded-lg">
						<div>
							<div className="flex items-center">
								<h2 className="text-xl font-medium leading-6 text-black">
									Actions
								</h2>
								<span className="mx-3.5">
									<Link
										href={`/${topicId}/${locationId}/actions`}
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
							<ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
								{actions.map((item) => (
									<Link
										key={item.name}
										href={`/${topicId}/${locationId}/actions`}
									>
										<li className="rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:bg-gray-50">
											<div className="text-xl font-medium text-black">
												{item.name}
											</div>

											<div className="mt-10 truncate text-sm font-light text-gray-400">
												{item.location}
											</div>
										</li>
									</Link>
								))}
							</ul>
						</div>

						<div className="mt-10">
							<div className="flex items-center">
								<h2 className="text-xl font-medium leading-6 text-black">
									Community
								</h2>
								<span className="mx-3.5">
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
								<span className="mr-3.5">
									<Link
										href={`/${topicId}/${locationId}/community`}
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
							<ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
								{communities.map((item) => (
									<Link
										key={item.title}
										href={`/${topicId}/${locationId}/community`}
									>
										<li className="rounded-lg bg-white px-4 py-5 shadow sm:p-6 hover:bg-gray-50">
											<div className="text-xl font-medium text-black">
												{item.title}
											</div>

											<div className="mt-10 truncate text-sm font-light text-gray-400">
												{item.createdBy}
											</div>
										</li>
									</Link>
								))}
							</ul>
						</div>
					</div>

					<div className="mt-10">
						<EditorJs />
					</div>

					<div className="mt-6 flex justify-center items-center w-full gap-4">
						<button
							onClick={handleSaveClick}
							type="button"
							className="text-xs font-light inline-flex items-center rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-black shadow-sm hover:bg-indigo-500 hover:border-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Save changes
						</button>
					</div>
				</div>
			</div>

			<AddCommunityPostModal
				open={addCommunityPostModalOpen}
				setOpen={setAddCommunityPostModalOpen}
			/>
		</Layout>
	);
}

export default Topic;
