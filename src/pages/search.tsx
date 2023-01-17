import { useRouter } from "next/router";
import Link from "next/link";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PlusIcon,
} from "@heroicons/react/20/solid";

import { Layout } from "components/common";

const searchResults = [
	{
		title: "Fundraiser for Cancer Research",
		createdBy: "Barack Obama",
		createdAt: "December 9 at 11:43 AM",
		Type: "Post",
	},
	{
		title: "Fundraiser for Cancer Research",
		createdBy: "Barack Obama",
		createdAt: "December 9 at 11:43 AM",
		type: "Action",
	},
	{
		title: "Fundraiser for Cancer Research",
		createdBy: "Barack Obama",
		createdAt: "December 9 at 11:43 AM",
		type: "Category",
	},
];

function Search() {
	const router = useRouter();
	const routerPathname = router.pathname;

	const searchQuery = router?.query?.q ? router?.query?.q.toString() : "";

	const readableSearch = searchQuery.split("+").join(" ");

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="min-w-[75%]">
					<div className="flex items-center">
						<h2 className="text-2xl font-xl font-semibold leading-6 text-black">
							{`Search for "${readableSearch}"`}
						</h2>
					</div>

					<dl className="mt-6 flex flex-col w-full gap-5">
						{searchResults.map((item) => (
							<Link
								href="/"
								className="bg-white hover:bg-gray-50 px-4 py-5 sm:px-6 rounded-lg shadow mb"
								key={item.title}
							>
								<h4 className="text-2xl mb-4">{item.title}</h4>

								<p className="text-sm text-gray-500 mb-1">
									{item.type}
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
		</Layout>
	);
}

export default Search;
