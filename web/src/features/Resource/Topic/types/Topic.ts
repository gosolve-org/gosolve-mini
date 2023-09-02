export interface Topic {
    id: string | null;
    title: string | null;
    content: string | null;
    locationId: string | null;
    categoryId: string | null;
    updatedAt: Date | null;
    createdAt?: Date | null;
}
