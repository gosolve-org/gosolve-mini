import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Analytics, isSupported, logEvent } from "firebase/analytics";
import { AnalyticsEvent } from "../models/AnalyticsEvent";
import { getAnalytics } from "utils/firebase";
import { useAuth } from "./AuthContext";

interface AnalyticsContext {
    logAnalyticsEvent: (event: AnalyticsEvent, eventParams?: { [key: string]: any }) => void;
}

export const AnalyticsContext = createContext<AnalyticsContext>({
    logAnalyticsEvent: null
});

export const AnalyticsContextProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState<Analytics>(null);
    
    useEffect(() => {
        isSupported().then(result => setAnalytics(result ? getAnalytics() : null));
    }, [setAnalytics]);

    const logAnalyticsEvent = useCallback((event: AnalyticsEvent, eventParams?: { [key: string]: any }) => {
        if (!analytics) return;
        const baseProperties = { userId: user?.uid };
        logEvent(analytics, event, { ...(eventParams ?? {}), ...baseProperties });
    }, [analytics, user]);

    return (
        <AnalyticsContext.Provider
            value={{
                logAnalyticsEvent,
            }}
        >
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);

    if (context === undefined) {
        throw new Error("useAnalytics must be used within a AnalyticsContextProvider");
    }

    return context;
};
