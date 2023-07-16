import { collection } from "firebase/firestore";
import { Category } from "models/Category";
import { Location } from "models/Location";
import { createContext, ReactNode, useContext } from "react";
import { db, useCollectionOnceWithDependencies } from "utils/firebase";
import { docToCategory, docToLocation } from "utils/mapper";

interface DataCacheContext {
    locations: Location[];
    categories: Category[];
}

export const DataCacheContext = createContext<DataCacheContext>({
    locations: [],
    categories: [],
});

export const DataCacheContextProvider = ({ children }: { children: ReactNode }) => {
    const [locations] = useCollectionOnceWithDependencies(() => collection(db, "locations"), []);
    const [categories] = useCollectionOnceWithDependencies(() => collection(db, "categories"), []);

    return (
        <DataCacheContext.Provider
            value={{
                locations: locations?.docs.map(docToLocation) as Location[] ?? [],
                categories: categories?.docs.map(docToCategory) as Category[] ?? [],
            }}
        >
            {children}
        </DataCacheContext.Provider>
    );
};

export const useDataCache = () => {
    const context = useContext(DataCacheContext);

    if (context === undefined) {
        throw new Error("useDataCache must be used within a DataCacheContextProvider");
    }

    return context;
};
