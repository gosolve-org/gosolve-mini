import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "context/AuthContext";
import { Layout, Loader } from "components/common";
import { DEFAULT_LOCATION } from "constants/defaultSearches";

function Topic() {
	const { user } = useAuth();
	const router = useRouter();

	const readableTopicId = router?.query?.topic
		? router?.query?.topic.toString().split("-").join(" ")
		: "";

	useEffect(() => {
		if (user) router.push(`/${readableTopicId}${DEFAULT_LOCATION}`);
	});

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<Loader />
			</div>
		</Layout>
	);
}

export default Topic;
