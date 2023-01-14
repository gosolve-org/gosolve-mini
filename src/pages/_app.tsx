import "styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "components/common/ProtectedRoute";
import { UNPROTECTED_ROUTES } from "constants/protectedRoutes";

function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	return (
		<AuthProvider>
			{UNPROTECTED_ROUTES.includes(router.pathname) ? (
				<Component {...pageProps} />
			) : (
				<ProtectedRoute>
					<Component {...pageProps} />
				</ProtectedRoute>
			)}
		</AuthProvider>
	);
}

export default App;
