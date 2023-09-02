import * as Sentry from '@sentry/react';
import { collection, getDocs, query as queryStore, where } from 'firebase/firestore';
import { type Tab } from 'features/Resource/types/Tab';
import { type NextRouter, useRouter } from 'next/router';
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { db } from 'utils/firebase';
import { toUrlPart, urlPartToReadable } from 'utils/textUtils';
import * as Mapper from 'utils/mapper';
import { type Category } from 'common/models/Category';
import { type Location } from 'common/models/Location';

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
    goToSearchPage: (query: string, category?: string, location?: string) => void;
    goToTopicPage: (category: string, location: string) => void;
    router: NextRouter;
    searchParams: SearchParams;
}

const NavigationContext = createContext<NavigationContext | null>(null);

export const NavigationContextProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

    /* NAVIGATOR */

    const goToSearchPage = useCallback(
        async (query: string, categoryId?: string, locationId?: string) => {
            let path = `/search?q=${encodeURIComponent(query)}`;
            if (categoryId) {
                path += `&qCategoryId=${toUrlPart(categoryId)}`;
            }
            if (locationId) {
                path += `&qLocationId=${toUrlPart(locationId)}`;
            }
            await router.push(path);
        },
        [router],
    );

    const searchParams = useMemo<SearchParams>(
        () => ({
            q: decodeURIComponent(router.query?.q?.toString() ?? ''),
            qCategoryId: urlPartToReadable(router.query?.qCategoryId?.toString() ?? null) ?? '',
            qLocationId: urlPartToReadable(router.query?.qLocationId?.toString() ?? null) ?? '',
            page: parseInt(router.query?.page?.toString() ?? '') || 1,
        }),
        [router],
    );

    const goToTopicPage = useCallback(
        async (category: string, location: string) => {
            await router.push(`/${toUrlPart(category)}/${toUrlPart(location)}`);
        },
        [router],
    );

    const goToNotFoundPage = useCallback(async () => {
        await router.replace('/not-found', undefined, { shallow: true });
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

        router.events.on('routeChangeComplete', cb);

        return () => {
            isCleanedUp = true;
            router.events.off('routeChangeComplete', cb);
        };
    }, [isBurgerMenuOpen, setIsBurgerMenuOpen, router.events]);

    /* CATEGORY & LOCATION */

    const [currentCategory, setCurrentCategory] = useState<Category>({
        category: urlPartToReadable(router.query.category as string) ?? '',
        id: '',
        imageName: '',
    });
    const [currentLocation, setCurrentLocation] = useState<Location>({
        location: urlPartToReadable(router.query.location as string) ?? '',
        id: '',
        population: 0,
    });
    const [currentTab, setCurrentTab] = useState<Tab | null>(null);

    const handleCurrentTabChange = (tab: Tab) => setCurrentTab(tab);

    const createOnRouteChangeCb = useCallback(
        () => () => {
            const categoryQuery = urlPartToReadable(router.query.category as string);
            const locationQuery = urlPartToReadable(router.query.location as string);

            if (categoryQuery) {
                if (docCache.categories[categoryQuery]) {
                    setCurrentCategory(docCache.categories[categoryQuery]);
                } else {
                    if (currentCategory.category !== categoryQuery) {
                        setCurrentCategory({
                            category: categoryQuery,
                            id: '',
                            imageName: '',
                        });
                    }
                    getDocs(
                        queryStore(
                            collection(db, 'categories'),
                            where('category', '==', categoryQuery),
                        ),
                    )
                        .then(async (querySnapshot) => {
                            if (querySnapshot.empty) {
                                await goToNotFoundPage();
                                return;
                            }

                            const category = Mapper.docToCategory(querySnapshot.docs[0]);
                            if (category == null) {
                                await goToNotFoundPage();
                                return;
                            }
                            setCurrentCategory(category);
                            docCache.categories[categoryQuery] = category;
                        })
                        .catch((error) => {
                            Sentry.captureException(error);
                            console.error('Error getting documents: ', error);
                        });
                }
            }

            if (locationQuery) {
                if (docCache.locations[locationQuery]) {
                    setCurrentLocation(docCache.locations[locationQuery]);
                } else {
                    if (currentLocation?.location !== locationQuery) {
                        setCurrentLocation({
                            location: locationQuery,
                            id: '',
                            population: 0,
                        });
                    }
                    getDocs(
                        queryStore(
                            collection(db, 'locations'),
                            where('location', '==', locationQuery),
                        ),
                    )
                        .then(async (querySnapshot) => {
                            if (querySnapshot.empty) {
                                await goToNotFoundPage();
                                return;
                            }

                            const location = Mapper.docToLocation(querySnapshot.docs[0]);
                            if (location != null) {
                                setCurrentLocation(location);
                                docCache.locations[locationQuery] = location;
                            }
                        })
                        .catch((error) => {
                            Sentry.captureException(error);
                            console.error('Error getting documents: ', error);
                        });
                }
            }
        },
        [router, goToNotFoundPage, setCurrentCategory, setCurrentLocation],
    );

    useEffect(() => {
        createOnRouteChangeCb()();
    }, [createOnRouteChangeCb]);

    useEffect(() => {
        const cb = createOnRouteChangeCb();
        router.events.on('routeChangeComplete', cb);

        return () => {
            router.events.off('routeChangeComplete', cb);
        };
    }, [createOnRouteChangeCb, setCurrentCategory, setCurrentLocation, router.events]);

    const providerValue = useMemo(
        () => ({
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
        }),
        [
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
        ],
    );

    return (
        <NavigationContext.Provider value={providerValue}>{children}</NavigationContext.Provider>
    );
};

export const useNav = () => {
    const context = useContext(NavigationContext);

    if (context == null) {
        throw new Error('useNav must be used within a NavigationContextProvider');
    }

    return context;
};
