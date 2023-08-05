import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface GeoLocationContext {
    isGeoLocationAvailable: boolean;
    isGeoLocationGranted: boolean;
    location: GeolocationCoordinates | null;
    requestLocationAccess: () => void;
}

export const GeoLocationContext = createContext<GeoLocationContext>({
    isGeoLocationAvailable: false,
    isGeoLocationGranted: false,
    location: null,
    requestLocationAccess: () => {},
});

export const GeoLocationContextProvider = ({ children }: { children: ReactNode }) => {
    const [isGeoLocationAvailable, setIsGeoLocationAvailable] = useState<boolean>(false);
    const [isGeoLocationGranted, setIsGeoLocationGranted] = useState<boolean>(false);
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null);

    const requestLocationAccess = useCallback(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation(position.coords);
            setIsGeoLocationGranted(true);
        }, () => {
            setIsGeoLocationGranted(false);
        });
    }, [setLocation, setIsGeoLocationGranted]);

    useEffect(() => {
        setIsGeoLocationAvailable(!!navigator.geolocation);
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            const isGranted = result.state === 'granted';
            setIsGeoLocationGranted(isGranted);
            if (isGranted) {
                requestLocationAccess();
            }
        });
    }, [setIsGeoLocationAvailable]);

    return (
        <GeoLocationContext.Provider
            value={{
                isGeoLocationAvailable,
                isGeoLocationGranted,
                location,
                requestLocationAccess,
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
