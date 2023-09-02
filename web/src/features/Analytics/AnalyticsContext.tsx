import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
    useMemo,
} from 'react';
import { type Analytics, isSupported, logEvent } from 'firebase/analytics';
import { getAnalytics } from 'utils/firebase';
import { type AnalyticsEventEnum } from './AnalyticsEventEnum';
import { useAuth } from '../Auth/AuthContext';

interface AnalyticsContext {
    logAnalyticsEvent: (event: AnalyticsEventEnum, eventParams?: Record<string, any>) => void;
}

export const AnalyticsContext = createContext<AnalyticsContext>({
    logAnalyticsEvent: () => undefined,
});

export const AnalyticsContextProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState<Analytics | null>(null);

    useEffect(() => {
        isSupported()
            .then((result) => {
                setAnalytics(result ? getAnalytics() : null);
            })
            .catch(() => undefined);
    }, [setAnalytics]);

    const logAnalyticsEvent = useCallback(
        (event: AnalyticsEventEnum, eventParams?: Record<string, any>) => {
            if (!analytics) return;
            const baseProperties = { userId: user?.uid };
            logEvent(analytics, event, { ...(eventParams ?? {}), ...baseProperties });
        },
        [analytics, user],
    );

    const providerValue = useMemo(() => ({ logAnalyticsEvent }), [logAnalyticsEvent]);

    return <AnalyticsContext.Provider value={providerValue}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);

    if (context === undefined) {
        throw new Error('useAnalytics must be used within a AnalyticsContextProvider');
    }

    return context;
};
