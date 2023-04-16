import { useContext, useState } from "react";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/20/solid";

import { BellIcon, MegaphoneIcon } from "@heroicons/react/24/outline";

import { useAuth } from "context/AuthContext";
import ResponsiveLogo from "../ResponsiveLogo";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { LINKS } from "constants/links";
import NotificationsBell from "./NotificationsBell";
import { useMediaQueries } from "context/MediaQueryContext";
import BurgerMenu from "./BurgerMenu";
import SearchBar from "./SearchBar";
import TopicSelector from "./TopicSelector";
import { NavigationContext } from "context/NavigationContext";

function Navbar() {
    const { user } = useAuth();
    const { isTabletOrMobile } = useMediaQueries();
    const { isBurgerMenuOpen, closeBurgerMenu, openBurgerMenu } = useContext(NavigationContext);

    return (
        <>
            {isTabletOrMobile && <BurgerMenu isOpen={isBurgerMenuOpen} onOpen={openBurgerMenu} onClose={closeBurgerMenu}></BurgerMenu>}
            <div className="mx-auto  px-1 sm:px-2 lg:px-4 bg-white shadow-sm lg:static lg:overflow-y-visible">
                <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">

                    { isTabletOrMobile
                        ? (
                            <div className="flex md:inset-y-0 md:left-0 lg:static xl:col-span-2">
                                <div className="flex flex-shrink-0 items-center ml-1">
                                    <Bars3Icon onClick={openBurgerMenu} className="h-7 w-7 text-black"></Bars3Icon>
                                </div>
                            </div>
                        )
                        : (
                            <div className="flex md:inset-y-0 md:left-0 lg:static xl:col-span-2">
                                <div className="flex flex-shrink-0 items-center">
                                    <Link href="/">
                                        <ResponsiveLogo className="block h-6 w-auto" />
                                    </Link>
                                </div>
                            </div>
                        )
                    }

                    {!isTabletOrMobile &&                
                        <div className="flex min-w-0 w-full flex-1 flex-row justify-center items-center px-6 py-2 md:px-8 lg:px-0 xl:col-span-8">
                            <SearchBar />
                            <span className="w-0.5 h-5 mx-5 bg-gray-200"></span>
                            <TopicSelector />
                        </div>
                    }

                    <div className="flex items-center justify-end xl:col-span-2 py-2">
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