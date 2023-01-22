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
import Image from "next/image";
import Link from "next/link";
import { Transition, Listbox } from "@headlessui/react";
import {
	MagnifyingGlassIcon,
	CheckIcon,
	ArrowRightIcon,
} from "@heroicons/react/20/solid";

import { Category } from "models/Category";
import { Location } from "models/Location";
import { db } from "utils/firebase";
import { useAuth } from "context/AuthContext";
import { DataContext } from "pages/_app";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

function Navbar() {
	const { user } = useAuth();
	const router = useRouter();
	const { handleCurrentCategoryIdChange, handleCurrentLocationIdChange } =
		useContext(DataContext);

	const [categoriesCollection] = useCollectionOnce(collection(db, "categories"));
	const [locationsCollection] = useCollectionOnce(collection(db, "locations"));

	const [searchQuery, setSearchQuery] = useState("");
	const [categories, setCategories] = useState<Category[]>([
		{ id: "", category: "" },
	]);
	const [locations, setLocations] = useState<Location[]>([
		{ id: "", location: "" },
	]);

	const [selectedCategory, setSelectedCategory] = useState<Category>();

	const [selectedLocation, setSelectedLocation] = useState<Location>();

	const readableCategory = router?.query?.category?.toString().split("-").join(" ");
	const readableLocation = router?.query?.location?.toString().split("-").join(" ");
	const readableSearchQuery = router?.query?.q?.toString().split("+").join(" ") ?? "";

	useEffect(() => {
		setCategories(
			categoriesCollection
				? categoriesCollection.docs.map((doc) => ({
						id: doc.id,
						category: doc.data().category,
				  }))
				: [{ id: "", category: "" }]
		);
	}, [categoriesCollection]);

	useEffect(() => {
		setLocations(
			locationsCollection
				? locationsCollection.docs.map((doc) => ({
						id: doc.id,
						location: doc.data().location,
				  }))
				: [{ id: "", location: "" }]
		);
	}, [locationsCollection]);

	useEffect(() => {
		const category = categories.find(
			(category) => category.category === readableCategory
		);
		if (category?.id) handleCurrentCategoryIdChange(category.id);
	}, [ categories, readableCategory, handleCurrentCategoryIdChange ]);

	useEffect(() => {
		const location = locations.find(
			(location) => location.location === readableLocation
		);
		if (location?.id) handleCurrentLocationIdChange(location.id);
	}, [ locations, readableLocation, handleCurrentLocationIdChange ]);

	useEffect(() => {
		setSearchQuery(readableSearchQuery);
	}, [ readableSearchQuery ]);

	useEffect(() => {
		setSelectedCategory(categories.find(
			(category) => category.category === readableCategory
		));
	}, [ readableCategory, categories ]);

	useEffect(() => {
		setSelectedLocation(locations.find(
			(location) => location.location === readableLocation
		));
	}, [ readableLocation, locations ]);

	const handleSearchQueryChange = (e: FormEvent<HTMLInputElement>) =>
		setSearchQuery(e.currentTarget.value);

	const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && searchQuery) {
			router.push(`/search?q=${searchQuery.split(" ").join("+")}`);
		}
	};

	const handleNavigate = () => {
		if (selectedCategory && selectedLocation) {
			handleCurrentCategoryIdChange(selectedCategory.id);
			handleCurrentLocationIdChange(selectedLocation.id);

			router.push(
				`/${selectedCategory.category
					.split(" ")
					.join("-")}/${selectedLocation.location
					.split(" ")
					.join("-")}`
			);
		}
	};

	return (
		<>
			<div className="mx-auto  px-1 sm:px-2 lg:px-4 bg-white shadow-sm lg:static lg:overflow-y-visible">
				<div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
					<div className="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
						<div className="flex flex-shrink-0 items-center">
							<Link href="/">
								<Image
									className="block h-6 w-auto"
									src="/images/gosolve_logo.svg"
									alt="goSolve Logo"
									width={100}
									height={37}
									priority
								/>
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
										id="search"
										name="search"
										className="block w-full rounded-3xl border border-gray-300 bg-white py-2 pl-4 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
										type="search"
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
											<Listbox.Button className="relative  cursor-default rounded-md border border-gray-300 bg-white py-2 px-3 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
												<span className="block truncate">
													{selectedCategory?.category 
														?? readableCategory
														??  "Select a category"
													}
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
													{categories.map(
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
											<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 px-3 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
												<span className="block truncate">
													{selectedLocation?.location
														?? readableLocation
														?? "Select a location"
													}
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
													{locations.map(
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
					</div>
				</div>
			</div>
		</>
	);
}

export default Navbar;
