import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { MeiliSearch } from 'meilisearch';
import { useGeoLocation } from './GeoLocationContext';

const MAX_CACHE_ITEMS = 200;
const DEBOUNCE_MS = 300; // Sets a delay after the last keystroke before triggering the search request
const INPUT_MIN_LENGTH_FOR_SEARCH = 2;

const searchCache = {
    entries: {},
    entryKeyHistory: [],
};

const searchActionTimeoutIds = [];
let currentSearchActionTimeoutId = null;

const searchClient = new MeiliSearch({
    host: 'https://app-meilisearchgospro-dev-001.azurewebsites.net',
    apiKey: '',
});
// TODO: Env

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

const getLocationQuery = (input: string, location: GeolocationCoordinates) => ({
    indexUid: 'gos-locations-dev', // TODO: env
    q: input,
    limit: 3,
    sort: location?.latitude != null
        ? [`_geoPoint(${location.latitude},${location.longitude}):asc`]
        : undefined,
});

const getCategoryQuery = (input: string) => ({
    indexUid: 'gos-categories-dev', // TODO: env
    q: input,
    limit: 3,
});

export interface LocationSearchResult
{
    id: string;
    name: string;
    asciiName: string;
    _geo: { lat: number, lng: number },
    featureClass: string;
    featureClassWeight: number,
    featureCode: string;
    country: string;
    countryCode: string;
    alternateCountryCodes: string[];
    adminCode1: string;
    adminCode2: string;
    adminCode3: string;
    adminCode4: string;
    adminDivisionTargetLevel: number;
    content: string;
}

export interface CategorySearchResult
{
    id: string;
    name: string;
}

export const InstantSearchContextProvider = ({ children }: { children: ReactNode }) => {
    const { location, isGeoLocationGranted } = useGeoLocation();
    const [loading, setLoading] = useState(false);
    const [locationResults, setLocationResults] = useState<LocationSearchResult[]>(null);
    const [categoryResults, setCategoryResults] = useState<CategorySearchResult[]>(null);
    const [defaultLocationResults, setDefaultLocationResults] = useState<LocationSearchResult[]>([]);
    const [defaultCategoryResults, setDefaultCategoryResults] = useState<CategorySearchResult[]>([]);

    useEffect(() => {
        fetchDefaultResults();
    }, []);

    useEffect(() => {
        // Reset locationResults in searchCache entries when location changes
        Object.keys(searchCache.entries).forEach(key => {
            if (!searchCache.entries[key]?.locationResults) return;
            searchCache.entries[key].locationResults = [];
        });

        fetchDefaultResults();
    }, [ location ]);

    const fetchDefaultResults = () => {
        const cacheEntry = getFromCache('');
        if (!!cacheEntry && cacheEntry.locationResults && cacheEntry.categoryResults) {
            setDefaultLocationResults(cacheEntry.locationResults);
            setDefaultCategoryResults(cacheEntry.categoryResults);
            if (locationResults == null && categoryResults == null) {
                setLocationResults(cacheEntry.locationResults);
                setCategoryResults(cacheEntry.categoryResults);
            }
            return;
        } 

        searchClient.multiSearch({
            queries: [
                getLocationQuery('', isGeoLocationGranted ? location : null),
                getCategoryQuery(''),
            ]
        }).then(value => {
            const locationValueResults = value.results[0].hits ?? [];
            const categoryValueResults = value.results[1].hits ?? [];

            setDefaultLocationResults(locationValueResults as LocationSearchResult[]);
            setDefaultCategoryResults(categoryValueResults as CategorySearchResult[]);

            if (locationResults == null && categoryResults == null) {
                setLocationResults(locationValueResults as LocationSearchResult[]);
                setCategoryResults(categoryValueResults as CategorySearchResult[]);
            }

            addToCache('', locationValueResults, categoryValueResults);
        });
    }

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
                setLocationResults([]);
                setCategoryResults([]);
                setLoading(false);
                return;
            }

            searchClient.multiSearch({ queries }).then(value => {
                const locationValueResults = !isLocationFilterApplied
                    ? (value.results[0].hits ?? [])
                    : [];
                const categoryValueResults = !isCategoryFilterApplied
                    ? (value.results[!isLocationFilterApplied ? 1 : 0].hits ?? [])
                    : [];

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
