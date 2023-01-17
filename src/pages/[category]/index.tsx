import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "context/AuthContext";
import { Layout, Loader } from "components/common";
import { DEFAULT_LOCATION } from "constants/defaultSearches";

function Category() {
	const { user } = useAuth();
	const router = useRouter();

	const readableCategoryId = router?.query?.category
		? router?.query?.category.toString().split("-").join(" ")
		: "";

	useEffect(() => {
		if (user) router.push(`/${readableCategoryId}${DEFAULT_LOCATION}`);
	});

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<Loader />
			</div>
		</Layout>
	);
}

export default Category;
