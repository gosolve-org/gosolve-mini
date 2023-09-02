import {
    type ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    useMemo,
} from 'react';
import { MeiliSearch, type MultiSearchQuery } from 'meilisearch';
import {
    categoryToSearchResult,
    countryLocationToSearchResult,
    meiliHitsToCategorySearchResults,
    meiliHitsToLocationSearchResults,
} from 'utils/mapper';
import { AnalyticsEventEnum } from 'features/Analytics/AnalyticsEventEnum';
import * as Sentry from '@sentry/react';
import { useGeoLocation } from '../../common/contexts/GeoLocationContext';
import { useDataCache } from '../../common/contexts/DataCacheContext';
import { useAnalytics } from '../Analytics/AnalyticsContext';

// TODO: Bug: When immediately selecting filter, the default results are still shown even though they should be hidden (since filter is already selected)

const MAX_CACHE_ITEMS = 200;
const DEBOUNCE_MS = 300; // Sets a delay after the last keystroke before triggering the search request
const INPUT_MIN_LENGTH_FOR_SEARCH = 2;

interface SearchCacheEntry {
    locationResults: LocationSearchResult[];
    categoryResults: CategorySearchResult[];
}

const searchCache: {
    entries: Map<string, SearchCacheEntry>;
    entryKeyHistory: string[];
} = {
    entries: new Map(),
    entryKeyHistory: [],
};

const searchActionTimeoutIds: NodeJS.Timeout[] = [];
let currentSearchActionTimeoutId: NodeJS.Timeout | null = null;

if (process.env.NEXT_PUBLIC_MEILI_HOST == null) {
    throw new Error('NEXT_PUBLIC_MEILI_HOST is undefined');
}
if (process.env.NEXT_PUBLIC_MEILI_API_KEY == null) {
    throw new Error('NEXT_PUBLIC_MEILI_API_KEY is undefined');
}
if (process.env.NEXT_PUBLIC_MEILI_LOCATION_INDEX == null) {
    throw new Error('NEXT_PUBLIC_MEILI_LOCATION_INDEX is undefined');
}
if (process.env.NEXT_PUBLIC_MEILI_CATEGORY_INDEX == null) {
    throw new Error('NEXT_PUBLIC_MEILI_CATEGORY_INDEX is undefined');
}

const searchClient = new MeiliSearch({
    host: process.env.NEXT_PUBLIC_MEILI_HOST,
    apiKey: process.env.NEXT_PUBLIC_MEILI_API_KEY,
});

const addToCache = (key: string, locationResults, categoryResults) => {
    if (!locationResults && !categoryResults) return;
    if (!key || key.trim().length === 0) return;
    const trimmedKey = key.trim().toLowerCase();

    if (searchCache.entryKeyHistory.length > MAX_CACHE_ITEMS) {
        searchCache.entries.delete(searchCache.entryKeyHistory.shift()!);
    }

    let entry = searchCache.entries[trimmedKey];

    if (!entry) {
        entry = {};
        searchCache.entries[trimmedKey] = entry;
    }

    entry.locationResults = locationResults ?? entry.locationResults;
    entry.categoryResults = categoryResults ?? entry.categoryResults;

    searchCache.entryKeyHistory.push(trimmedKey);
};

const getFromCache = (key: string) => {
    return searchCache.entries[key.trim().toLowerCase()];
};

const getLocationQuery = (
    input: string,
    location: GeolocationCoordinates | null,
    limit?: number,
): MultiSearchQuery => ({
    indexUid: process.env.NEXT_PUBLIC_MEILI_LOCATION_INDEX!,
    q: input,
    limit: limit ?? 3,
    sort:
        location?.latitude != null
            ? [`_geoPoint(${location.latitude},${location.longitude}):asc`]
            : undefined,
});

const getCategoryQuery = (input: string, limit?: number): MultiSearchQuery => ({
    indexUid: process.env.NEXT_PUBLIC_MEILI_CATEGORY_INDEX!,
    q: input,
    limit: limit ?? 3,
});

export interface LocationSearchResult {
    id: string;
    name: string;
    asciiName: string;
    featureClass: string | null;
    featureCode: string | null;
    adminCode1: string | null;
    adminCode2: string | null;
    adminCode3: string | null;
    adminCode4: string | null;
    adminDivisionTargetLevel: number;
    targetName: string;
    targetId: string;
}

export interface CategorySearchResult {
    id: string;
    name: string;
}

interface InstantSearchContext {
    loading: boolean;
    search: (
        input: string | null,
        isCategoryFilterApplied: boolean,
        isLocationFilterApplied: boolean,
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

export const InstantSearchContextProvider = ({ children }: { children: ReactNode }) => {
    const { location, isGeoLocationGranted } = useGeoLocation();
    const { logAnalyticsEvent } = useAnalytics();
    const [loading, setLoading] = useState(false);
    const { locations: cachedLocations, categories: cachedCategories } = useDataCache();
    const [locationResults, setLocationResults] = useState<LocationSearchResult[] | null>(null);
    const [categoryResults, setCategoryResults] = useState<CategorySearchResult[] | null>(null);
    const [defaultLocationResults, setDefaultLocationResults] = useState<LocationSearchResult[]>(
        [],
    );
    const [defaultCategoryResults, setDefaultCategoryResults] = useState<CategorySearchResult[]>(
        [],
    );

    const fetchDefaultResults = useCallback(
        (resultsAreEmpty) => {
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

            logAnalyticsEvent(AnalyticsEventEnum.InstantSearchReadDefaults);
            searchClient
                .multiSearch({
                    queries: [
                        getLocationQuery('', isGeoLocationGranted ? location : null),
                        getCategoryQuery('', 6),
                    ],
                })
                .then((value) => {
                    const locationValueResults = meiliHitsToLocationSearchResults(
                        value.results[0].hits ?? [],
                    );
                    const categoryValueResults = meiliHitsToCategorySearchResults(
                        value.results[1].hits ?? [],
                    );

                    setDefaultLocationResults(locationValueResults);
                    setDefaultCategoryResults(categoryValueResults);

                    if (resultsAreEmpty) {
                        setLocationResults(locationValueResults);
                        setCategoryResults(categoryValueResults);
                    }

                    addToCache('', locationValueResults, categoryValueResults);
                })
                .catch((err) => {
                    Sentry.captureException(err);
                });
        },
        [
            setDefaultLocationResults,
            setDefaultCategoryResults,
            setLocationResults,
            setCategoryResults,
            logAnalyticsEvent,
            location,
            isGeoLocationGranted,
        ],
    );

    useEffect(() => {
        fetchDefaultResults(true);
    }, [fetchDefaultResults]);

    useEffect(() => {
        // Reset locationResults in searchCache entries when location changes
        Object.keys(searchCache.entries).forEach((key) => {
            if (!searchCache.entries[key]?.locationResults) return;
            searchCache.entries[key].locationResults = [];
        });

        fetchDefaultResults(true);
    }, [location, fetchDefaultResults]);

    const search = (
        input: string | null,
        isCategoryFilterApplied: boolean,
        isLocationFilterApplied: boolean,
    ) => {
        const sanitizedInput = input?.trim().toLowerCase();
        currentSearchActionTimeoutId = null;

        if (sanitizedInput == null || sanitizedInput.length < INPUT_MIN_LENGTH_FOR_SEARCH) {
            setLocationResults(isLocationFilterApplied ? [] : defaultLocationResults);
            setCategoryResults(isCategoryFilterApplied ? [] : defaultCategoryResults);
            setLoading(false);
            return;
        }

        setLoading(true);

        searchActionTimeoutIds.forEach((id) => clearTimeout(id));
        const cachedValue = getFromCache(sanitizedInput);
        if (cachedValue) {
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
            .filter((cachedLocation) =>
                cachedLocation.location.toLowerCase().startsWith(sanitizedInput.toLowerCase()),
            )
            .sort((a, b) => b.population - a.population)
            .map(countryLocationToSearchResult)
            .slice(0, 2);
        const cacheCategoryHits = cachedCategories
            .filter((cachedCategory) =>
                cachedCategory.category.toLowerCase().startsWith(sanitizedInput.toLowerCase()),
            )
            .map(categoryToSearchResult)
            .slice(0, 2);
        setLocationResults(cacheLocationHits);
        setCategoryResults(cacheCategoryHits);

        const timeoutId = setTimeout(() => {
            if (currentSearchActionTimeoutId !== timeoutId) return;

            const queries: MultiSearchQuery[] = [];

            if (!isLocationFilterApplied) {
                queries.push(
                    getLocationQuery(sanitizedInput, isGeoLocationGranted ? location : null),
                );
            }

            if (!isCategoryFilterApplied) {
                queries.push(getCategoryQuery(sanitizedInput));
            }

            if (queries.length === 0) {
                setLoading(false);
                return;
            }

            logAnalyticsEvent(AnalyticsEventEnum.InstantSearchRead);
            searchClient
                .multiSearch({ queries })
                .then((value) => {
                    const locationHits = !isLocationFilterApplied
                        ? meiliHitsToLocationSearchResults(value.results[0].hits ?? [])
                        : [];
                    const categoryHits = !isCategoryFilterApplied
                        ? meiliHitsToCategorySearchResults(
                              value.results[!isLocationFilterApplied ? 1 : 0].hits ?? [],
                          )
                        : [];

                    const locationValueResults = cacheLocationHits
                        .concat(
                            locationHits.filter(
                                (loc) =>
                                    !cacheLocationHits.some(
                                        (cached) => cached.targetId === loc.targetId,
                                    ),
                            ),
                        )
                        .slice(0, 3);
                    const categoryValueResults = cacheCategoryHits
                        .concat(
                            categoryHits.filter(
                                (cat) => !cacheCategoryHits.some((cached) => cached.id === cat.id),
                            ),
                        )
                        .slice(0, 3);

                    if (currentSearchActionTimeoutId !== timeoutId) {
                        if (!getFromCache(sanitizedInput)) {
                            addToCache(sanitizedInput, locationValueResults, categoryValueResults);
                        }

                        return;
                    }

                    addToCache(sanitizedInput, locationValueResults, categoryValueResults);

                    setLocationResults(locationValueResults);
                    setCategoryResults(categoryValueResults);

                    setLoading(false);
                })
                .catch((err) => {
                    Sentry.captureException(err);
                });
        }, DEBOUNCE_MS);

        searchActionTimeoutIds.push(timeoutId);
        currentSearchActionTimeoutId = timeoutId;
    };

    const providerValue = useMemo(
        () => ({
            loading,
            search,
            locationResults: locationResults ?? [],
            categoryResults: categoryResults ?? [],
        }),
        [loading, search, locationResults, categoryResults],
    );

    return (
        <InstantSearchContext.Provider value={providerValue}>
            {children}
        </InstantSearchContext.Provider>
    );
};

export const useInstantSearch = () => {
    const context = useContext(InstantSearchContext);

    if (context === undefined) {
        throw new Error('useInstantSearch must be used within an InstantSearchContextProvider');
    }

    return context;
};
