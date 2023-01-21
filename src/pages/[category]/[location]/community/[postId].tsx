import { useRouter } from "next/router";
import Post from "components/pages/category/location/Post";
import { ResourceType } from "models/ResourceType";

function TopicCommunityPostPage() {
	const router = useRouter();
	const postId = router?.query?.postId?.toString() ?? '';

	return <Post
        postId={postId}
    />;
}

export default TopicCommunityPostPage;
