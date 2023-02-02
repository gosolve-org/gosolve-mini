import { FormEvent, useContext } from "react";
import Link from "next/link";
import { Tab } from "models/Tab";
import { toUrlPart } from "utils/textUtils";
import { DataContext } from "context/DataContext";

const DEFAULT_PAGE_TITLE = 'Welcome to goSolve mini';
const TAB_WIDTH = 200;

const tabs = [
	{ name: "Topic", href: "", value: Tab.Topic, showOnHiddenTopics: true },
	{ name: "Actions", href: "actions", value: Tab.Actions, showOnHiddenTopics: false },
	{ name: "Community", href: "community", value: Tab.Community, showOnHiddenTopics: true },
];

const tabsContainerStyle = (amountOfTabs: number) => ({
	width: `${amountOfTabs * TAB_WIDTH}px`
});

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

function TopicHeader() {
	const { currentTab, currentCategory, currentLocation, handleCurrentTabChange } = useContext(DataContext);

	const handleTabChange = (e: FormEvent<HTMLSelectElement>) =>
		handleCurrentTabChange(Tab[e.currentTarget.value]);

	return (
		<div className="flex flex-col justify-center h-52 items-center bg-sky-100">
			<div className="mt-5 sm:mx-auto sm:w-full">
				<h1 className="w-full px-4 py-2 text-center text-3xl font-small tracking-tight text-black ">
					{currentCategory?.hidden || currentLocation?.hidden
						? DEFAULT_PAGE_TITLE
						: (currentCategory?.id && currentLocation?.id
							? `${currentCategory?.category} in ${currentLocation?.location}`
							: ''
						)
					}
				</h1>
			</div>
			<div className="mt-5" style={tabsContainerStyle(tabs.filter(el => (!currentCategory?.hidden && !currentLocation?.hidden) || el.showOnHiddenTopics).length)}>
				<div className="sm:hidden">
					<label htmlFor="tabs" className="sr-only">
						Select a tab
					</label>

					<select
						id="tabs"
						name="tabs"
						onChange={handleTabChange}
						value={currentTab ?? Tab.Topic}
						className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
					>
						{tabs.map((tab) => (
							<option key={tab.value}>{tab.name}</option>
						))}
					</select>
				</div>
				<div className="hidden sm:block">
					<nav
						className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
						aria-label="Tabs"
					>
						{!!currentCategory?.id && !!currentLocation?.id && tabs
							.filter(el => (!currentCategory?.hidden && !currentLocation?.hidden) || el.showOnHiddenTopics)
							.map((tab, tabIdx, tabArr) => (
								<Link
									key={tab.value}
									href={`/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/${tab.href}`}
									className={classNames(
										tab.name === currentTab
											? "text-gray-900"
											: "text-gray-500 hover:text-gray-700",
										tabIdx === 0 ? "rounded-l-lg" : "",
										tabIdx === tabArr.length - 1
											? "rounded-r-lg"
											: "",
										"group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
									)}
									aria-current={
										tab.value === currentTab ? "page" : undefined
									}
								>
									<span>{tab.name}</span>
									<span
										aria-hidden="true"
										className={classNames(
											tab.value === currentTab
												? "bg-indigo-500"
												: "bg-transparent",
											"absolute inset-x-0 bottom-0 h-0.5"
										)}
									/>
								</Link>
						))}
					</nav>
				</div>
			</div>
		</div>
	);
}

export default TopicHeader;
