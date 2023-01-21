import "styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useState, createContext } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "components/common/ProtectedRoute";
import { UNPROTECTED_ROUTES } from "constants/protectedRoutes";
import { Tab } from "models/Tab";

interface DataContext {
	currentCategoryId: string;
	currentLocationId: string;
	currentTab: Tab | null;
	handleCurrentCategoryIdChange: (id: string) => void;
	handleCurrentLocationIdChange: (id: string) => void;
	handleCurrentTabChange: (tab: Tab) => void;
}

export const DataContext = createContext<DataContext>({
	currentCategoryId: "",
	currentLocationId: "",
	currentTab: null,
	handleCurrentCategoryIdChange: (id: string) => {},
	handleCurrentLocationIdChange: (id: string) => {},
	handleCurrentTabChange: (tab: Tab) => {},
});

function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [currentCategoryId, setCurrentCategoryId] = useState("");
	const [currentLocationId, setCurrentLocationId] = useState("");
	const [currentTab, setCurrentTab] = useState(null);

	const handleCurrentCategoryIdChange = (id: string) =>
		setCurrentCategoryId(id);
	const handleCurrentLocationIdChange = (id: string) =>
		setCurrentLocationId(id);
	const handleCurrentTabChange = (tab: Tab) =>
		setCurrentTab(tab);

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
							currentTab,
							handleCurrentCategoryIdChange,
							handleCurrentLocationIdChange,
							handleCurrentTabChange,
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
