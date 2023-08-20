import { wrappedHttpsCallable } from "utils/firebase";

const searchFunction = wrappedHttpsCallable('search');

export const search = async (
    query: {
        query: string,
        categoryIdFilter?: string,
        locationIdFilter?: string,
    },
    options: {
        offset: number,
        limit: number
    }
) => {
    const results = await searchFunction({ query, options });

    return (results as any);
}
