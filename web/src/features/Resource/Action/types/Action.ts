export interface Action {
    id: string | null;
    title: string | null;
    content: string | null;
    topicId: string | null;
    authorId: string | null;
    authorUsername: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}
