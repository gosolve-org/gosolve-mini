import { HashtagIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/20/solid';
import {
    ArrowUpRightIcon,
    FunnelIcon,
    PlusIcon,
    SparklesIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import {
    type CategorySearchResult,
    type LocationSearchResult,
    useInstantSearch,
} from 'features/Search/InstantSearchContext';
import Link from 'next/link';
import {
    type FormEvent,
    type KeyboardEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useNav } from 'features/Nav/NavigationContext';
import { useMediaQueries } from 'common/contexts/MediaQueryContext';
import { useGeoLocation } from 'common/contexts/GeoLocationContext';
import { useDataCache } from 'common/contexts/DataCacheContext';
import { categoryToSearchResult, countryLocationToSearchResult } from 'utils/mapper';
import LINKS from 'common/constants/links';
import LoaderLine from 'common/components/layout/LoaderLine';

const SEARCH_CONTAINER_NAME = 'search';

enum HintType {
    Category,
    Location,
    Search,
    SearchTopic,
    Basic,
    Filters,
}

const SearchBar = () => {
    const { isGeoLocationGranted, isGeoLocationAvailable, requestLocationAccess } =
        useGeoLocation();
    const { goToSearchPage, goToTopicPage, router } = useNav();
    const { isTabletOrMobile, isMobile, screenWidth } = useMediaQueries();
    const { categories, locations } = useDataCache();
    const [categoryFilter, setCategoryFilter] = useState<CategorySearchResult | null>(null);
    const [locationFilter, setLocationFilter] = useState<LocationSearchResult | null>(null);
    const [hiddenCategory, setHiddenCategory] = useState<CategorySearchResult | null>(null);
    const [hiddenLocation, setHiddenLocation] = useState<LocationSearchResult | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hintContainerRef = useRef<HTMLDivElement>(null);
    const { search, loading, categoryResults, locationResults } = useInstantSearch();

    const selectCategoryFilter = useCallback(
        (category: CategorySearchResult | null) => {
            setCategoryFilter(category);
            setTimeout(() => setHiddenCategory(category), 0);
        },
        [setCategoryFilter, setHiddenCategory],
    );

    const selectLocationFilter = useCallback(
        (location: LocationSearchResult | null) => {
            setLocationFilter(location);
            setTimeout(() => setHiddenLocation(location), 0);
        },
        [setLocationFilter, setHiddenLocation],
    );

    const readableSearchQuery = router?.query?.q?.toString().split('+').join(' ') ?? '';

    useEffect(() => {
        if (router.query.qCategoryId) {
            const category = categories.find((c) => c.id === router.query.qCategoryId);
            if (category) selectCategoryFilter(categoryToSearchResult(category));
        }

        if (router.query.qLocationId) {
            const location = locations.find((l) => l.id === router.query.qLocationId);
            if (location) selectLocationFilter(countryLocationToSearchResult(location));
        }
    }, [router, categories, locations, selectCategoryFilter, selectLocationFilter]);

    const handleSearchQueryChange = (e: FormEvent<HTMLInputElement>) => {
        search(e.currentTarget.value, !!categoryFilter, !!locationFilter);
        setSearchQuery(e.currentTarget.value);
    };

    const handleSearchSubmit = () => {
        if (categoryFilter && (!searchQuery || searchQuery.trim().length === 0)) {
            goToTopicPage(categoryFilter.name, locationFilter?.targetName ?? 'World');
        } else if (searchQuery) {
            goToSearchPage(searchQuery, categoryFilter?.id, locationFilter?.id);
        }
    };

    const clearInput = useCallback(
        (isCategoryFilterApplied = false, isLocationFilterApplied = false) => {
            setSearchQuery('');
            search(null, isCategoryFilterApplied, isLocationFilterApplied);
            inputRef.current!.value = '';
        },
        [search, setSearchQuery, inputRef],
    );

    const focusInput = () => {
        inputRef.current!.focus();
    };

    const unfocusInput = () => {
        inputRef.current!.blur();
    };

    const clearSearch = () => {
        selectCategoryFilter(null);
        selectLocationFilter(null);
        clearInput();
    };

    const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    useEffect(() => {
        setSearchQuery(readableSearchQuery);
    }, [readableSearchQuery]);

    useEffect(() => {
        const isLinkedToContainerByDataAttribute = (el) =>
            !!el &&
            (el.dataset.parentContainer === SEARCH_CONTAINER_NAME ||
                (!!el.parentElement && isLinkedToContainerByDataAttribute(el.parentElement)));

        const isElementOutsideOfContainer = (el) =>
            containerRef.current &&
            !containerRef.current.contains(el) &&
            containerRef.current !== el &&
            !isLinkedToContainerByDataAttribute(el);

        const handleDocumentClick = (e) => {
            if (isElementOutsideOfContainer(e.target)) {
                setIsFocused(false);
            }
        };

        const handleDocumentKeyUp = (e) => {
            if (e.code === 'Tab') {
                if (isElementOutsideOfContainer(document.activeElement)) {
                    setIsFocused(false);
                }
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);
        document.addEventListener('keyup', handleDocumentKeyUp);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
            document.removeEventListener('keyup', handleDocumentKeyUp);
        };
    }, [containerRef, setIsFocused]);

    useEffect(() => {
        const handleDocumentKeyUp = (e) => {
            if (!isFocused) return;

            if (!(document.activeElement instanceof HTMLElement)) {
                return;
            }
            const { activeElement } = document;

            if (activeElement.parentElement == null) return;

            if (activeElement.id === 'search') {
                if (e.code === 'ArrowDown') {
                    e.preventDefault();
                    if (
                        hintContainerRef.current instanceof HTMLElement &&
                        hintContainerRef.current.firstElementChild instanceof HTMLElement
                    ) {
                        hintContainerRef.current.firstElementChild.focus();
                    }
                }

                if (e.code === 'ArrowUp') {
                    e.preventDefault();
                    if (
                        hintContainerRef.current instanceof HTMLElement &&
                        hintContainerRef.current.lastElementChild instanceof HTMLElement
                    ) {
                        hintContainerRef.current.lastElementChild.focus();
                    }
                }
            } else if (activeElement.dataset.hint === 'hint') {
                if (e.code === 'ArrowDown') {
                    e.preventDefault();
                    if (activeElement.nextElementSibling == null) {
                        if (activeElement.parentElement.firstElementChild instanceof HTMLElement) {
                            activeElement.parentElement.firstElementChild.focus();
                        }
                    } else if (activeElement.nextElementSibling instanceof HTMLElement) {
                        activeElement.nextElementSibling.focus();
                    }
                }

                if (e.code === 'ArrowUp') {
                    e.preventDefault();
                    if (activeElement.previousElementSibling == null) {
                        inputRef.current!.focus();
                    } else if (activeElement.previousElementSibling instanceof HTMLElement) {
                        activeElement.previousElementSibling.focus();
                    }
                }

                if (e.code === 'Enter' || (e.code === 'Tab' && !e.shiftKey)) {
                    e.preventDefault();
                    if (
                        activeElement.dataset.type?.toLocaleLowerCase() ===
                        HintType.Location.toString().toLowerCase()
                    ) {
                        const location =
                            locationResults.find((l) => l.id === activeElement.dataset.id) ?? null;
                        selectLocationFilter(location);
                        clearInput(!!categoryFilter, true);
                        focusInput();
                    } else if (
                        activeElement.dataset.type?.toLowerCase() ===
                        HintType.Category.toString().toLowerCase()
                    ) {
                        const category =
                            categoryResults.find((c) => c.id === activeElement.dataset.id) ?? null;
                        selectCategoryFilter(category);
                        clearInput(true, !!locationFilter);
                        focusInput();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleDocumentKeyUp);

        return () => {
            document.removeEventListener('keydown', handleDocumentKeyUp);
        };
    }, [
        isFocused,
        hintContainerRef,
        inputRef,
        locationResults,
        categoryResults,
        categoryFilter,
        locationFilter,
        selectLocationFilter,
        selectCategoryFilter,
        clearInput,
    ]);

    useEffect(() => {
        const currentInput = inputRef.current;

        const handeInputKeyDown = (e) => {
            if (e.code === 'Backspace') {
                if (e.target.selectionStart === 0) {
                    if (categoryFilter) {
                        selectCategoryFilter(null);
                        search(null, false, !!locationFilter);
                    } else if (locationFilter) {
                        selectLocationFilter(null);
                        search(null, !!categoryFilter, false);
                    }
                }
            }
        };

        currentInput!.addEventListener('keydown', handeInputKeyDown);

        return () => {
            currentInput?.removeEventListener('keydown', handeInputKeyDown);
        };
    }, [
        inputRef,
        categoryFilter,
        locationFilter,
        search,
        selectCategoryFilter,
        selectLocationFilter,
    ]);

    enum HintIcon {
        Plus,
        MagnifyingGlass,
        ArrowUpRight,
        Filter,
        Sparkles,
    }
    interface HintOptions {
        icon?: HintIcon | null;
        bgOnActive?: boolean;
        cursorPointer?: boolean;
        style?: string;
    }
    const renderHint = (id, type: HintType, children, onClick, options?: HintOptions) => {
        let icon;
        switch (options?.icon) {
            case HintIcon.Plus:
                icon = <PlusIcon className="h-4 w-4 text-gray-400" />;
                break;
            case HintIcon.MagnifyingGlass:
                icon = <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />;
                break;
            case HintIcon.ArrowUpRight:
                icon = <ArrowUpRightIcon className="h-4 w-4 text-gray-400" />;
                break;
            case HintIcon.Filter:
                icon = <FunnelIcon className="h-4 w-4 text-gray-400" />;
                break;
            case HintIcon.Sparkles:
                icon = <SparklesIcon className="h-4 w-4 text-gray-400" />;
                break;
            default:
                icon = <div className="w-4" />;
                break;
        }

        return (
            <button
                type="button"
                tabIndex={0}
                key={`${type}-${id}`}
                data-id={id}
                data-hint="hint"
                data-type={type}
                data-parent-container={SEARCH_CONTAINER_NAME}
                onMouseDown={() => {
                    onClick();
                    setTimeout(() => inputRef.current!.focus(), 0);
                    if (type === HintType.Category) {
                        clearInput(true, !!locationFilter);
                        focusInput();
                    } else if (type === HintType.Location) {
                        clearInput(!!categoryFilter, true);
                        focusInput();
                    }
                }}
                className={
                    'flex w-full focus:outline-none ' +
                    (options?.style ?? 'py-1.5') +
                    (options?.bgOnActive !== false ? ' hover:bg-gray-100 focus:bg-gray-100' : '') +
                    (options?.cursorPointer ? ' cursor-pointer' : ' cursor-default')
                }
            >
                <div className="w-3" />
                <span className="flex items-center my-auto">{icon}</span>
                <div className="w-2" />
                <div className={`grow flex ${!options?.cursorPointer && 'cursor-default'}`}>
                    {children}
                </div>
                <div className="w-3" />
            </button>
        );
    };

    const renderCategoryHint = (category: CategorySearchResult) =>
        renderHint(
            category.id,
            HintType.Category,
            <>
                <span className="bg-gos-blue h-fit my-auto px-1.5 mr-1 py-1 rounded-full text-xs text-white flex items-center">
                    <HashtagIcon className="h-3 w-3 text-white mr-0.5" />
                    Category
                </span>
                <span className="grow text-gray-500 text-sm flex items-center">
                    {category.name}
                </span>
            </>,
            () => selectCategoryFilter(category),
            { icon: HintIcon.Plus },
        );

    const renderLocationHint = (location: LocationSearchResult) =>
        renderHint(
            location.id,
            HintType.Location,
            <>
                <span className="bg-gos-green h-fit my-auto px-1.5 mr-1 py-1 rounded-full text-xs text-white flex items-center">
                    <MapPinIcon className="h-3 w-3 text-white mr-0.5" />
                    Location
                </span>
                <span className="grow text-gray-500 text-sm flex items-center">
                    {location.targetName}
                </span>
            </>,
            () => selectLocationFilter(location),
            { icon: HintIcon.Plus },
        );

    const renderSearchHint = () =>
        renderHint(
            'searchHint',
            HintType.Search,
            <span className="text-gray-500 text-sm">
                Search for &quot;{searchQuery.trim()}&quot;
            </span>,
            () => {
                goToSearchPage(searchQuery, categoryFilter?.id, locationFilter?.targetId);
                clearSearch();
            },
            {
                bgOnActive: true,
                icon: HintIcon.MagnifyingGlass,
                cursorPointer: true,
                style:
                    'py-3 border border-x-0 ' +
                    (loading ? 'border-b-0 ' : 'border-b-1 ') +
                    (categoryResults.length === 0 && locationResults.length === 0
                        ? 'border-t-0'
                        : 'border-t-1'),
            },
        );

    const renderSearchTopicHint = () =>
        renderHint(
            'searchTopicHint',
            HintType.SearchTopic,
            <span className="text-gray-400 text-sm">
                Go to
                <span className="text-gray-500 font-semibold"> {categoryFilter!.name} </span>
                in
                <span className="text-gray-500 font-semibold">
                    {' '}
                    {locationFilter?.targetName ?? 'World'}{' '}
                </span>
            </span>,
            () => {
                goToTopicPage(categoryFilter!.name, locationFilter?.targetName ?? 'World');
                clearSearch();
            },
            {
                bgOnActive: true,
                icon: HintIcon.ArrowUpRight,
                cursorPointer: true,
                style:
                    'py-3 border border-x-0 ' +
                    (loading ? 'border-b-0 ' : 'border-b-1 ') +
                    (categoryResults.length === 0 && locationResults.length === 0
                        ? 'border-t-0'
                        : 'border-t-1'),
            },
        );

    const renderLocationAccessHint = () =>
        renderHint(
            'locationAccessHint',
            HintType.Basic,
            <span className="mt-1 text-xs font-light">
                Enable location access for better results
            </span>,
            requestLocationAccess,
            {
                icon: HintIcon.Sparkles,
                cursorPointer: true,
                style: 'py-1.5 text-gray-400 focus:text-gray-500 hover:text-gray-500',
            },
        );

    const renderSuggestionHint = () =>
        renderHint(
            'suggestionHint',
            HintType.Basic,
            <span className="mt-1 text-xs font-light text-gray-400 focus:text-gray-500 hover:text-gray-500">
                <Link href={LINKS.suggestionForm} target="_blank">
                    Missing something? Suggest a new category or location here.
                </Link>
            </span>,
            () => {},
            { bgOnActive: false, icon: null },
        );

    const renderLocationInputFilter = (paddingClassName) => (
        <span
            style={{
                maxWidth: isTabletOrMobile ? 135 : undefined,
            }}
            className={`${paddingClassName} ml-2 my-1 bg-gos-green rounded-full text-xs text-white flex items-center whitespace-nowrap`}
        >
            <span>
                <MapPinIcon className="h-3 w-3 text-white mr-0.5" />
            </span>
            <span className="truncate">{locationFilter!.targetName}</span>
            <button
                type="button"
                tabIndex={0}
                onClick={() => {
                    selectLocationFilter(null);
                    setTimeout(() => inputRef.current?.focus(), 0);
                    search(searchQuery, !!categoryFilter, false);
                }}
                className="cursor-pointer"
            >
                <XMarkIcon className="h-3 w-3 text-white ml-1" />
            </button>
        </span>
    );

    const renderCategoryInputFilter = (paddingClassName) => (
        <span
            className={`${
                locationFilter ? 'ml-1' : 'ml-2'
            } ${paddingClassName} my-1 bg-gos-blue rounded-full text-xs text-white flex items-center whitespace-nowrap`}
        >
            <HashtagIcon className="h-3 w-3 text-white mr-0.5" />
            {categoryFilter!.name}
            <button
                type="button"
                tabIndex={0}
                onClick={() => {
                    selectCategoryFilter(null);
                    setTimeout(() => inputRef.current?.focus(), 0);
                    search(searchQuery, false, !!locationFilter);
                }}
                className="cursor-pointer"
            >
                <XMarkIcon className="h-3 w-3 text-white ml-1" />
            </button>
        </span>
    );

    const renderInputFilters = () => (
        <div className="flex" data-parent-container={SEARCH_CONTAINER_NAME}>
            {categoryFilter && renderCategoryInputFilter('px-1.5 py-1')}
            {locationFilter && renderLocationInputFilter('px-1.5 py-1')}
        </div>
    );

    const renderMobileInputFilters = () =>
        renderHint(
            'filtersHint',
            HintType.Filters,
            <>
                {categoryFilter && renderCategoryInputFilter('px-1.5 py-2')}
                {locationFilter && renderLocationInputFilter('px-1.5 py-2')}
            </>,
            () => {},
            {
                bgOnActive: false,
                icon: HintIcon.Filter,
                style: 'py-1 border border-x-0 border-t-0',
            },
        );

    const getSearchPlaceholder = () => {
        if (locationFilter || categoryFilter) return '';

        return screenWidth > 350 ? 'Explore goSolve' : 'Explore';
    };

    return (
        <div
            ref={containerRef}
            className={`bg-white ${isMobile && isFocused ? 'absolute' : 'relative'}`}
            style={{
                width: isMobile && isFocused ? '100%' : '600px',
                zIndex: 1,
            }}
        >
            {/* INPUT */}
            <div
                className={`flex box-border border border-gray-300 overflow-hidden ${
                    isFocused ? 'border-b-0 pb-px rounded-t-3xl' : 'rounded-3xl'
                }`}
            >
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <label htmlFor="search" className="inset-y-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </label>
                {!isMobile && renderInputFilters()}
                <input
                    ref={inputRef}
                    placeholder={getSearchPlaceholder()}
                    autoComplete="off"
                    id="search"
                    name="search"
                    className="border-none grow w-full py-2 pl-2 pr-3 text-sm placeholder-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none sm:text-sm"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    onKeyDown={handleSearchKeyPress}
                    onFocus={() => setIsFocused(true)}
                />
                <button
                    type="button"
                    style={{
                        WebkitTapHighlightColor: isMobile ? 'transparent' : 'initial',
                    }}
                    className="inset-y-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-500"
                    onClick={() => {
                        clearSearch();
                        if (!isMobile) {
                            focusInput();
                        } else {
                            unfocusInput();
                            setIsFocused(false);
                        }
                    }}
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>

            {/* RESULTS */}
            <div
                tabIndex={-1}
                className={`absolute z-50 bg-white shadow-md w-full border border-t-0 border-gray-300 rounded-b-3xl ${
                    !isFocused ? 'hidden' : ''
                }`}
            >
                <div className="border-t" />
                <div className="mb-1">
                    {isMobile && (locationFilter || categoryFilter) && renderMobileInputFilters()}
                    <div ref={hintContainerRef}>
                        {categoryResults
                            .filter((c) => c !== hiddenCategory)
                            .map(renderCategoryHint)}
                        {locationResults
                            .filter((l) => l !== hiddenLocation)
                            .map(renderLocationHint)}
                        {!!searchQuery && searchQuery.trim().length > 0 && renderSearchHint()}
                        {!!categoryFilter &&
                            (!searchQuery || searchQuery.trim().length === 0) &&
                            renderSearchTopicHint()}
                    </div>
                    {loading && <LoaderLine />}
                    {!isGeoLocationGranted && isGeoLocationAvailable && renderLocationAccessHint()}
                    {renderSuggestionHint()}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
