import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import Layout from "components/common/layout/Layout";
import { toast } from "react-toastify";
import { updateAction } from "pages/api/action";
import { db, useDocumentOnceWithDependencies } from "utils/firebase";
import { useAuth } from "contexts/AuthContext";
import actionEditorTemplate from "editorTemplates/actionEditorTemplate.json"
import BasicHead from "components/common/layout/BasicHead";
import { useNav } from "contexts/NavigationContext";
import Resource from "components/common/Resource";

const EditorJs = dynamic(() => import("components/common/Editor"), {
    ssr: false,
});

function Action() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { currentCategory, currentLocation } = useNav();

    const actionId = router?.query?.actionId?.toString();

    const [userProfile, userLoading] = useDocumentOnceWithDependencies(() => doc(db, `user`, user.uid), [ user?.uid ]);

    const [actionSnapshot, actionsLoading] = useDocumentOnce(doc(db, "actions", actionId));

    const actionContent = actionSnapshot?.data()?.content || JSON.stringify(actionEditorTemplate);
    
    const canUserEdit =
        userProfile?.id === user?.uid &&
        (userProfile?.data()?.role === "admin" ||
            (userProfile?.data()?.role === "editor" && userProfile?.id === actionSnapshot?.data()?.authorId));

    const handleSaveData = async (savedData: string) => {
        await updateAction({
            docId: actionId,
            details: {
                authorId: user.uid,
                title: actionSnapshot?.data()?.title,
                topicId: actionSnapshot?.data()?.topicId,
                content: savedData,
                authorUsername: user.username,
                createdAt: actionSnapshot?.data()?.createdAt,
                updatedAt: new Date()
            },
            category: currentCategory?.category,
            location: currentLocation?.location
        })
            .then(() => toast.success("Saved!"))
            .catch((err) => {
                toast.error("Something went wrong");
                console.error(err);
            });
    };

    return (
        <Layout>
            <BasicHead title={`goSolve | ${actionSnapshot?.data()?.title ?? ''}`} />
            <div className="flex min-h-full flex-col justify-center items-center py-6 sm:py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-screen-2xl">
                    <Resource />
                </div>
            </div>
        </Layout>
    );
}

export default Action;
