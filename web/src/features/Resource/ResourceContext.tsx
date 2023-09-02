import { collection, doc, query, where } from 'firebase/firestore';
import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
    useEffect,
    useState,
    useMemo,
} from 'react';
import {
    db,
    useCollectionOnceWithDependencies,
    useDocumentOnceWithDependencies,
} from 'utils/firebase';
import actionEditorTemplate from 'features/Editor/actionEditorTemplate.json';
import { type ResourceType } from 'features/Resource/types/ResourceType';
import { useNav } from '../Nav/NavigationContext';

interface ResourceContext {
    resourceType: ResourceType;
    content: string | null;
    setContent: Dispatch<SetStateAction<string>>;
    authorId: string | null;
    title: string | null;
    createdAt: Date | null;
    topicId: string | null;
    actionId: string | null;
    focusedEditorElementIndex?: number | null;
    setFocusedEditorElementIndex: Dispatch<SetStateAction<number>>;
}

const ResourceContext = createContext<ResourceContext | null>(null);

export const ResourceContextProvider = ({
    children,
    resourceType,
}: {
    children: ReactNode;
    resourceType: ResourceType;
}) => {
    const { goToNotFoundPage, router } = useNav();
    const { currentCategory, currentLocation } = useNav();
    const [content, setContent] = useState<string | null>(null);
    const [focusedEditorElementIndex, setFocusedEditorElementIndex] = useState<number | null>(null);

    const [topicsCollection, isTopicLoading] = useCollectionOnceWithDependencies(
        () =>
            query(
                collection(db, 'topics'),
                where('categoryId', '==', currentCategory.id),
                where('locationId', '==', currentLocation.id),
            ),
        [currentCategory?.id, currentLocation?.id],
    );

    if (!isTopicLoading && (!topicsCollection || topicsCollection?.docs?.length === 0)) {
        goToNotFoundPage();
    }

    const topicId = topicsCollection?.docs?.[0]?.id || null;
    const actionId = router?.query?.actionId?.toString() || null;

    const [actionSnapshot, isActionSnapshotLoading] = useDocumentOnceWithDependencies(
        () => doc(db, 'actions', actionId!),
        [actionId],
    );

    let foundContent: string | null = null;
    let authorId: string | null = null;
    let title: string | null = null;
    let createdAt: Date | null = null;
    switch (resourceType) {
        case 'Action': {
            const actionData = !isActionSnapshotLoading ? actionSnapshot?.data() : null;
            foundContent = !isActionSnapshotLoading
                ? actionData?.content || JSON.stringify(actionEditorTemplate)
                : null;
            authorId = actionData?.authorId;
            createdAt = actionData?.createdAt;
            title = actionData?.title;
            break;
        }
        case 'Topic': {
            const topicData = topicsCollection?.docs?.[0]?.data();
            foundContent = topicData?.content;
            createdAt = topicData?.createdAt;
            title = topicData?.title;
            break;
        }
        default: {
            foundContent = null;
            break;
        }
    }

    useEffect(() => {
        setContent(foundContent);
    }, [setContent, foundContent]);

    const providerValue = useMemo(
        () => ({
            resourceType,
            content,
            setContent,
            authorId,
            createdAt,
            title,
            topicId,
            actionId,
            focusedEditorElementIndex,
            setFocusedEditorElementIndex,
        }),
        [
            resourceType,
            content,
            setContent,
            authorId,
            createdAt,
            title,
            topicId,
            actionId,
            focusedEditorElementIndex,
            setFocusedEditorElementIndex,
        ],
    );

    return <ResourceContext.Provider value={providerValue}>{children}</ResourceContext.Provider>;
};

export const useResource = () => {
    const context = useContext(ResourceContext);

    if (context == null) {
        throw new Error('useResource must be used within a ResourceContextProvider');
    }

    return context;
};
