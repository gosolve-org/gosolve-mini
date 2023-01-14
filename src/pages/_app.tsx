import "styles/globals.css";
import type { AppProps } from "next/app";

import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "components/common/ProtectedRoute";

function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<ProtectedRoute>
				<Component {...pageProps} />
			</ProtectedRoute>
		</AuthProvider>
	);
}

export default App;
