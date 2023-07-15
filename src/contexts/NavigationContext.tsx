import { collection, getDocs, query, where } from "firebase/firestore";
import { Category } from "models/Category";
import { Location } from "models/Location";
import { Tab } from "models/Tab";
import { NextRouter, useRouter } from "next/router";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { db } from "utils/firebase";
import { toUrlPart, urlPartToReadable } from "utils/textUtils";
import * as Mapper from "utils/mapper";

const docCache = {
    categories: {},
    locations: {},
};

interface SearchParams {
    q: string;
    qCategoryId: string;
    qLocationId: string;
    page: number;
}

interface NavigationContext {
    isBurgerMenuOpen: boolean;
    closeBurgerMenu: () => void;
    openBurgerMenu: () => void;
    currentCategory: Category;
    currentLocation: Location;
    currentTab: Tab | null;
    handleCurrentTabChange: (tab: Tab) => void;
    goToNotFoundPage: () => void;
    goToSearchPage: (
        query: string,
        category?: string,
        location?: string) => void;
    goToTopicPage: (
        category: string,
        location: string
    ) => void;
    router: NextRouter;
    searchParams: SearchParams;
}

const NavigationContext = createContext<NavigationContext>({
    isBurgerMenuOpen: false,
    closeBurgerMenu: null,
    openBurgerMenu: null,
    currentCategory: null,
    currentLocation: null,
    currentTab: null,
    handleCurrentTabChange: () => {},
    goToNotFoundPage: () => {},
    goToSearchPage: () => {},
    goToTopicPage: () => {},
    router: null,
    searchParams: null,
});

export const NavigationContextProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

    /* NAVIGATOR */

    const goToSearchPage = useCallback((
        query: string,
        categoryId?: string,
        locationId?: string
    ) => {
        let path = `/search?q=${encodeURIComponent(query)}`;
        if (categoryId) {
            path += `&qCategoryId=${toUrlPart(categoryId)}`;
        }
        if (locationId) {
            path += `&qLocationId=${toUrlPart(locationId)}`;
        }
        router.push(path);
    }, [router]);

    const searchParams = useMemo<SearchParams>(() => ({
        q: decodeURIComponent(router.query?.q?.toString() ?? ''),
        qCategoryId: urlPartToReadable(router.query?.qCategoryId?.toString()),
        qLocationId: urlPartToReadable(router.query?.qLocationId?.toString()),
        page: parseInt(router.query?.page?.toString()) || 1,
    }), [router]);

    const goToTopicPage = useCallback((
        category: string,
        location: string
    ) => {
        router.push(
            `/${toUrlPart(category)}/${toUrlPart(location)}`
        );
    }, [router]);

    const goToNotFoundPage = useCallback(() => {
        router.replace('/not-found', undefined, { shallow: true });
    }, [router]);

    /* BURGER MENU  */

    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState<boolean>(false);

    const openBurgerMenu = () => setIsBurgerMenuOpen(true);
    const closeBurgerMenu = () => setIsBurgerMenuOpen(false);

    useEffect(() => {
        let isCleanedUp = false;

        const cb = () => {
            if (!isCleanedUp && isBurgerMenuOpen) {
                setIsBurgerMenuOpen(false);
            }
        };

        router.events.on("routeChangeComplete", cb);

        return () => {
            isCleanedUp = true;
            router.events.off("routeChangeComplete", cb);
        };
    }, [isBurgerMenuOpen, setIsBurgerMenuOpen, router.events]);

    /* CATEGORY & LOCATION */

    const [currentCategory, setCurrentCategory] = useState<Category>();
    const [currentLocation, setCurrentLocation] = useState<Location>();
    const [currentTab, setCurrentTab] = useState(null);

    const handleCurrentTabChange = (tab: Tab) =>
        setCurrentTab(tab);

    const createOnRouteChangeCb = useCallback(() => () => {
        const categoryQuery = urlPartToReadable(router.query.category as string);
        const locationQuery = urlPartToReadable(router.query.location as string);
    
        if (categoryQuery) {
            if (docCache.categories[categoryQuery]) {
                setCurrentCategory(docCache.categories[categoryQuery]);
            } else {
                setCurrentCategory({ category: categoryQuery } as Category);
                getDocs(query(
                    collection(db, "categories"),
                    where("category", "==", categoryQuery))
                ).then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        goToNotFoundPage();
                        return;
                    }
        
                    const category = Mapper.docToCategory(querySnapshot.docs[0]);
                    setCurrentCategory(category);
                    docCache.categories[categoryQuery] = category;
                }).catch((error) => {
                    console.error("Error getting documents: ", error);
                });
            }
        }
    
        if (locationQuery) {
            if (docCache.locations[locationQuery]) {
                setCurrentLocation(docCache.locations[locationQuery]);
            } else {
                setCurrentLocation({ location: locationQuery } as Location);
                getDocs(query(
                    collection(db, "locations"),
                    where("location", "==", locationQuery))
                ).then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        goToNotFoundPage();
                        return;
                    }
    
                    const location = Mapper.docToLocation(querySnapshot.docs[0]);
                    setCurrentLocation(location);
                    docCache.locations[locationQuery] = location;
                }).catch((error) => {
                    console.error("Error getting documents: ", error);
                });
            }
        }
    }, [router, goToNotFoundPage, setCurrentCategory, setCurrentLocation]);

    useEffect(() => {
        createOnRouteChangeCb()();
    }, [createOnRouteChangeCb]);

    useEffect(() => {
        const cb = createOnRouteChangeCb();
        router.events.on("routeChangeComplete", cb);

        return () => {
            router.events.off("routeChangeComplete", cb);
        };
    }, [createOnRouteChangeCb, setCurrentCategory, setCurrentLocation, router.events]);

    return (
        <NavigationContext.Provider
            value={{
                isBurgerMenuOpen,
                openBurgerMenu,
                closeBurgerMenu,
                currentCategory,
                currentLocation,
                currentTab,
                handleCurrentTabChange,
                goToNotFoundPage,
                goToSearchPage,
                goToTopicPage,
                router,
                searchParams,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

export const useNav = () => {
    const context = useContext(NavigationContext);

    if (context === undefined) {
        throw new Error("useNav must be used within a NavigationContextProvider");
    }

    return context;
};
