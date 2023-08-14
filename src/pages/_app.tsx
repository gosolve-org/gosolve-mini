import 'styles/globals.css';
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AuthContextProvider } from "contexts/AuthContext";
import ProtectedRoute from "components/nav/ProtectedRoute";
import { PROTECTED_ROUTES } from "constants/protectedRoutes";
import { MediaQueryContextProvider } from "contexts/MediaQueryContext";
import '../styles/burger-menu.css';
import '../styles/novu.css';
import '../styles/editorjs.css';
import { NavigationContextProvider } from 'contexts/NavigationContext';
import Route from 'components/nav/Route';
import { GeoLocationContextProvider } from 'contexts/GeoLocationContext';
import { DataCacheContextProvider } from 'contexts/DataCacheContext';
import { AnalyticsContextProvider } from 'contexts/AnalyticsContext';

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
