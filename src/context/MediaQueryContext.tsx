import { createContext, ReactNode, useContext } from "react";
import { useMediaQuery } from "react-responsive";

interface MediaQueryContext {
    isDesktopOrLaptop: boolean;
    isBigScreen: boolean;
    isTabletOrMobile: boolean;
    isTablet: boolean;
    isMobile: boolean;
    isPortrait: boolean;
    isRetina: boolean;
}

export const MediaQueryContext = createContext<MediaQueryContext>({
    isDesktopOrLaptop: true,
    isBigScreen: false,
    isTabletOrMobile: false,
    isTablet: false,
    isMobile: false,
    isPortrait: false,
    isRetina: false
});

export const MediaQueryContextProvider = ({ children }: { children: ReactNode }) => {
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1280 }); // TAILWIND: xl (1280)
    const isBigScreen = useMediaQuery({ minWidth: 1536 }); // TAILWIND: 2xl (1536)
    const isTabletOrMobile = useMediaQuery({ maxWidth: 1279 }); // TAILWIND: < sm (640) & sm & md & lg (1024)
    const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1279 }); // TAILWIND: sm (640) & md (768)
    const isMobile = useMediaQuery({ maxWidth: 639 }); // TAILWIND: < sm (< 640)
    const isPortrait = useMediaQuery({ orientation: 'portrait' });
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

    return (
        <MediaQueryContext.Provider
            value={{
                isDesktopOrLaptop,
                isBigScreen,
                isTabletOrMobile,
                isTablet,
                isMobile,
                isPortrait,
                isRetina
            }}
        >
            {children}
        </MediaQueryContext.Provider>
    );
};

export const useMediaQueries = () => {
    const context = useContext(MediaQueryContext);

    if (context === undefined) {
        throw new Error("useMediaQueries must be used within a MediaQueryContextProvider");
    }

    return context;
};
