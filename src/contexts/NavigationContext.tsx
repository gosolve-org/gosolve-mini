import { Category } from "models/Category";
import { Location } from "models/Location";
import { Tab } from "models/Tab";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { urlPartToReadable } from "utils/textUtils";

interface NavigationContext {
    isBurgerMenuOpen: boolean;
    closeBurgerMenu: () => void;
    openBurgerMenu: () => void;
    currentCategory: Category;
    currentLocation: Location;
    currentTab: Tab | null;
    handleCurrentCategoryChange: (category: Category) => void;
    handleCurrentLocationChange: (location: Location) => void;
    handleCurrentTabChange: (tab: Tab) => void;
}

const NavigationContext = createContext<NavigationContext>({
    isBurgerMenuOpen: false,
    closeBurgerMenu: null,
    openBurgerMenu: null,
    currentCategory: null,
    currentLocation: null,
    currentTab: null,
    handleCurrentCategoryChange: () => {},
    handleCurrentLocationChange: () => {},
    handleCurrentTabChange: () => {},
});

export const NavigationContextProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState<boolean>(false);

    const openBurgerMenu = () => setIsBurgerMenuOpen(true);
    const closeBurgerMenu = () => setIsBurgerMenuOpen(false);

    useEffect(() => {
        let isCleanedUp = false;

        router.events.on("routeChangeComplete", () => {
            if (!isCleanedUp && isBurgerMenuOpen) {
                setIsBurgerMenuOpen(false);
            }
        });

        return () => {
            isCleanedUp = true;
            router.events.off("routeChangeComplete", () => {});
        };
    }, [isBurgerMenuOpen, setIsBurgerMenuOpen, router.events]);

    const [currentCategory, setCurrentCategory] = useState<Category>();
    const [currentLocation, setCurrentLocation] = useState<Location>();
    const [currentTab, setCurrentTab] = useState(null);

    const handleCurrentCategoryChange = (category: Category) =>
        setCurrentCategory(category);
    const handleCurrentLocationChange = (location: Location) =>
        setCurrentLocation(location);
    const handleCurrentTabChange = (tab: Tab) =>
        setCurrentTab(tab);

    useEffect(() => {
        setCurrentCategory({
            id: null,
            category: urlPartToReadable(router?.query?.category?.toString()) ?? '...'
        });
    }, [ router?.query?.category ]);

    useEffect(() => {
        setCurrentLocation({
            id: null,
            location: urlPartToReadable(router?.query?.location?.toString()) ?? '...'
        });
    }, [ router?.query?.location ]);

    return (
        <NavigationContext.Provider
            value={{
                isBurgerMenuOpen,
                openBurgerMenu,
                closeBurgerMenu,
                currentCategory,
                currentLocation,
                currentTab,
                handleCurrentCategoryChange,
                handleCurrentLocationChange,
                handleCurrentTabChange,
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
