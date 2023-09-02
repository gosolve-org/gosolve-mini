import type SearchResultType from './SearchResultType';

interface SearchResultHit {
    id: string;
    type: SearchResultType;
    actionId: string | null;
    location: string;
    category: string;
    title: string | null;
    authorUsername: string | null;
    createdAt: string | null;
}

export default SearchResultHit;
