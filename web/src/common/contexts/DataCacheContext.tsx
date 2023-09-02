import { type Category } from 'common/models/Category';
import { type Location } from 'common/models/Location';
import { collection } from 'firebase/firestore';
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { db, useCollectionOnceWithDependencies } from 'utils/firebase';
import { docToCategory, docToLocation } from 'utils/mapper';

interface DataCacheContext {
    locations: Location[];
    categories: Category[];
}

export const DataCacheContext = createContext<DataCacheContext>({
    locations: [],
    categories: [],
});

export const DataCacheContextProvider = ({ children }: { children: ReactNode }) => {
    const [locations] = useCollectionOnceWithDependencies(() => collection(db, 'locations'), []);
    const [categories] = useCollectionOnceWithDependencies(() => collection(db, 'categories'), []);

    const providerValue = useMemo(
        () => ({
            locations: (locations?.docs.map(docToLocation) as Location[]) ?? [],
            categories: (categories?.docs.map(docToCategory) as Category[]) ?? [],
        }),
        [locations, categories],
    );

    return <DataCacheContext.Provider value={providerValue}>{children}</DataCacheContext.Provider>;
};

export const useDataCache = () => {
    const context = useContext(DataCacheContext);

    if (context === undefined) {
        throw new Error('useDataCache must be used within a DataCacheContextProvider');
    }

    return context;
};
