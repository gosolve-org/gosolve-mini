export interface Category {
    id: string;
    category: string;
    parentId?: string;
    hidden?: boolean;
    imageName: string;
    imagePosition?: string;
    imageTextShadowOpacity?: number;
}
