import { useRouter } from "next/router";

import { Layout } from "components/common";

function Topic() {
	const router = useRouter();
	const routerPathname = router.pathname;

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h1 className="mt-6 px-4 py-2 text-center text-xl font-small tracking-tight text-black ">
						{routerPathname}
					</h1>
				</div>
			</div>
		</Layout>
	);
}

export default Topic;
