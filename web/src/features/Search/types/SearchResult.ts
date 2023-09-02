import type SearchResultHit from './SearchResultHit';

interface SearchResult {
    estimatedTotalHits: number;
    hits: SearchResultHit[];
}

export default SearchResult;
