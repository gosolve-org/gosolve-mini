import { useRouter } from "next/router";

import { Layout } from "components/common";

const actions = [
	{ name: "Fundraiser for Cancer Research" },
	{ name: "Fundraiser for Cancer Research" },
	{ name: "Fundraiser for Cancer Research" },
];

function Topic() {
	const router = useRouter();
	const routerPathname = router.pathname;

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div>
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Actions
					</h3>
					<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
						{actions.map((item) => (
							<div
								key={item.name}
								className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
							>
								<dt className="truncate text-sm font-medium text-gray-500">
									{item.name}
								</dt>
							</div>
						))}
					</dl>
				</div>

				<div className="mt-10">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Community
					</h3>
					<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
						{actions.map((item) => (
							<div
								key={item.name}
								className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
							>
								<dt className="truncate text-sm font-medium text-gray-500">
									{item.name}
								</dt>
							</div>
						))}
					</dl>
				</div>
			</div>
		</Layout>
	);
}

export default Topic;
