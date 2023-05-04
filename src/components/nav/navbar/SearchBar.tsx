import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Category } from "models/Category";
import { Location } from "models/Location";
import { useRouter } from "next/router";
import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { toUrlPart } from "utils/textUtils";

const BAR_WIDTH = 600;

function SearchBar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [location, setLocation] = useState<Location>(null);
    const [category, setCategory] = useState<Category>(null);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const readableSearchQuery = router?.query?.q?.toString().split("+").join(" ") ?? "";

    useEffect(() => {
        setSearchQuery(readableSearchQuery);
    }, [ readableSearchQuery ]);

    const handleSearchQueryChange = (e: FormEvent<HTMLInputElement>) =>
        setSearchQuery(e.currentTarget.value);

    const handleSearchSubmit = () => {
        if ((!searchQuery || searchQuery?.trim().length == 0) && !location && !category) {
            return;
        }

        if (searchQuery?.trim().length > 0 || !location || !category) {
            const params = new URLSearchParams();
            if (searchQuery?.trim().length > 0) params.append('q', searchQuery);
            if (!!location) params.append('loc', toUrlPart(location.location));
            if (!!category) params.append('cat', toUrlPart(category.category));
            router.push(`/search?${params.toString()}`);
        } else {
            router.push(`/${toUrlPart(category.category)}/${toUrlPart(location.location)}`);
        }
    };

    const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchSubmit();
        }
    };

    return (
        <div
            style={{
                width: `${BAR_WIDTH}px`
            }}
        >
            <div className="rounded-3xl border border-gray-300 bg-white">
                <div className="relative h-full">
                    <label htmlFor="search" className="sr-only">
                        Search
                    </label>
                    <input
                        placeholder="Explore goSolve"
                        autoComplete="off"
                        id="search"
                        name="search"
                        className="block w-full outline-none focus:outline-none focus:border-transparent focus:border-transparent focus:ring-0 border-0 py-2 pl-4 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        onKeyUp={handleSearchKeyPress}
                    />
                    <div
                        onClick={handleSearchSubmit}
                        className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3"
                    >
                        <MagnifyingGlassIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </div>
                </div>
                <div style={{ height: isExpanded ? '200px' : '0px' }}>

                </div>
            </div>
        </div>
    );
}

export default SearchBar;
