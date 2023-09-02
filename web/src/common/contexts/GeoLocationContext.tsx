import { AnalyticsEventEnum } from 'features/Analytics/AnalyticsEventEnum';
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
    useMemo,
} from 'react';
import { useAnalytics } from '../../features/Analytics/AnalyticsContext';

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
    const { logAnalyticsEvent } = useAnalytics();
    const [isGeoLocationAvailable, setIsGeoLocationAvailable] = useState<boolean>(false);
    const [isGeoLocationGranted, setIsGeoLocationGranted] = useState<boolean>(false);
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null);

    const requestLocationAccess = useCallback(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                logAnalyticsEvent(AnalyticsEventEnum.InstantSearchLocationAccessEnable);
                setLocation(position.coords);
                setIsGeoLocationGranted(true);
            },
            () => {
                setIsGeoLocationGranted(false);
            },
        );
    }, [setLocation, setIsGeoLocationGranted, logAnalyticsEvent]);

    useEffect(() => {
        setIsGeoLocationAvailable(navigator.geolocation != null);
        navigator.permissions
            .query({ name: 'geolocation' })
            .then((result) => {
                const isGranted = result.state === 'granted';
                setIsGeoLocationGranted(isGranted);
                if (isGranted) {
                    requestLocationAccess();
                }
            })
            .catch(() => {
                setIsGeoLocationAvailable(false);
            });
    }, [setIsGeoLocationAvailable, requestLocationAccess]);

    const providerValue = useMemo(
        () => ({
            isGeoLocationAvailable,
            isGeoLocationGranted,
            location,
            requestLocationAccess,
        }),
        [isGeoLocationAvailable, isGeoLocationGranted, location, requestLocationAccess],
    );

    return (
        <GeoLocationContext.Provider value={providerValue}>{children}</GeoLocationContext.Provider>
    );
};

export const useGeoLocation = () => {
    const context = useContext(GeoLocationContext);

    if (context === undefined) {
        throw new Error('useGeoLocation must be used within a GeoLocationContextProvider');
    }

    return context;
};