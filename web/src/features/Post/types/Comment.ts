export interface Comment {
    id: string | null;
    content: string | null;
    authorId: string | null;
    authorUsername: string | null;
    postId: string | null;
    parentId: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}
