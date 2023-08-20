export interface Comment {
    id?: string;
    content?: string;
    authorId?: string;
    authorUsername?: string;
    postId?: string;
    parentId?: string;
    updatedAt?: Date;
    createdAt?: Date;
}
