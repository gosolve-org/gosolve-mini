import { wrappedHttpsCallable } from "utils/firebase";

const searchFunction = wrappedHttpsCallable('search');

export const search = async (query: string, offset: number, limit: number) => {
    const results = await searchFunction({ query, offset, limit });

    return (results.data as any);
}
