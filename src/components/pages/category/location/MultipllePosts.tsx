import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PlusIcon,
} from "@heroicons/react/20/solid";

import { Layout, AddCommunityPostModal } from "components/common";

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

function MultiplePosts() {
	const [addCommunityPostModalOpen, setAddCommunityPostModalOpen] =
		useState(false);

	const router = useRouter();

	const categoryId = router?.query?.category
		? router?.query?.category.toString()
		: "...";
	const locationId = router?.query?.location
		? router?.query?.location.toString()
		: "...";

	const handleAddCommunityClick = () => setAddCommunityPostModalOpen(true);

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-4xl">
					<div className="flex items-center">
						<h2 className="text-2xl font-xl font-semibold leading-6 text-black">
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
					</div>

					<dl className="mt-6 flex flex-col items-center justify-center w-full max-w-4xl gap-5">
						{communities.map((item) => (
							<Link
								href={`/${categoryId}/${locationId}/community?post=${item.id}`}
								className="bg-white hover:bg-gray-50 px-4 py-5 sm:px-6 rounded-lg shadow mb w-full"
								key={item.id}
							>
								<h4 className="text-2xl mb-4">{item.title}</h4>
								<div className="flex space-x-3 justify-center items-center  mb-4">
									<div className="flex-shrink-0">
										<img
											className="h-7 w-7 rounded-full"
											src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
											alt=""
										/>
									</div>
									<div className="min-w-0 flex-1">
										<span className="text-sm font-medium text-gray-900">
											{item.createdBy}
										</span>
										<span className="text-sm text-gray-500 ml-4">
											{item.createdAt}
										</span>
									</div>
								</div>
								<p className="text-sm text-gray-500 mb-1">
									{item.description}
								</p>
							</Link>
						))}
					</dl>
					<div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-10">
						<div className="flex flex-1 justify-between sm:hidden">
							<a
								href="#"
								className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								Previous
							</a>
							<a
								href="#"
								className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								Next
							</a>
						</div>
						<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-gray-700">
									Showing{" "}
									<span className="font-medium">1</span> to{" "}
									<span className="font-medium">10</span> of{" "}
									<span className="font-medium">97</span>{" "}
									results
								</p>
							</div>
							<div>
								<nav
									className="isolate inline-flex -space-x-px rounded-md shadow-sm"
									aria-label="Pagination"
								>
									<a
										href="#"
										className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
									>
										<span className="sr-only">
											Previous
										</span>
										<ChevronLeftIcon
											className="h-5 w-5"
											aria-hidden="true"
										/>
									</a>
									{/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
									<a
										href="#"
										aria-current="page"
										className="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
									>
										1
									</a>
									<a
										href="#"
										className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
									>
										2
									</a>
									<a
										href="#"
										className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex"
									>
										3
									</a>
									<span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
										...
									</span>
									<a
										href="#"
										className="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex"
									>
										8
									</a>
									<a
										href="#"
										className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
									>
										9
									</a>
									<a
										href="#"
										className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
									>
										10
									</a>
									<a
										href="#"
										className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
									>
										<span className="sr-only">Next</span>
										<ChevronRightIcon
											className="h-5 w-5"
											aria-hidden="true"
										/>
									</a>
								</nav>
							</div>
						</div>
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

export default MultiplePosts;
