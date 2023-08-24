import { useRouter } from "next/router";
import Post from "features/Post/Post";
import { ResourceContextProvider } from "features/Resource/ResourceContext";
import { ResourceType } from "features/Resource/types/ResourceType";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "utils/firebase";
import BasicHead from "common/components/layout/BasicHead";
import Layout from "common/components/layout/Layout";

function TopicCommunityPostPage() {
    const router = useRouter();
    const postId = router?.query?.postId?.toString();

    const [postData] = useDocumentOnce(doc(db, "posts", postId));
    const postDoc = postData?.data();

    return (
        <>
            <BasicHead title={`goSolve | ${postDoc?.title ?? ''}`} />
            <ResourceContextProvider resourceType={'Topic'}>
                <Layout>
                    <Post
                        postId={postId}
                    />
                </Layout>
            </ResourceContextProvider>
        </>
    );
}

export default TopicCommunityPostPage;
