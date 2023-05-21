import { HashtagIcon, MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Category } from "models/Category";
import { Location } from "models/Location";
import { useRouter } from "next/router";
import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

const categories: Category[] = [
    {
        id: "0",
        category: 'goSolve',
        imageName: '',
        hidden: true,
    },
    {
        id: "1",
        category: 'Climate Change',
        imageName: '',
        hidden: false,
    },
    {
        id: "2",
        category: 'Poverty',
        imageName: '',
        hidden: false,
    }
];
const locations: Location[] = [
    {
        id: "0",
        location: "Global",
        hidden: true,
    },
    {
        id: "1",
        location: "United States",
        hidden: false,
    },
    {
        id: "2",
        location: "Belgium",
        hidden: false,
    }
];

function SearchBar() {
    const router = useRouter();
    const [categoryFilter, _setCategoryFilter] = useState<Category>(null);
    const [locationFilter, _setLocationFilter] = useState<Location>(null);
    const [hiddenCategory, _setHiddenCategory] = useState<Category>(null);
    const [hiddenLocation, _setHiddenLocation] = useState<Location>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const hintContainerRef = useRef(null);

    const setCategoryFilter = useCallback((category: Category) => {
        _setCategoryFilter(category);
        setTimeout(() => _setHiddenCategory(category), 0);
    }, [ _setCategoryFilter, _setHiddenCategory ]);

    const setLocationFilter = useCallback((location: Location) => {
        _setLocationFilter(location);
        setTimeout(() => _setHiddenLocation(location), 0);
    }, [ _setLocationFilter, _setHiddenLocation ]);

    const readableSearchQuery = router?.query?.q?.toString().split("+").join(" ") ?? "";

    useEffect(() => {
        setSearchQuery(readableSearchQuery);
    }, [ readableSearchQuery ]);

    useEffect(() => {
        const handleDocumentClick = (e) => {
            if (containerRef.current &&
                !containerRef.current.contains(e.target) && containerRef.current !== e.target) {
                setIsFocused(false);
            }
        };

        const handleDocumentKeyUp = (e) => {
            if (e.code === 'Tab') {
                if (containerRef.current &&
                    !containerRef.current.contains(document.activeElement) && containerRef.current !== document.activeElement) {
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
            const activeElement = document.activeElement;

            if (activeElement.id === 'search') {
                if (e.code === 'ArrowDown') {
                    e.preventDefault();
                    if (hintContainerRef.current instanceof HTMLElement && hintContainerRef.current.firstElementChild instanceof HTMLElement) {
                        hintContainerRef.current.firstElementChild.focus();
                    }
                }

                if (e.code === 'ArrowUp') {
                    e.preventDefault();
                    if (hintContainerRef.current instanceof HTMLElement && hintContainerRef.current.lastElementChild instanceof HTMLElement) {
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
                    } else {
                        if (activeElement.nextElementSibling instanceof HTMLElement) {
                            activeElement.nextElementSibling.focus();
                        }
                    }
                }
    
                if (e.code === 'ArrowUp') {
                    e.preventDefault();
                    if (activeElement.previousElementSibling == null) {
                        inputRef.current.focus();
                    } else {
                        if (activeElement.previousElementSibling instanceof HTMLElement) {
                            activeElement.previousElementSibling.focus();
                        }
                    }
                }

                if (e.code === 'Enter' || (e.code === 'Tab' && !e.shiftKey)) {
                    e.preventDefault();
                    if (activeElement.dataset.type === 'location') {
                        const location = locations.find(l => l.id === activeElement.dataset.id);
                        setLocationFilter(location);
                        inputRef.current.focus();
                    } else if (activeElement.dataset.type === 'category') {
                        const category = categories.find(c => c.id === activeElement.dataset.id);
                        setCategoryFilter(category);
                        inputRef.current.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleDocumentKeyUp);

        return () => {
            document.removeEventListener('keydown', handleDocumentKeyUp);
        };
    }, [ isFocused, hintContainerRef, inputRef, locations, categories, setLocationFilter, setCategoryFilter ]);

    useEffect(() => {
        const handeInputKeyDown = (e) => {
            if (e.code === 'Backspace') {
                if (e.target.selectionStart === 0) {
                    if (categoryFilter) {
                        setCategoryFilter(null);
                    } else if (locationFilter) {
                        setLocationFilter(null);
                    }
                }
            }
        };

        inputRef.current.addEventListener('keydown', handeInputKeyDown);

        return () => {
            inputRef.current?.removeEventListener('keydown', handeInputKeyDown);
        };
    }, [inputRef, categoryFilter, locationFilter, setCategoryFilter, setLocationFilter]);

    const handleSearchQueryChange = (e: FormEvent<HTMLInputElement>) =>
        setSearchQuery(e.currentTarget.value);

    const handleSearchSubmit = () => {
        if (searchQuery) {
            router.push(`/search?q=${searchQuery.split(" ").join("+")}`);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setCategoryFilter(null);
        setLocationFilter(null);
        inputRef.current.value = "";
        inputRef.current.focus();
    };

    const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchSubmit();
        }
    };

    const renderHint = (id, type, children, onClick) => (
        <div
            tabIndex={0}
            key={id}
            data-id={id}
            data-hint="hint"
            data-type={type}
            onMouseDown={() => {
                onClick();
                setTimeout(() => inputRef.current.focus(), 0);
            }}
            className="flex py-1.5 w-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        >
            <div className="w-3"></div>
            <span className="flex items-center">
                <PlusIcon className="h-4 w-4 text-gray-400" />
            </span>
            <div className="w-2"></div>
            <div className="grow flex cursor-default">{children}</div>
            <div className="w-3"></div>
        </div>
    );

    const renderCategoryHint = (category: Category) => renderHint(
        category.id,
        'category',
        <>
            <span className="grow text-gray-500 text-sm flex items-center">{category.category}</span>
            <span className="bg-gos-green px-2 py-1 rounded-full text-xs text-white flex items-center">
                <HashtagIcon className="h-3 w-3 text-white mr-1" />
                Category
            </span>
        </>,
        () => setCategoryFilter(category),
    );

    const renderLocationHint = (location: Location) => renderHint(
        location.id,
        'location',
        <>
            <span className="grow text-gray-500 text-sm flex items-center">{location.location}</span>
            <span className="bg-gos-green px-2 py-1 rounded-full text-xs text-white flex items-center">
                <MapPinIcon className="h-3 w-3 text-white mr-1" />
                Location
            </span>
        </>,
        () => setLocationFilter(location),
    );

    const renderInputFilters = () => (
        <div className="flex">
            {locationFilter &&
                <span className="ml-2 my-1 bg-gos-green px-2 py-1 rounded-full text-xs text-white flex items-center whitespace-nowrap">
                    <MapPinIcon className="h-3 w-3 text-white mr-1" />
                    {locationFilter.location}
                    <label
                        tabIndex={0}
                        onClick={() => {
                            setLocationFilter(null);
                            setTimeout(() => inputRef.current.focus(), 0);
                        }}
                        className="cursor-pointer"
                        htmlFor="search"
                    >
                        <XMarkIcon className="h-3 w-3 text-white ml-1" />
                    </label>
                </span>
            }
            {categoryFilter &&
                <span className={`${locationFilter ? 'ml-1' : 'ml-2'} my-1 bg-gos-green px-2 py-1 rounded-full text-xs text-white flex items-center whitespace-nowrap`}>
                    <HashtagIcon className="h-3 w-3 text-white mr-1" />
                    {categoryFilter.category}
                    <label
                        tabIndex={0}
                        onClick={() => {
                            setCategoryFilter(null);
                            setTimeout(() => inputRef.current.focus(), 0);
                        }}
                        className="cursor-pointer"
                        htmlFor="search"
                    >
                        <XMarkIcon className="h-3 w-3 text-white ml-1" />
                    </label>
                </span>
            }
        </div>
    );

    return (
        <div
            ref={containerRef}
            className="bg-white relative"
            style={{
                width: '600px',
            }}
        >
            {/* INPUT */}
            <div
                className={`flex border border-gray-300 overflow-hidden ${isFocused ? 'border-b-0 rounded-t-3xl' : 'rounded-3xl'}`}
                style={{
                    marginTop: isFocused ? '-1px' : '0',
                }}
            >
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <label
                    htmlFor="search"
                    className="inset-y-0 flex items-center pl-3"
                >
                    <MagnifyingGlassIcon
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                    />
                </label>
                {renderInputFilters()}
                <input
                    ref={inputRef}
                    placeholder={!locationFilter && !categoryFilter ? `Explore goSolve` : ''}
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
                <label
                    htmlFor="search"
                    className="inset-y-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-500"
                    onClick={clearSearch}
                >
                    <button type="button">
                        <XMarkIcon
                            className="h-4 w-4"
                        />
                    </button>
                </label>
            </div>

            {/* RESULTS */}
            <div
                tabIndex={-1}
                className={`absolute z-50 bg-white shadow-md w-full border border-t-0 border-gray-300 rounded-b-3xl ${!isFocused ? 'hidden' : ''}`}
            >
                <div className="ml-3 mr-3 border-t border-gray-300"></div>
                <div ref={hintContainerRef} className="mb-5">
                    {categories
                        .filter(c => c !== hiddenCategory)
                        .map((category, i) => renderCategoryHint(category))}
                    {locations
                        .filter(l => l !== hiddenLocation)
                        .map((location, i) => renderLocationHint(location))}
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
