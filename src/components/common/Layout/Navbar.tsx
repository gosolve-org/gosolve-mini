import {
	useState,
	Fragment,
	useEffect,
	FormEvent,
	KeyboardEvent,
	useContext,
} from "react";
import { useRouter } from "next/router";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import Link from "next/link";
import { Transition, Listbox } from "@headlessui/react";
import {
	MagnifyingGlassIcon,
	CheckIcon,
	ArrowRightIcon,
	ChevronDownIcon,
} from "@heroicons/react/20/solid";

import { BellIcon, MegaphoneIcon } from "@heroicons/react/24/outline";

import { Category } from "models/Category";
import { Location } from "models/Location";
import { db } from "utils/firebase";
import { useAuth } from "context/AuthContext";
import { toUrlPart } from "utils/textUtils";
import { DataContext } from "context/DataContext";
import ResponsiveLogo from "./ResponsiveLogo";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { LINKS } from "constants/links";
import NotificationsBell from "./NotificationsBell";

const CATEGORY_DROPDOWN_PLACEHOLDER = 'Select a category';
const LOCATION_DROPDOWN_PLACEHOLDER = 'Select a location';

const topicSelectorStyle = {
	minWidth: '150px',
};

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

function Navbar() {
	const { user } = useAuth();
	const router = useRouter();
	const { handleCurrentCategoryChange, handleCurrentLocationChange, currentCategory, currentLocation } =
		useContext(DataContext);
	const [isNavigating, setIsNavigating] = useState(false);

	const [categoriesCollection] = useCollectionOnce(collection(db, "categories"));
	const [locationsCollection] = useCollectionOnce(collection(db, "locations"));

	const [searchQuery, setSearchQuery] = useState("");
	const [categories, setCategories] = useState<Category[]>([
		{ id: null, category: CATEGORY_DROPDOWN_PLACEHOLDER },
	]);
	const [locations, setLocations] = useState<Location[]>([
		{ id: null, location: LOCATION_DROPDOWN_PLACEHOLDER },
	]);

	const [selectedCategory, setSelectedCategory] = useState<Category>();

	const [selectedLocation, setSelectedLocation] = useState<Location>();

	const readableSearchQuery = router?.query?.q?.toString().split("+").join(" ") ?? "";

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
		setSearchQuery(readableSearchQuery);
	}, [ readableSearchQuery ]);

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

	const handleSearchQueryChange = (e: FormEvent<HTMLInputElement>) =>
		setSearchQuery(e.currentTarget.value);

	const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && searchQuery) {
			router.push(`/search?q=${searchQuery.split(" ").join("+")}`);
		}
	};

	const handleNavigate = async () => {
		setIsNavigating(true);
		if (selectedCategory && selectedLocation) {
			handleCurrentCategoryChange(selectedCategory);
			handleCurrentLocationChange(selectedLocation);

			await router.push(
				`/${toUrlPart(selectedCategory.category)}/${toUrlPart(selectedLocation.location)}`
			);
			setIsNavigating(false);
		}
	};

	return (
		<>
			<div className="mx-auto  px-1 sm:px-2 lg:px-4 bg-white shadow-sm lg:static lg:overflow-y-visible">
				<div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
					<div className="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
						<div className="flex flex-shrink-0 items-center">
							<Link href="/">
								<ResponsiveLogo className="block h-6 w-auto" />
							</Link>
						</div>
					</div>
					<div className="flex min-w-0 w-full flex-1 flex-row justify-center items-center px-6 py-2 md:px-8 lg:px-0 xl:col-span-8">
						<span>
							<div>
								<label htmlFor="search" className="sr-only">
									Search
								</label>
								<div className="relative">
									<input
										autoComplete="off"
										id="search"
										name="search"
										className="block w-full rounded-3xl border border-gray-300 bg-white py-2 pl-4 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
										type="text"
										value={searchQuery}
										onChange={handleSearchQueryChange}
										onKeyUp={handleSearchKeyPress}
									/>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
										<MagnifyingGlassIcon
											className="h-5 w-5 text-gray-400"
											aria-hidden="true"
										/>
									</div>
								</div>
							</div>
						</span>
						<span className="w-0.5 h-5 mx-5 bg-gray-200"></span>
						<span>
							<Listbox
								value={selectedCategory || {}}
								onChange={setSelectedCategory}
							>
								{({ open }) => (
									<>
										<Listbox.Label className="sr-only">
											Category
										</Listbox.Label>
										<div className="relative">
											<Listbox.Button className="flex relative  cursor-default rounded-md border border-gray-300 bg-white py-2 px-3 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
												<span className="block truncate grow" style={topicSelectorStyle}>
													{selectedCategory?.category ?? CATEGORY_DROPDOWN_PLACEHOLDER}
												</span>
												<span className="pointer-events-none inset-y-0 right-0 flex items-center pl-1">
													<ChevronDownIcon
														className="h-5 w-5 text-gray-400"
														aria-hidden="true"
													/>
												</span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
											>
												<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
													{categories.filter(el => !el?.hidden).map(
														(category) => (
															<Listbox.Option
																key={
																	category.id
																}
																className={({
																	active,
																}) =>
																	classNames(
																		active
																			? "text-white bg-indigo-600"
																			: "text-gray-900",
																		"relative cursor-default select-none py-2 pl-8 pr-4"
																	)
																}
																value={category}
															>
																{({
																	selected,
																	active,
																}) => (
																	<>
																		<span
																			className={classNames(
																				selected
																					? "font-semibold"
																					: "font-normal",
																				"block truncate"
																			)}
																		>
																			{
																				category.category
																			}
																		</span>

																		{selected ? (
																			<span
																				className={classNames(
																					active
																						? "text-white"
																						: "text-indigo-600",
																					"absolute inset-y-0 left-0 flex items-center pl-1.5"
																				)}
																			>
																				<CheckIcon
																					className="h-5 w-5"
																					aria-hidden="true"
																				/>
																			</span>
																		) : null}
																	</>
																)}
															</Listbox.Option>
														)
													)}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
						</span>
						<span className="mx-1.5 text-base font-normal text-gray-400">
							in
						</span>
						<span>
							<Listbox
								value={selectedLocation || {}}
								onChange={setSelectedLocation}
							>
								{({ open }) => (
									<>
										<Listbox.Label className="sr-only">
											Location
										</Listbox.Label>
										<div className="relative">
											<Listbox.Button className="flex relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 px-3 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
												<span className="block truncate grow" style={topicSelectorStyle}>
													{selectedLocation?.location ?? LOCATION_DROPDOWN_PLACEHOLDER}
												</span>
												<span className="pointer-events-none inset-y-0 right-0 flex items-center pl-1">
													<ChevronDownIcon
														className="h-5 w-5 text-gray-400"
														aria-hidden="true"
													/>
												</span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
											>
												<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
													{locations.filter(el => !el?.hidden).map(
														(location) => (
															<Listbox.Option
																key={
																	location.id
																}
																className={({
																	active,
																}) =>
																	classNames(
																		active
																			? "text-white bg-indigo-600"
																			: "text-gray-900",
																		"relative cursor-default select-none py-2 pl-8 pr-4"
																	)
																}
																value={location}
															>
																{({
																	selected,
																	active,
																}) => (
																	<>
																		<span
																			className={classNames(
																				selected
																					? "font-semibold"
																					: "font-normal",
																				"block truncate"
																			)}
																		>
																			{
																				location.location
																			}
																		</span>

																		{selected ? (
																			<span
																				className={classNames(
																					active
																						? "text-white"
																						: "text-indigo-600",
																					"absolute inset-y-0 left-0 flex items-center pl-1.5"
																				)}
																			>
																				<CheckIcon
																					className="h-5 w-5"
																					aria-hidden="true"
																				/>
																			</span>
																		) : null}
																	</>
																)}
															</Listbox.Option>
														)
													)}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
						</span>
						<span className="mx-3.5">
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

					<div className="flex items-center justify-end xl:col-span-2">
						{/* NOTIFICATIONS BELL */}
						<div className="mr-2">
							<NotificationsBell
								bellIcon={<>
									<Tippy content="Notifications">
										<div>
											<BellIcon className="h-7 w-7 text-gray-light cursor-pointer"/>
										</div>
									</Tippy>
								</>}
							/>
						</div>

						{/* FEEDBACK ICON */}
						<div className="mr-2">
							<Tippy content="Give Feedback">
								<Link href={LINKS.feedbackForm} target="_blank">
									<MegaphoneIcon className="h-7 w-7 text-gray-light"></MegaphoneIcon>
								</Link>
							</Tippy>
						</div>

						{/* ACCOUNT SETTINGS ICON */}
						<div className="select-none">
							<Tippy content="Account Settings">
								<Link href="/settings">
									{user?.photoURL ? (
										<img
											referrerPolicy="no-referrer"
											className="h-8 w-8 rounded-full"
											src={user?.photoURL}
											alt="User Avatar"
										/>
									) : (
										<div className="flex justify-center">
											<span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
												<svg
													className="h-full w-full text-gray-300"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
												</svg>
											</span>
										</div>
									)}
								</Link>
							</Tippy>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Navbar;
