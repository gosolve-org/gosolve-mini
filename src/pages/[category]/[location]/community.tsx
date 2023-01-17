import { useRouter } from "next/router";
import SinglePost from "components/pages/category/location/SinglePost";
import MultiplePosts from "components/pages/category/location/MultipllePosts";

function Community() {
	const router = useRouter();
	const postId = router?.query?.post ? router?.query?.post.toString() : "";

	const renderPage = () => {
		if (postId) {
			return <SinglePost />;
		}

		return <MultiplePosts />;
	};

	return <>{renderPage()}</>;
}

export default Community;
