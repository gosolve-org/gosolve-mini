import { createContext, ReactNode, useContext } from "react";
import { useMediaQuery } from "react-responsive";

interface MediaQueryContext {
    isDesktopOrLaptop: boolean;
    isBigScreen: boolean;
    isTabletOrMobile: boolean;
    isPortrait: boolean;
    isRetina: boolean;
}

export const MediaQueryContext = createContext<MediaQueryContext>({
	isDesktopOrLaptop: true,
    isBigScreen: false,
    isTabletOrMobile: false,
    isPortrait: false,
    isRetina: false
});

export const MediaQueryContextProvider = ({ children }: { children: ReactNode }) => {
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
    const isBigScreen = useMediaQuery({ minWidth: 1824 });
    const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
    const isPortrait = useMediaQuery({ orientation: 'portrait' });
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

	return (
		<MediaQueryContext.Provider
			value={{
                isDesktopOrLaptop,
                isBigScreen,
                isTabletOrMobile,
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
