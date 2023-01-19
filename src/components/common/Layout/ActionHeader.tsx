import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useDocument } from "react-firebase-hooks/firestore";
import { collection, query, where, doc } from "firebase/firestore";

import { db } from "utils/firebase";

const tabs = [
	{ name: "Action", href: "action" },
	{ name: "Community", href: "community" },
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

function ActionHeader() {
	const router = useRouter();
	const pathname = router.pathname;
	const [currentTab, setCurrentTab] = useState("Action");

	const actionId = router?.query?.action
		? router?.query?.action.toString()
		: "";

	const tabId = router?.query?.tab ? router?.query?.tab.toString() : "action";

	const [actionsCollection] = useDocument(doc(db, "actions", actionId), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	useEffect(() => {
		if (tabId === "community") setCurrentTab("Community");
		else setCurrentTab("Action");
	}, [tabId]);

	const categoryQuery = router?.query?.category
		? router?.query?.category.toString()
		: "...";
	const locationQuery = router?.query?.location
		? router?.query?.location.toString()
		: "...";

	const readableCategory = categoryQuery.split("-").join(" ");
	const readableLocation = locationQuery.split("-").join(" ");

	const renderTitle = () =>
		actionsCollection?.data()?.title ||
		`${readableCategory} in ${readableLocation}`;

	const handleTabChange = (e: FormEvent<HTMLSelectElement>) =>
		setCurrentTab(e.currentTarget.value);

	return (
		<div className="flex flex-col justify-center items-center ">
			<div className="w-[68%] md:max-xl:w-[68%] md:max-lg:w-[78%] md:max-sm:w-[88%]">
				<div className="mt-6 w-full flex justify-start items-center text-gray-500 text-sm">
					<Link href={`/${categoryQuery}/${locationQuery}`}>
						<ArrowLeftIcon
							className="h-4 w-4 inline-block items-center mr-1"
							aria-hidden="true"
						/>
						{`Back to ${readableCategory} in ${readableLocation}`}
					</Link>
				</div>
				<div className="flex flex-col justify-center h-52 mt-2 items-center rounded-md bg-sky-100">
					<div className="mt-5 sm:mx-auto sm:w-full">
						<h1 className=" px-4 py-2 text-center text-3xl font-small tracking-tight text-black ">
							{renderTitle()}
						</h1>
					</div>
					<div className="mt-5 w-[68%] md:max-xl:w-[68%] md:max-lg:w-[78%] md:max-sm:w-[88%]">
						<div className="sm:hidden">
							<label htmlFor="tabs" className="sr-only">
								Select a tab
							</label>

							<select
								id="tabs"
								name="tabs"
								onChange={handleTabChange}
								value={currentTab}
								className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
							>
								{tabs.map((tab) => (
									<option key={tab.name}>{tab.name}</option>
								))}
							</select>
						</div>
						<div className="hidden sm:block">
							<nav
								className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
								aria-label="Tabs"
							>
								{tabs.map((tab, tabIdx) => (
									<Link
										key={tab.name}
										href={`/${categoryQuery}/${locationQuery}/actions?action=${actionId}&tab=${tab.href}`}
										className={classNames(
											tab.name === currentTab
												? "text-gray-900"
												: "text-gray-500 hover:text-gray-700",
											tabIdx === 0 ? "rounded-l-lg" : "",
											tabIdx === tabs.length - 1
												? "rounded-r-lg"
												: "",
											"group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
										)}
										aria-current={
											tab.name === currentTab
												? "page"
												: undefined
										}
									>
										<span>{tab.name}</span>
										<span
											aria-hidden="true"
											className={classNames(
												tab.name === currentTab
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
			</div>
		</div>
	);
}

export default ActionHeader;
