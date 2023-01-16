import {
	useState,
	Fragment,
	useEffect,
	FormEvent,
	KeyboardEvent,
	FormControl,
} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Transition, Listbox } from "@headlessui/react";
import {
	MagnifyingGlassIcon,
	CheckIcon,
	ArrowRightIcon,
} from "@heroicons/react/20/solid";

import { useAuth } from "context/AuthContext";

const categories = [
	{ id: 1, name: "Covid19" },
	{ id: 2, name: "Climate Change" },
	{ id: 3, name: "Inequality" },
	{ id: 4, name: "Education" },
	{ id: 5, name: "Poverty" },
	{ id: 6, name: "Human Trafficking" },
];

const locations = [
	{ id: 1, name: "UK" },
	{ id: 2, name: "United States" },
	{ id: 3, name: "Canada" },
	{ id: 4, name: "Belgium" },
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

function Navbar() {
	const { user } = useAuth();
	const router = useRouter();

	const [searchQuery, setSearchQuery] = useState("");

	const readableTopicId = router?.query?.topic
		? router?.query?.topic.toString().split("-").join(" ")
		: "...";
	const readableLocationId = router?.query?.location
		? router?.query?.location.toString().split("-").join(" ")
		: "...";
	const readableSearchQuery = router?.query?.q
		? router?.query?.q.toString().split("+").join(" ")
		: "...";

	const [selectedCategory, setSelectedCategory] = useState<{
		id: number;
		name: string;
	}>();
	const [selectedLocation, setSelectedLocation] = useState<{
		id: number;
		name: string;
	}>();

	useEffect(() => {
		setSelectedCategory(
			categories.find((category) => category.name === readableTopicId)
		);
		setSelectedLocation(
			locations.find((location) => location.name === readableLocationId)
		);
		setSearchQuery(readableSearchQuery);
	}, [readableTopicId, readableLocationId, readableSearchQuery]);

	const handleSearchQueryChange = (e: FormEvent<HTMLInputElement>) =>
		setSearchQuery(e.currentTarget.value);

	const handleSearchKeyPress = (e: KeyboardEvent<FormControl>) => {
		if (e.key === "Enter" && searchQuery) {
			router.push(`/search?q=${searchQuery.split(" ").join("+")}`);
		}
	};

	const handleNavigate = () => {
		if (selectedCategory && selectedLocation)
			router.push(
				`/${selectedCategory.name
					.split(" ")
					.join("-")}/${selectedLocation.name.split(" ").join("-")}`
			);
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
										onKeyPress={handleSearchKeyPress}
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
													{selectedCategory
														? selectedCategory.name
														: "Enter the category name"}
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
																				category.name
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
													{selectedLocation
														? selectedLocation.name
														: "Enter the location name"}
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
																				location.name
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
								<span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
									<svg
										className="h-full w-full text-gray-300"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
									</svg>
								</span>
							)}
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}

export default Navbar;
