import { CategorySearchResult, LocationSearchResult } from "contexts/InstantSearchContext";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Category } from "models/Category";
import { Location } from "models/Location";

export const docToCategory =
    (document: QueryDocumentSnapshot<DocumentData>): Category => {
        if (!document.exists()) return null;

        const data = document.data();
        return {
            id: document.id,
            category: data.category,
            imageName: data.imageName,
            imagePosition: data.imagePosition,
            imageTextShadowOpacity: data.imageTextShadowOpacity,
            hidden: data.hidden,
            parentId: data.parentId,
        };
    };

export const docToLocation =
    (document: QueryDocumentSnapshot<DocumentData>): Location => {
        if (!document.exists()) return null;

        const data = document.data();
        return {
            id: document.id,
            location: data.location,
            hidden: data.hidden,
            parentId: data.parentId,
            population: data.population,
        };
    }

export const meiliHitsToLocationSearchResults = (hits: any[]): LocationSearchResult[] => {
    if (!hits) return [];

    return hits.filter(el => el).map(hit => ({
        ...hit,
        id: hit.id?.toString(),
        targetId: hit.targetId?.toString(),
    }));
};

export const meiliHitsToCategorySearchResults = (hits: any[]): CategorySearchResult[] => {
    if (!hits) return [];

    return hits.filter(el => el).map(hit => ({
        ...hit,
        id: hit.id?.toString(),
    }));
}
