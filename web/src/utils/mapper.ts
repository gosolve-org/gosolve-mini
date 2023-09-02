import { type Category } from 'common/models/Category';
import { type Location } from 'common/models/Location';
import {
    type CategorySearchResult,
    type LocationSearchResult,
} from 'features/Search/InstantSearchContext';
import { type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';

export const docToCategory = (document: QueryDocumentSnapshot<DocumentData>): Category | null => {
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

export const docToLocation = (document: QueryDocumentSnapshot<DocumentData>): Location | null => {
    if (!document.exists()) return null;

    const data = document.data();
    return {
        id: document.id,
        location: data.location,
        hidden: data.hidden,
        parentId: data.parentId,
        population: data.population,
    };
};

export const meiliHitsToLocationSearchResults = (hits?: any[]): LocationSearchResult[] => {
    if (hits == null) return [];

    return hits
        .filter((el) => el)
        .map((hit) => ({
            ...hit,
            id: hit.id?.toString(),
            targetId: hit.targetId?.toString(),
        }));
};

export const meiliHitsToCategorySearchResults = (hits?: any[]): CategorySearchResult[] => {
    if (hits == null) return [];

    return hits
        .filter((el) => el)
        .map((hit) => ({
            ...hit,
            id: hit.id?.toString(),
        }));
};

export const countryLocationToSearchResult = (location: Location): LocationSearchResult => ({
    id: location.id,
    name: location.location,
    asciiName: location.location,
    adminDivisionTargetLevel: 0,
    targetName: location.location,
    targetId: location.id,
    featureClass: null,
    featureCode: null,
    adminCode1: null,
    adminCode2: null,
    adminCode3: null,
    adminCode4: null,
});

export const categoryToSearchResult = (category: Category): CategorySearchResult => ({
    id: category.id,
    name: category.category,
});
