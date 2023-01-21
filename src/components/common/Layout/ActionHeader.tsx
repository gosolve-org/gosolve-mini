import { FormEvent, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";

import { db } from "utils/firebase";
import { DataContext } from "pages/_app";
import { Tab } from "models/Tab";

const tabs = [
	{ name: "Action", href: "", value: Tab.Action },
	{ name: "Community", href: "community", value: Tab.Community },
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

function ActionHeader() {
	const router = useRouter();
	const { currentTab, handleCurrentTabChange } = useContext(DataContext);

	const actionId = router?.query?.actionId?.toString() ?? '';

	const [actionsCollection] = useDocumentOnce(doc(db, "actions", actionId));

	const categoryQuery = router?.query?.category?.toString() ?? '...';
	const locationQuery = router?.query?.location?.toString() ?? '...';

	const readableCategory = categoryQuery.split("-").join(" ");
	const readableLocation = locationQuery.split("-").join(" ");

	const handleTabChange = (e: FormEvent<HTMLSelectElement>) =>
		handleCurrentTabChange(Tab[e.currentTarget.value]);

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
							{actionsCollection?.data()?.title ?? '\u00A0'}
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
								value={currentTab ?? Tab.Action}
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
								{tabs.map((tab, tabIdx) => (
									<Link
										key={tab.value}
										href={`/${categoryQuery}/${locationQuery}/actions/${actionId}/${tab.href}`}
										className={classNames(
											tab.value === currentTab
												? "text-gray-900"
												: "text-gray-500 hover:text-gray-700",
											tabIdx === 0 ? "rounded-l-lg" : "",
											tabIdx === tabs.length - 1
												? "rounded-r-lg"
												: "",
											"group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
										)}
										aria-current={
											tab.value === currentTab
												? "page"
												: undefined
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
			</div>
		</div>
	);
}

export default ActionHeader;
