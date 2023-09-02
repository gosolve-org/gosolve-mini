export interface Post {
    id: string | null;
    title: string | null;
    content: string | null;
    authorId: string | null;
    authorUsername: string | null;
    actionId: string | null;
    topicId: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}
