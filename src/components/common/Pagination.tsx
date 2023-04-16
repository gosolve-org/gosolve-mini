import { useRouter } from "next/router";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface PaginationProps {
	pageSize?: number;
	totalCount?: number;
}

function Pagination({ pageSize = 10, totalCount = 0 }: PaginationProps) {
	const router = useRouter();
	const pathname = router.pathname;
	const routerQuery = router.query;

	const pageQuery = routerQuery?.page
		? parseInt(routerQuery?.page.toString()) || 1
		: 1;

	const pageCount = Math.ceil(totalCount / pageSize);
	const firstIndexOnPage = (pageQuery - 1) * pageSize + 1;
	const isLastPage = pageQuery === pageCount;
	const lastIndexOnPage = isLastPage
		? (totalCount % pageSize === 0 ? pageSize : totalCount % pageSize) +
		  pageSize * (pageQuery - 1)
		: pageSize * pageQuery;

	const renderPageControls = () => {
		if (totalCount <= pageSize) return null;

		return (
			<nav
				className="isolate inline-flex -space-x-px rounded-md shadow-sm"
				aria-label="Pagination"
			>
				{firstIndexOnPage - 3 * pageSize - 1 >= 0 ? (
					<Link
						href={{
							pathname,
							query: { ...routerQuery, page: pageQuery - 3 },
						}}
						className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>
						<span className="sr-only">Previous</span>
						<ChevronLeftIcon
							className="h-5 w-5"
							aria-hidden="true"
						/>
					</Link>
				) : null}

				{firstIndexOnPage - 2 * pageSize - 1 >= 0 ? (
					<Link
						href={{
							pathname,
							query: { ...routerQuery, page: pageQuery - 2 },
						}}
						aria-current="page"
						className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>
						{pageQuery - 2}
					</Link>
				) : null}

				{firstIndexOnPage - pageSize - 1 >= 0 ? (
					<Link
						href={{
							pathname,
							query: { ...routerQuery, page: pageQuery - 1 },
						}}
						aria-current="page"
						className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>
						{pageQuery - 1}
					</Link>
				) : null}

				<Link
					href={{
						pathname,
						query: { ...routerQuery, page: pageQuery - 1 },
					}}
					aria-current="page"
					className="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
				>
					{pageQuery}
				</Link>

				{lastIndexOnPage < totalCount ? (
					<Link
						href={{
							pathname,
							query: { ...routerQuery, page: pageQuery + 1 },
						}}
						aria-current="page"
						className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>
						{pageQuery + 1}
					</Link>
				) : null}

				{lastIndexOnPage + pageSize < totalCount ? (
					<Link
						href={{
							pathname,
							query: { ...routerQuery, page: pageQuery + 2 },
						}}
						aria-current="page"
						className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>
						{pageQuery + 2}
					</Link>
				) : null}

				{lastIndexOnPage + 2 * pageSize < totalCount ? (
					<Link
						href={{
							pathname,
							query: { ...routerQuery, page: pageQuery + 3 },
						}}
						aria-current="page"
						className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>
						<span className="sr-only">Next</span>
						<ChevronRightIcon
							className="h-5 w-5"
							aria-hidden="true"
						/>
					</Link>
				) : null}
			</nav>
		);
	};

	return (
		<div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-10">
			<div className="flex flex-1 justify-between sm:hidden">
				{firstIndexOnPage - pageSize - 1 >= 0 ? (
					<Link
						href={{
							pathname,
							query: { ...routerQuery, page: pageQuery - 1 },
						}}
						aria-current="page"
						className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						Previous
					</Link>
				) : null}
				{lastIndexOnPage + pageSize <= totalCount ? (
					<Link
						href={{
							pathname,
							query: { ...routerQuery, page: pageQuery + 1 },
						}}
						aria-current="page"
						className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						Next
					</Link>
				) : null}
			</div>
			<div className="hidden sm:flex sm:flex-1 items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-700">
						Showing{" "}
						{totalCount === 0 ? null : (
							<>
								<span className="font-medium">
									{firstIndexOnPage}
								</span>{" "}
								{lastIndexOnPage !== 1 ? (
									<>
										to{" "}
										<span className="font-medium">
											{lastIndexOnPage}
										</span>{" "}
									</>
								) : null}
								of{" "}
							</>
						)}
						<span className="font-medium">{totalCount}</span>{" "}
						results
					</p>
				</div>
				<div>{renderPageControls()}</div>
			</div>
		</div>
	);
}

export default Pagination;
