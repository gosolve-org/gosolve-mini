import type SearchResult from 'features/Search/types/SearchResult';
import { wrappedHttpsCallable } from 'utils/firebase';

const searchFunction: (params: any) => Promise<SearchResult> = wrappedHttpsCallable('search') as (
    params: any,
) => Promise<SearchResult>;

export const search = async (
    query: {
        query: string;
        categoryIdFilter?: string;
        locationIdFilter?: string;
    },
    options: {
        offset: number;
        limit: number;
    },
) => {
    const results = await searchFunction({ query, options });

    return results;
};
