import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MeiliSearch } from 'meilisearch';
import { useGeoLocation } from './GeoLocationContext';
import { meiliHitsToCategorySearchResults, meiliHitsToLocationSearchResults } from 'utils/mapper';
import { useDataCache } from './DataCacheContext';
import { Location } from 'models/Location';
import { Category } from 'models/Category';

const MAX_CACHE_ITEMS = 200;
const DEBOUNCE_MS = 300; // Sets a delay after the last keystroke before triggering the search request
const INPUT_MIN_LENGTH_FOR_SEARCH = 2;

const searchCache = {
    entries: {},
    entryKeyHistory: [],
    rnd: Math.random()
};

const searchActionTimeoutIds = [];
let currentSearchActionTimeoutId = null;

const searchClient = new MeiliSearch({
    host: process.env.NEXT_PUBLIC_MEILI_HOST,
    apiKey: process.env.NEXT_PUBLIC_MEILI_API_KEY,
});

const addToCache = (key: string, locationResults, categoryResults) => {
    if (!locationResults && !categoryResults) return;
    if (!key || key.trim().length === 0) return;
    key = key.trim().toLowerCase();

    if (searchCache.entryKeyHistory.length > MAX_CACHE_ITEMS) {
        delete searchCache.entries[searchCache.entryKeyHistory.shift()];
    }

    let entry = searchCache.entries[key];

    if (!entry) {
        entry = {};
        searchCache.entries[key] = entry;
    }

    entry.locationResults = locationResults ?? entry.locationResults;
    entry.categoryResults = categoryResults ?? entry.categoryResults;

    searchCache.entryKeyHistory.push(key);
};

const getFromCache = (key: string) => {
    return searchCache.entries[key.trim().toLowerCase()];
}

const getLocationQuery = (input: string, location: GeolocationCoordinates, limit?: number) => ({
    indexUid: process.env.NEXT_PUBLIC_MEILI_LOCATION_INDEX,
    q: input,
    limit: limit ?? 3,
    sort: location?.latitude != null
        ? [`_geoPoint(${location.latitude},${location.longitude}):asc`]
        : undefined,
});

const getCategoryQuery = (input: string, limit?: number) => ({
    indexUid: process.env.NEXT_PUBLIC_MEILI_CATEGORY_INDEX,
    q: input,
    limit: limit ?? 3,
});

export interface LocationSearchResult
{
    id: string;
    name: string;
    asciiName: string;
    featureClass: string;
    featureCode: string;
    adminCode1: string;
    adminCode2: string;
    adminCode3: string;
    adminCode4: string;
    adminDivisionTargetLevel: number;
    targetName: string;
    targetId: string;
}

const countryLocationToSearchResult = (location: Location): LocationSearchResult => ({
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

export interface CategorySearchResult
{
    id: string;
    name: string;
}

const categoryToSearchResult = (category: Category): CategorySearchResult => ({
    id: category.id,
    name: category.category,
});

export const InstantSearchContextProvider = ({ children }: { children: ReactNode }) => {
    const { location, isGeoLocationGranted } = useGeoLocation();
    const [loading, setLoading] = useState(false);
    const { locations: cachedLocations, categories: cachedCategories } = useDataCache();
    const [locationResults, setLocationResults] = useState<LocationSearchResult[]>(null);
    const [categoryResults, setCategoryResults] = useState<CategorySearchResult[]>(null);
    const [defaultLocationResults, setDefaultLocationResults] = useState<LocationSearchResult[]>([]);
    const [defaultCategoryResults, setDefaultCategoryResults] = useState<CategorySearchResult[]>([]);

    const fetchDefaultResults = useCallback((resultsAreEmpty) => {
        const cacheEntry = getFromCache('');
        if (!!cacheEntry && cacheEntry.locationResults && cacheEntry.categoryResults) {
            setDefaultLocationResults(cacheEntry.locationResults);
            setDefaultCategoryResults(cacheEntry.categoryResults);
            if (resultsAreEmpty) {
                setLocationResults(cacheEntry.locationResults);
                setCategoryResults(cacheEntry.categoryResults);
            }
            return;
        } 

        searchClient.multiSearch({
            queries: [
                getLocationQuery('', isGeoLocationGranted ? location : null),
                getCategoryQuery('', 6),
            ]
        }).then(value => {
            const locationValueResults = meiliHitsToLocationSearchResults(
                value.results[0].hits ?? []);
            const categoryValueResults = meiliHitsToCategorySearchResults(
                value.results[1].hits ?? []);

            setDefaultLocationResults(locationValueResults as LocationSearchResult[]);
            setDefaultCategoryResults(categoryValueResults as CategorySearchResult[]);

            if (resultsAreEmpty) {
                setLocationResults(locationValueResults as LocationSearchResult[]);
                setCategoryResults(categoryValueResults as CategorySearchResult[]);
            }

            addToCache('', locationValueResults, categoryValueResults);
        });
    }, [setDefaultLocationResults, setDefaultCategoryResults, setLocationResults, setCategoryResults, location, isGeoLocationGranted]);

    useEffect(() => {
        fetchDefaultResults(true);
    }, [fetchDefaultResults]);

    useEffect(() => {
        // Reset locationResults in searchCache entries when location changes
        Object.keys(searchCache.entries).forEach(key => {
            if (!searchCache.entries[key]?.locationResults) return;
            searchCache.entries[key].locationResults = [];
        });

        fetchDefaultResults(true);
    }, [ location, fetchDefaultResults ]);

    const search = (
        input: string,
        isCategoryFilterApplied: boolean,
        isLocationFilterApplied: boolean
    ) => {
        input = input?.trim();
        currentSearchActionTimeoutId = null;

        if (input == null || input.length < INPUT_MIN_LENGTH_FOR_SEARCH) {
            setLocationResults(isLocationFilterApplied ? [] : defaultLocationResults);
            setCategoryResults(isCategoryFilterApplied ? [] : defaultCategoryResults);
            setLoading(false);
            return;
        }

        setLoading(true);
    
        searchActionTimeoutIds.forEach(id => clearTimeout(id));
        let cachedValue = getFromCache(input);
        if (cachedValue)
        {
            setLocationResults(!isLocationFilterApplied ? cachedValue.locationResults : []);
            setCategoryResults(!isCategoryFilterApplied ? cachedValue.categoryResults : []);
            setLoading(false);
            return;
        }

        setLocationResults([]);
        setCategoryResults([]);

        if (isLocationFilterApplied && isCategoryFilterApplied) {
            setLoading(false);
            return;
        }

        const cacheLocationHits = cachedLocations
            .filter(location => location.location.toLowerCase().startsWith(input.toLowerCase()))
            .sort((a, b) => b.population - a.population)
            .map(countryLocationToSearchResult)
            .slice(0, 2);
        const cacheCategoryHits = cachedCategories
            .filter(category => category.category.toLowerCase().startsWith(input.toLowerCase()))
            .map(categoryToSearchResult)
            .slice(0, 2);
        setLocationResults(cacheLocationHits);
        setCategoryResults(cacheCategoryHits);
    
        const timeoutId = setTimeout(() => {
            if (currentSearchActionTimeoutId !== timeoutId) return;

            const queries = [];

            if (!isLocationFilterApplied) {
                queries.push(getLocationQuery(input, isGeoLocationGranted ? location : null));
            }

            if (!isCategoryFilterApplied) {
                queries.push(getCategoryQuery(input));
            }

            if (queries.length === 0) {
                setLoading(false);
                return;
            }

            searchClient.multiSearch({ queries }).then(value => {
                const locationHits = !isLocationFilterApplied
                    ? meiliHitsToLocationSearchResults(value.results[0].hits ?? [])
                    : [];
                const categoryHits = !isCategoryFilterApplied
                    ? meiliHitsToCategorySearchResults(
                        value.results[!isLocationFilterApplied ? 1 : 0].hits ?? [])
                    : [];

                const locationValueResults = cacheLocationHits
                    .concat(locationHits.filter(loc =>
                        !cacheLocationHits.some(cached => cached.targetId === loc.targetId)))
                    .slice(0, 3);
                const categoryValueResults = cacheCategoryHits
                    .concat(categoryHits.filter(cat =>
                        !cacheCategoryHits.some(cached => cached.id === cat.id)))
                    .slice(0, 3);

                if (currentSearchActionTimeoutId !== timeoutId)
                {
                    if (!getFromCache(input)) {
                        addToCache(input, locationValueResults, categoryValueResults);
                    }

                    return;
                }
                
                addToCache(input, locationValueResults, categoryValueResults);

                setLocationResults(locationValueResults as LocationSearchResult[]);
                setCategoryResults(categoryValueResults as CategorySearchResult[]);

                setLoading(false);
            });
        }, DEBOUNCE_MS);
    
        searchActionTimeoutIds.push(timeoutId);
        currentSearchActionTimeoutId = timeoutId;
    };

    return (
        <InstantSearchContext.Provider
            value={{
                loading,
                search,
                locationResults: locationResults ?? [],
                categoryResults: categoryResults ?? [],
            }}
        >
            {children}
        </InstantSearchContext.Provider>
    );
};

interface InstantSearchContext {
    loading: boolean;
    search: (
        input: string,
        isCategoryFilterApplied: boolean,
        isLocationFilterApplied: boolean
    ) => void;
    locationResults: LocationSearchResult[];
    categoryResults: CategorySearchResult[];
}

export const InstantSearchContext = createContext<InstantSearchContext>({
    loading: false,
    search: () => {},
    locationResults: [],
    categoryResults: [],
});

export const useInstantSearch = () => {
    const context = useContext(InstantSearchContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an InstantSearchContextProvider");
    }

    return context;
};
