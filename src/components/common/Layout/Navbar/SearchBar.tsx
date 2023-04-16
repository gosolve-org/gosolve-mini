import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { FormEvent, KeyboardEvent, useEffect, useState } from "react";

function SearchBar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const readableSearchQuery = router?.query?.q?.toString().split("+").join(" ") ?? "";

    useEffect(() => {
        setSearchQuery(readableSearchQuery);
    }, [ readableSearchQuery ]);

    const handleSearchQueryChange = (e: FormEvent<HTMLInputElement>) =>
        setSearchQuery(e.currentTarget.value);

    const handleSearchSubmit = () => {
        if (searchQuery) {
            router.push(`/search?q=${searchQuery.split(" ").join("+")}`);
        }
    };

    const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchSubmit();
        }
    };

    return (
        <span>
            <div>
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <div className="relative">
                    <input
                        autoComplete="off"
                        id="search"
                        name="search"
                        className="block w-full rounded-3xl border border-gray-300 bg-white py-2 pl-4 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
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
            </div>
        </span>
    );
}

export default SearchBar;
