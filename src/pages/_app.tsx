import 'styles/globals.css';
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { AuthContextProvider } from "context/AuthContext";
import ProtectedRoute from "components/common/ProtectedRoute";
import { UNPROTECTED_ROUTES } from "constants/protectedRoutes";
import { DataContextProvider } from "context/DataContext";
import { MediaQueryContextProvider } from "context/MediaQueryContext";

function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	return (
		<MediaQueryContextProvider>
			<AuthContextProvider>
				{UNPROTECTED_ROUTES.includes(router.pathname) ? (
					<Component {...pageProps} />
				) : (
					<ProtectedRoute>
						<DataContextProvider>
							<Component {...pageProps} />
						</DataContextProvider>
					</ProtectedRoute>
				)}
			</AuthContextProvider>
		</MediaQueryContextProvider>
	);
}

export default App;
