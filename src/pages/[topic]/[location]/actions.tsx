import { useRouter } from "next/router";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PlusIcon,
} from "@heroicons/react/20/solid";

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

function Actions() {
	const router = useRouter();
	const routerPathname = router.pathname;

	const handleAddActionClick = () => {};

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="min-w-[75%]">
					<div className="flex items-center">
						<h2 className="text-2xl font-xl font-semibold leading-6 text-black">
							Actions
						</h2>
						<span className="mx-3.5">
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
					</div>

					<ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
						{actions.map((item) => (
							<li
								key={item.name}
								className="rounded-lg bg-white px-4 py-5 shadow sm:p-6"
							>
								<div className="text-xl font-medium text-black">
									{item.name}
								</div>

								<div className="mt-16 truncate text-sm font-light text-gray-400">
									{item.location}
								</div>
							</li>
						))}
					</ul>

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
		</Layout>
	);
}

export default Actions;
