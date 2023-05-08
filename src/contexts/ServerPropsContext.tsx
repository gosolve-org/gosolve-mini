import { ReactNode, createContext, useContext } from "react";

interface ServerPropsContext {
    bannerBlurBase64?: string;
}

export const ServerPropsContext = createContext<ServerPropsContext>({
    bannerBlurBase64: null,
});

export const ServerPropsContextProvider = ({ children, bannerBlurBase64 }: {
    children: ReactNode,
    bannerBlurBase64?: string,
}) => {
    return (
        <ServerPropsContext.Provider
            value={{
                bannerBlurBase64,
            }}
        >
            {children}
        </ServerPropsContext.Provider>
    );
};

export const useServerProps = () => {
    const context = useContext(ServerPropsContext);

    if (context === undefined) {
        throw new Error("useServerProps must be used within a ServerPropsContextProvider");
    }

    return context;
};
