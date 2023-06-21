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

function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <MediaQueryContextProvider>
            <AuthContextProvider>
                <GeoLocationContextProvider>
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
                </GeoLocationContextProvider>
            </AuthContextProvider>
        </MediaQueryContextProvider>
    );
}

export default App;
