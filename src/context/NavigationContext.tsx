import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

interface NavigationContext {
    isBurgerMenuOpen: boolean;
    closeBurgerMenu: () => void;
    openBurgerMenu: () => void;
}

export const NavigationContext = createContext<NavigationContext>({
    isBurgerMenuOpen: false,
    closeBurgerMenu: null,
    openBurgerMenu: null,
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

    return (
        <NavigationContext.Provider
            value={{
                isBurgerMenuOpen,
                openBurgerMenu,
                closeBurgerMenu,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};
