import { useRouter } from "next/router";
import Post from "components/pages/Post";
import { ResourceContextProvider } from "contexts/ResourceContext";
import { ResourceType } from "models/ResourceType";

function ActionCommunityPostPage() {
    const router = useRouter();
    const postId = router?.query?.postId?.toString();

    return (
        <ResourceContextProvider resourceType={ResourceType.Action}>
            <Post
                postId={postId}
            />
        </ResourceContextProvider>
    );
}

export default ActionCommunityPostPage;
