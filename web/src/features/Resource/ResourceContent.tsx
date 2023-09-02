import * as Sentry from '@sentry/react';
import { useAuth } from 'features/Auth/AuthContext';
import { useResource } from 'features/Resource/ResourceContext';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { updateTopic } from 'pages/api/topic';
import { updateAction } from 'pages/api/action';
import { useNav } from 'features/Nav/NavigationContext';
import { toast } from 'react-toastify';
import { AnalyticsEventEnum } from 'features/Analytics/AnalyticsEventEnum';
import { useAnalytics } from 'features/Analytics/AnalyticsContext';

const EditorJs = dynamic(async () => import('features/Editor/Editor'), {
    ssr: false,
});

const ResourceContent = () => {
    const { isAuthenticated, hasEditorRights, isUserProfileLoading, user } = useAuth();
    const { logAnalyticsEvent } = useAnalytics();
    const { resourceType, content, setContent, authorId, actionId, topicId, title, createdAt } =
        useResource();
    const { currentCategory, currentLocation } = useNav();
    const canUserEdit = hasEditorRights() && (resourceType !== 'Action' || user?.uid === authorId);

    const handleSaveData = useCallback(
        async (savedData: string) => {
            if (!user?.isOnboarded || !topicId) return;

            if (resourceType === 'Action') {
                if (!actionId) return;
                logAnalyticsEvent(AnalyticsEventEnum.ActionUpdate, { topicTitle: title });
                await updateAction(actionId, {
                    id: actionId,
                    authorId: user.uid,
                    title,
                    topicId,
                    content: savedData,
                    authorUsername: user.username,
                    createdAt,
                    updatedAt: new Date(),
                })
                    .then(() => {
                        toast.success('Saved!');
                        setContent(savedData);
                    })
                    .catch((err) => {
                        Sentry.captureException(err);
                        toast.error('Something went wrong');
                        console.error(err);
                    });
            } else if (resourceType === 'Topic') {
                logAnalyticsEvent(AnalyticsEventEnum.TopicUpdate, { topicTitle: title });
                await updateTopic(
                    topicId,
                    {
                        id: topicId,
                        title: `${currentCategory.category} in ${currentLocation.location}`,
                        content: savedData,
                        categoryId: currentCategory.id,
                        locationId: currentLocation.id,
                        updatedAt: new Date(),
                    },
                    user.username!,
                )
                    .then(() => {
                        toast.success('Saved!');
                        setContent(savedData);
                    })
                    .catch((err) => {
                        Sentry.captureException(err);
                        console.error(err);
                        toast.error('Something went wrong');
                    });
            } else {
                console.error("Can't save content, unknown resource type:", resourceType);
                toast.error('Something went wrong');
            }
        },
        [
            currentCategory,
            currentLocation,
            resourceType,
            topicId,
            title,
            createdAt,
            user,
            actionId,
            setContent,
            logAnalyticsEvent,
        ],
    );

    if (!content || (isAuthenticated() && isUserProfileLoading)) return null;

    return <EditorJs readOnly={!canUserEdit} saveData={handleSaveData} defaultValue={content} />;
};

export default ResourceContent;
