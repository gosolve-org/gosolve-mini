import 'common/styles/globals.css';
import "react-toastify/dist/ReactToastify.css";
import 'features/Nav/Navbar/burger-menu.css'
import 'features/Notifications/novu.css';
import 'features/Editor/editorjs.css';
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AuthContextProvider } from "features/Auth/AuthContext";
import ProtectedRoute from "features/Nav/ProtectedRoute";
import { PROTECTED_ROUTES } from "features/Nav/protectedRoutes";
import { MediaQueryContextProvider } from "common/contexts/MediaQueryContext";
import { NavigationContextProvider } from 'features/Nav/NavigationContext';
import { GeoLocationContextProvider } from 'common/contexts/GeoLocationContext';
import { DataCacheContextProvider } from 'common/contexts/DataCacheContext';
import { AnalyticsContextProvider } from 'features/Analytics/AnalyticsContext';
import Route from 'features/Nav/Route';

function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    const providers = [
        DataCacheContextProvider,
        MediaQueryContextProvider,
        AuthContextProvider,
        AnalyticsContextProvider,
        GeoLocationContextProvider,
    ];

    const ProviderTree = ({ providers, children }) => {
        if (providers.length === 0) {
            return children;
        }

        const Provider = providers[0];
        return (
            <Provider>
                {ProviderTree({ providers: providers.slice(1), children })}
            </Provider>
        );
    };

    return (
        <ProviderTree providers={providers}>
            {PROTECTED_ROUTES.includes(router.pathname) ? (
                <ProtectedRoute>
                    <NavigationContextProvider>
                        <Component {...pageProps} />
                    </NavigationContextProvider>
                </ProtectedRoute>
            ) : (
                <Route>
                    <NavigationContextProvider>
                        <Component {...pageProps} />
                    </NavigationContextProvider>
                </Route>
            )}
        </ProviderTree>
    );
}

export default App;
