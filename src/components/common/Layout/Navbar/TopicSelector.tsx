import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { DataContext } from "context/DataContext";
import { Category } from "models/Category";
import { Location } from "models/Location";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "utils/firebase";
import { toUrlPart } from "utils/textUtils";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dropdown, { DropdownItem } from "./Dropdown";
import { useMediaQueries } from "context/MediaQueryContext";
import { NavigationContext } from "context/NavigationContext";

const CATEGORY_DROPDOWN_PLACEHOLDER = 'Select a category';
const LOCATION_DROPDOWN_PLACEHOLDER = 'Select a location';

function categoryToDropdownItem(value: Category)
{
    const item = !!value ? {
        id: value.id,
        text: value.category,
        hidden: value.hidden,
    } : null;

    return (item as DropdownItem);
}

function locationToDropdownItem(value: Location)
{
    const item = !!value ? {
        id: value.id,
        text: value.location,
        hidden: value.hidden,
    } : null;

    return (item as DropdownItem);
}

function TopicSelector() {
    const router = useRouter();
    const { isTabletOrMobile } = useMediaQueries();
    const [isNavigating, setIsNavigating] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<Category>();
    const [selectedLocation, setSelectedLocation] = useState<Location>();

    const { handleCurrentCategoryChange, handleCurrentLocationChange, currentCategory, currentLocation } =
        useContext(DataContext);

    const handleNavigate = async () => {
        if (!selectedCategory || !selectedLocation) return;

        setIsNavigating(true);
        handleCurrentCategoryChange(selectedCategory);
        handleCurrentLocationChange(selectedLocation);

        await router.push(
            `/${toUrlPart(selectedCategory.category)}/${toUrlPart(selectedLocation.location)}`
        );
        setIsNavigating(false);
    };

    const [categoriesCollection] = useCollectionOnce(collection(db, "categories"));
    const [locationsCollection] = useCollectionOnce(collection(db, "locations"));

    const [categories, setCategories] = useState<Category[]>([
        { id: null, category: CATEGORY_DROPDOWN_PLACEHOLDER },
    ]);
    const [locations, setLocations] = useState<Location[]>([
        { id: null, location: LOCATION_DROPDOWN_PLACEHOLDER },
    ]);

    useEffect(() => {
        setCategories(
            categoriesCollection
                ? categoriesCollection.docs.map((doc) => {
                    const docData = doc.data();

                    return {
                        id: doc.id,
                        category: docData?.category,
                        hidden: docData?.hidden,
                    };
                  })
                : [{ id: null, category: CATEGORY_DROPDOWN_PLACEHOLDER }]
        );
    }, [categoriesCollection]);

    useEffect(() => {
        setLocations(
            locationsCollection
                ? locationsCollection.docs.map((doc) => {
                    const docData = doc.data();

                    return {
                        id: doc.id,
                        location: docData?.location,
                        hidden: docData?.hidden,
                    };
                  })
                : [{ id: null, location: LOCATION_DROPDOWN_PLACEHOLDER }]
        );
    }, [locationsCollection]);

    useEffect(() => {
        const category = categories.find(
            (category) => category.category === currentCategory?.category
        );
        if (category?.id) handleCurrentCategoryChange(category);
    }, [ categories, currentCategory, handleCurrentCategoryChange ]);

    useEffect(() => {
        const location = locations.find(
            (location) => location.location === currentLocation?.location
        );
        if (location?.id) handleCurrentLocationChange(location);
    }, [ locations, currentLocation, handleCurrentLocationChange ]);

    useEffect(() => {
        const category = categories.find(
            (category) => category.category === currentCategory?.category
        );

        const location = locations.find(
            (location) => location.location === currentLocation?.location
        );

        if (category?.hidden || location?.hidden) return;

        setSelectedCategory(category);
        setSelectedLocation(location);
    }, [ currentCategory, currentLocation, categories, locations ]);

    return (
        <div className={"flex justify-center items-center ".concat(isTabletOrMobile ? "flex-col" : "flex-row")}>
            <div className="w-full">
                <Dropdown
                    items={categories.map(categoryToDropdownItem)}
                    label="Category"
                    onSelect={item => setSelectedCategory(categories.find(el => el.id === item.id))}
                    placeholder={CATEGORY_DROPDOWN_PLACEHOLDER}
                    value={categoryToDropdownItem(selectedCategory)}
                />
            </div>
            <span className={"flex mx-1.5 text-base font-normal text-gray-400 ".concat(isTabletOrMobile && "my-2")}>
                in
            </span>
            <div className="w-full">
                <Dropdown
                    items={locations.map(locationToDropdownItem)}
                    label="Location"
                    onSelect={item => setSelectedLocation(locations.find(el => el.id === item.id))}
                    placeholder={LOCATION_DROPDOWN_PLACEHOLDER}
                    value={locationToDropdownItem(selectedLocation)}
                />
            </div>
            <span className={"mx-3.5 ".concat(isTabletOrMobile && "mt-3")}>
                <button
                    onClick={handleNavigate}
                    disabled={isNavigating}
                    type="button"
                    className="inline-flex items-center rounded-full border border-gray-300 bg-white p-1.5 text-black shadow-sm hover:bg-indigo-500 hover:border-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <ArrowRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </button>
            </span>
        </div>
    );
}

export default TopicSelector;
