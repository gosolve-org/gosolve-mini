import 'styles/globals.css';
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { AuthContextProvider } from "context/AuthContext";
import ProtectedRoute from "components/common/ProtectedRoute";
import { PROTECTED_ROUTES } from "constants/protectedRoutes";
import { DataContextProvider } from "context/DataContext";
import { MediaQueryContextProvider } from "context/MediaQueryContext";
import '../styles/burger-menu.css';
import '../styles/novu.css';
import { NavigationContextProvider } from 'context/NavigationContext';
import Route from 'components/common/Route';

function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <MediaQueryContextProvider>
            <AuthContextProvider>
                {PROTECTED_ROUTES.includes(router.pathname) ? (
                    <ProtectedRoute>
                        <DataContextProvider>
                            <NavigationContextProvider>
                                <Component {...pageProps} />
                            </NavigationContextProvider>
                        </DataContextProvider>
                    </ProtectedRoute>
                ) : (
                    <Route>
                        <DataContextProvider>
                            <NavigationContextProvider>
                                <Component {...pageProps} />
                            </NavigationContextProvider>
                        </DataContextProvider>
                    </Route>
                )}
            </AuthContextProvider>
        </MediaQueryContextProvider>
    );
}

export default App;
