import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface GeoLocationContext {
    isGeoLocationAvailable: boolean;
    isGeoLocationGranted: boolean;
    location: GeolocationCoordinates | null;
}

export const GeoLocationContext = createContext<GeoLocationContext>({
    isGeoLocationAvailable: false,
    isGeoLocationGranted: false,
    location: null,
});

export const GeoLocationContextProvider = ({ children }: { children: ReactNode }) => {
    const [isGeoLocationAvailable, setIsGeoLocationAvailable] = useState<boolean>(false);
    const [isGeoLocationGranted, setIsGeoLocationGranted] = useState<boolean>(false);
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null);

    useEffect(() => {
        setIsGeoLocationAvailable(!!navigator.geolocation);

        navigator.geolocation.getCurrentPosition((position) => {
            setLocation(position.coords);
            setIsGeoLocationGranted(true);
        }, () => {
            setIsGeoLocationGranted(false);
        });
    }, []);

    return (
        <GeoLocationContext.Provider
            value={{
                isGeoLocationAvailable,
                isGeoLocationGranted,
                location,
            }}
        >
            {children}
        </GeoLocationContext.Provider>
    );
};

export const useGeoLocation = () => {
    const context = useContext(GeoLocationContext);

    if (context === undefined) {
        throw new Error("useGeoLocation must be used within a GeoLocationContextProvider");
    }

    return context;
};
