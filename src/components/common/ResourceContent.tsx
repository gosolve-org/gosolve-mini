import { useAuth } from "contexts/AuthContext";
import { useResource } from "contexts/ResourceContext";
import dynamic from "next/dynamic";
import { ResourceType } from "models/ResourceType";
import { useCallback } from "react";
import { updateTopic } from "pages/api/topic";
import { updateAction } from "pages/api/action";
import { useNav } from "contexts/NavigationContext";
import { toast } from "react-toastify";

const EditorJs = dynamic(() => import("components/common/Editor"), {
    ssr: false,
});

function ResourceContent()
{
    const { isAuthenticated, hasEditorRights, isUserProfileLoading, user } = useAuth();
    const { resourceType, content, setContent, authorId, actionId, topicId, title, createdAt } = useResource();
    const { currentCategory, currentLocation } = useNav();

    const canUserEdit = hasEditorRights() && (resourceType !== ResourceType.Action || user?.uid === authorId);

    const handleSaveData = useCallback(async (savedData: string) => {
        if (resourceType === ResourceType.Action) {
            await updateAction({
                docId: actionId,
                details: {
                    authorId: user.uid,
                    title: title,
                    topicId: topicId,
                    content: savedData,
                    authorUsername: user.username,
                    createdAt: createdAt,
                    updatedAt: new Date()
                },
                category: currentCategory?.category,
                location: currentLocation?.location
            })
                .then(() => {
                    toast.success("Saved!");
                    setContent(savedData);
                })
                .catch((err) => {
                    toast.error("Something went wrong");
                    console.error(err);
                });
        } else if (resourceType === ResourceType.Topic) {
            await updateTopic({
                docId: topicId,
                details: {
                    title: `${currentCategory.category} in ${currentLocation.location}`,
                    content: savedData,
                    categoryId: currentCategory.id,
                    locationId: currentLocation.id,
                },
                location: currentLocation.location,
                category: currentCategory.category
            })
                .then(() => {
                    toast.success("Saved!");
                    setContent(savedData);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Something went wrong");
                });
        } else {
            console.error("Can't save content, unknown resource type:", resourceType);
            toast.error("Something went wrong");
        }
    }, [currentCategory, currentLocation, resourceType, topicId, title, createdAt, user, actionId, setContent]);

    return (
        <>
            {!!content && (!isUserProfileLoading || !isAuthenticated()) ? (
                <EditorJs
                    readOnly={!canUserEdit}
                    saveData={handleSaveData}
                    defaultValue={content}
                />
            ) : null}
        </>
    );
}

export default ResourceContent;
