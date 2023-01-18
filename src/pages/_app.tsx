import "styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useState, createContext } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "components/common/ProtectedRoute";
import { UNPROTECTED_ROUTES } from "constants/protectedRoutes";

export const DataContext = createContext({
	currentCategoryId: "",
	currentLocationId: "",
	handleCurrentCategoryIdChange: (id: string) => {},
	handleCurrentLocationIdChange: (id: string) => {},
});

function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [currentCategoryId, setCurrentCategoryId] = useState("");
	const [currentLocationId, setCurrentLocationId] = useState("");

	const handleCurrentCategoryIdChange = (id: string) =>
		setCurrentCategoryId(id);
	const handleCurrentLocationIdChange = (id: string) =>
		setCurrentLocationId(id);

	return (
		<AuthProvider>
			{UNPROTECTED_ROUTES.includes(router.pathname) ? (
				<Component {...pageProps} />
			) : (
				<ProtectedRoute>
					<DataContext.Provider
						value={{
							currentCategoryId,
							currentLocationId,
							handleCurrentCategoryIdChange,
							handleCurrentLocationIdChange,
						}}
					>
						<Component {...pageProps} />
					</DataContext.Provider>
				</ProtectedRoute>
			)}
		</AuthProvider>
	);
}

export default App;
