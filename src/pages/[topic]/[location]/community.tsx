import { useRouter } from "next/router";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
	CodeBracketIcon,
	EllipsisVerticalIcon,
	FlagIcon,
	StarIcon,
} from "@heroicons/react/20/solid";

import { Layout } from "components/common";

const communities = [
	{ name: "Fundraiser for Cancer Research" },
	{ name: "Fundraiser for Cancer Research" },
	{ name: "Fundraiser for Cancer Research" },
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

function Community() {
	const router = useRouter();
	const routerPathname = router.pathname;

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
				<div className="w-1/2">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Community
					</h3>
					<dl className="mt-5 flex flex-col w-full">
						{communities.map((item) => (
							<div
								className="bg-white px-4 py-5 sm:px-6"
								key={item.name}
							>
								<div className="flex space-x-3">
									<div className="flex-shrink-0">
										<img
											className="h-10 w-10 rounded-full"
											src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
											alt=""
										/>
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-gray-900">
											<a
												href="#"
												className="hover:underline"
											>
												{item.name}
											</a>
										</p>
										<p className="text-sm text-gray-500">
											<a
												href="#"
												className="hover:underline"
											>
												December 9 at 11:43 AM
											</a>
										</p>
									</div>
									<div className="flex flex-shrink-0 self-center">
										<Menu
											as="div"
											className="relative inline-block text-left"
										>
											<div>
												<Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
													<span className="sr-only">
														Open options
													</span>
													<EllipsisVerticalIcon
														className="h-5 w-5"
														aria-hidden="true"
													/>
												</Menu.Button>
											</div>

											<Transition
												as={Fragment}
												enter="transition ease-out duration-100"
												enterFrom="transform opacity-0 scale-95"
												enterTo="transform opacity-100 scale-100"
												leave="transition ease-in duration-75"
												leaveFrom="transform opacity-100 scale-100"
												leaveTo="transform opacity-0 scale-95"
											>
												<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
													<div className="py-1">
														<Menu.Item>
															{({ active }) => (
																<a
																	href="#"
																	className={classNames(
																		active
																			? "bg-gray-100 text-gray-900"
																			: "text-gray-700",
																		"flex px-4 py-2 text-sm"
																	)}
																>
																	<StarIcon
																		className="mr-3 h-5 w-5 text-gray-400"
																		aria-hidden="true"
																	/>
																	<span>
																		Add to
																		favorites
																	</span>
																</a>
															)}
														</Menu.Item>
														<Menu.Item>
															{({ active }) => (
																<a
																	href="#"
																	className={classNames(
																		active
																			? "bg-gray-100 text-gray-900"
																			: "text-gray-700",
																		"flex px-4 py-2 text-sm"
																	)}
																>
																	<CodeBracketIcon
																		className="mr-3 h-5 w-5 text-gray-400"
																		aria-hidden="true"
																	/>
																	<span>
																		Embed
																	</span>
																</a>
															)}
														</Menu.Item>
														<Menu.Item>
															{({ active }) => (
																<a
																	href="#"
																	className={classNames(
																		active
																			? "bg-gray-100 text-gray-900"
																			: "text-gray-700",
																		"flex px-4 py-2 text-sm"
																	)}
																>
																	<FlagIcon
																		className="mr-3 h-5 w-5 text-gray-400"
																		aria-hidden="true"
																	/>
																	<span>
																		Report
																		content
																	</span>
																</a>
															)}
														</Menu.Item>
													</div>
												</Menu.Items>
											</Transition>
										</Menu>
									</div>
								</div>
							</div>
						))}
					</dl>
				</div>
			</div>
		</Layout>
	);
}

export default Community;
