import { collection, doc, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { db, useCollectionOnceWithDependencies, useDocumentOnceWithDependencies } from "utils/firebase";
import actionEditorTemplate from "editorTemplates/actionEditorTemplate.json";
import { ResourceType } from "models/ResourceType";
import { useNav } from "./NavigationContext";

interface ResourceContext {
    resourceType: ResourceType;
    content: string;
    setContent: Dispatch<SetStateAction<string>>;
    authorId: string;
    title: string;
    createdAt: Date;
    topicId: string;
    actionId: string;
    focusedEditorElementIndex?: number;
    setFocusedEditorElementIndex: Dispatch<SetStateAction<Number>>;
}

const ResourceContext = createContext<ResourceContext>({
    resourceType: null,
    content: null,
    setContent: null,
    authorId: null,
    title: null,
    createdAt: null,
    topicId: null,
    actionId: null,
    focusedEditorElementIndex: null,
    setFocusedEditorElementIndex: null,
});

export const ResourceContextProvider = ({ children, resourceType }: { children: ReactNode, resourceType: ResourceType }) => {
    const router = useRouter();
    const { currentCategory, currentLocation } = useNav();
    const [content, setContent] = useState<string>(null);
    const [focusedEditorElementIndex, setFocusedEditorElementIndex] = useState<number>(null);

    const [topicsCollection] = useCollectionOnceWithDependencies(
        () => query(
            collection(db, "topics"),
            where("categoryId", "==", currentCategory.id),
            where("locationId", "==", currentLocation.id)
        ), [ currentCategory?.id, currentLocation?.id ]
    );

    const topicId = topicsCollection?.docs?.[0]?.id || null;
    const actionId = router?.query?.actionId?.toString();

    const [actionSnapshot, isActionSnapshotLoading] = useDocumentOnceWithDependencies(() => doc(db, "actions", actionId), [ actionId ]);

    let foundContent: string;
    let authorId: string;
    let title: string;
    let createdAt: Date;
    switch (resourceType)
    {
        case ResourceType.Action:
            const actionData = !isActionSnapshotLoading ? actionSnapshot?.data() : null;
            foundContent = !isActionSnapshotLoading ? (actionData?.content || JSON.stringify(actionEditorTemplate)) : null;
            authorId = actionData?.authorId;
            createdAt = actionData?.createdAt;
            title = actionData?.title;
            break;
        case ResourceType.Topic:
            const topicData = topicsCollection?.docs?.[0]?.data();
            foundContent = topicData?.content;
            createdAt = topicData?.createdAt;
            title = topicData?.title;
            break;
        default:
            foundContent = null;
            break;
    }

    useEffect(() => {
        if (foundContent != null) {
            setContent(foundContent);
        }
    }, [setContent, foundContent]);


    return (
        <ResourceContext.Provider
            value={{
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
            }}
        >
            {children}
        </ResourceContext.Provider>
    );
};

export const useResource = () => {
    const context = useContext(ResourceContext);

    if (context === undefined) {
        throw new Error("useResource must be used within a ResourceContextProvider");
    }

    return context;
};
