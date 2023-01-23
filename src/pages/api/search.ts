import { httpsCallable } from "firebase/functions";
import { functions } from "utils/firebase";

const searchFunction = httpsCallable(functions, 'search');

export const search = async (query: string, offset: number, limit: number) => {
    const results = await searchFunction({ query, offset, limit });

    return (results.data as any);
}
