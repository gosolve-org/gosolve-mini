import * as Sentry from "@sentry/react";
import { useAuth } from "features/Auth/AuthContext";
import { useResource } from "features/Resource/ResourceContext";
import dynamic from "next/dynamic";
import { ResourceType } from "features/Resource/types/ResourceType";
import { useCallback } from "react";
import { updateTopic } from "pages/api/topic";
import { updateAction } from "pages/api/action";
import { useNav } from "features/Nav/NavigationContext";
import { toast } from "react-toastify";
import { AnalyticsEventEnum } from "features/Analytics/AnalyticsEventEnum";
import { useAnalytics } from "features/Analytics/AnalyticsContext";

const EditorJs = dynamic(() => import("features/Editor/Editor"), {
    ssr: false,
});

function ResourceContent() {
    const { isAuthenticated, hasEditorRights, isUserProfileLoading, user } = useAuth();
    const { logAnalyticsEvent } = useAnalytics();
    const { resourceType, content, setContent, authorId, actionId, topicId, title, createdAt } = useResource();
    const { currentCategory, currentLocation } = useNav();
    const canUserEdit = hasEditorRights() && (resourceType !== 'Action' || user?.uid === authorId);

    const handleSaveData = useCallback(async (savedData: string) => {
        if (resourceType === 'Action') {
            logAnalyticsEvent(AnalyticsEventEnum.ActionUpdate, { topicTitle: title });
            await updateAction(actionId, {
                authorId: user.uid,
                title: title,
                topicId: topicId,
                content: savedData,
                authorUsername: user.username,
                createdAt: createdAt,
                updatedAt: new Date()
            })
                .then(() => {
                    toast.success("Saved!");
                    setContent(savedData);
                })
                .catch((err) => {
                    Sentry.captureException(err);
                    toast.error("Something went wrong");
                    console.error(err);
                });
        } else if (resourceType === 'Topic') {
            logAnalyticsEvent(AnalyticsEventEnum.TopicUpdate, { topicTitle: title });
            await updateTopic(topicId, {
                title: `${currentCategory.category} in ${currentLocation.location}`,
                content: savedData,
                categoryId: currentCategory.id,
                locationId: currentLocation.id,
            }, user.username)
                .then(() => {
                    toast.success("Saved!");
                    setContent(savedData);
                })
                .catch((err) => {
                    Sentry.captureException(err);
                    console.error(err);
                    toast.error("Something went wrong");
                });
        } else {
            console.error("Can't save content, unknown resource type:", resourceType);
            toast.error("Something went wrong");
        }
    }, [currentCategory, currentLocation, resourceType, topicId, title, createdAt, user, actionId, setContent, logAnalyticsEvent]);

    return (
        <>
            {!!content && (!isUserProfileLoading || !isAuthenticated()) &&
                <EditorJs
                    readOnly={!canUserEdit}
                    saveData={handleSaveData}
                    defaultValue={content}
                />
            }
        </>
    );
}

export default ResourceContent;
