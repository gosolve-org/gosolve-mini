import { Category } from "models/Category";
import { Location } from "models/Location";
import { Tab } from "models/Tab";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { urlPartToReadable } from "utils/textUtils";

interface DataContext {
	currentCategory: Category;
	currentLocation: Location;
	currentTab: Tab | null;
	handleCurrentCategoryChange: (category: Category) => void;
	handleCurrentLocationChange: (location: Location) => void;
	handleCurrentTabChange: (tab: Tab) => void;
}

export const DataContext = createContext<DataContext>({
	currentCategory: null,
	currentLocation: null,
	currentTab: null,
	handleCurrentCategoryChange: () => {},
	handleCurrentLocationChange: () => {},
	handleCurrentTabChange: () => {},
});

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter();

	const [currentCategory, setCurrentCategory] = useState<Category>();
	const [currentLocation, setCurrentLocation] = useState<Location>();
	const [currentTab, setCurrentTab] = useState(null);

	const handleCurrentCategoryChange = (category: Category) =>
		setCurrentCategory(category);
	const handleCurrentLocationChange = (location: Location) =>
		setCurrentLocation(location);
	const handleCurrentTabChange = (tab: Tab) =>
		setCurrentTab(tab);

	useEffect(() => {
		setCurrentCategory({
			id: null,
			category: urlPartToReadable(router?.query?.category?.toString()) ?? '...'
		});
	}, [ router?.query?.category ]);

	useEffect(() => {
		setCurrentLocation({
			id: null,
			location: urlPartToReadable(router?.query?.location?.toString()) ?? '...'
		});
	}, [ router?.query?.location ]);

	return (
		<DataContext.Provider
			value={{
                currentCategory,
                currentLocation,
                currentTab,
                handleCurrentCategoryChange,
                handleCurrentLocationChange,
                handleCurrentTabChange,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};
