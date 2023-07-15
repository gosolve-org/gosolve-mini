import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { BellIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { useAuth } from "contexts/AuthContext";
import ResponsiveLogo from "../../common/layout/ResponsiveLogo";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { LINKS } from "constants/links";
import NotificationsBell from "./NotificationsBell";
import { useMediaQueries } from "contexts/MediaQueryContext";
import BurgerMenu from "./BurgerMenu";
import SearchBar from "./SearchBar";
import { useNav } from "contexts/NavigationContext";
import { useRouter } from "next/router";
import { InstantSearchContextProvider } from "contexts/InstantSearchContext";

function Navbar() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { isTabletOrMobile } = useMediaQueries();
    const { isBurgerMenuOpen, closeBurgerMenu, openBurgerMenu } = useNav();

    const login = () => {
        router.push("/login");
    };

    return (
        <InstantSearchContextProvider>
            {isTabletOrMobile && <BurgerMenu isOpen={isBurgerMenuOpen} onOpen={openBurgerMenu} onClose={closeBurgerMenu}></BurgerMenu>}
            <div
                style={{
                    height: 54,
                }}
                className="mx-auto px-1 sm:px-2 lg:px-4 bg-white shadow-sm lg:static lg:overflow-y-visible"
            >
                <div className="h-full relative flex justify-between">
                    <div className="flex grow basis-0 md:inset-y-0 md:left-0 lg:static">
                        {isTabletOrMobile
                            ? (
                                <div className="flex flex-shrink-0 items-center ml-1">
                                    <Bars3Icon onClick={openBurgerMenu} className="h-7 w-7 text-black"></Bars3Icon>
                                </div>
                            )
                            : (
                                <div className="flex flex-shrink-0 items-center">
                                    <Link href="/">
                                        <ResponsiveLogo className="block h-6 w-auto" />
                                    </Link>
                                </div>
                            )
                        }
                    </div>
          
                    <div className="flex min-w-0 flex-row justify-center items-center px-6 py-2 md:px-8 lg:px-0">
                        <SearchBar />
                    </div>

                    <div className="flex grow basis-0 items-center justify-end py-2">
                        {/* NOTIFICATIONS BELL */}
                        {isAuthenticated() &&
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
                        }

                        {/* FEEDBACK ICON */}
                        {!isTabletOrMobile &&
                            <div className="mr-2">
                                <Tippy content="Give Feedback">
                                    <Link href={LINKS.feedbackForm} target="_blank">
                                        <MegaphoneIcon className="h-7 w-7 text-gray-light"></MegaphoneIcon>
                                    </Link>
                                </Tippy>
                            </div>
                        }

                        {/* ACCOUNT SETTINGS ICON */}
                        {isAuthenticated() &&
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
                        }

                        {/* LOGIN BUTTON */}
                        {!isAuthenticated() &&
                            <button
                                onClick={login}
                                className="select-none rounded-full border border-gray-300 bg-white py-1.5 px-4 text-gray-light shadow-sm hover:bg-indigo-500 hover:border-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <span>Login</span>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </InstantSearchContextProvider>
    );
}

export default Navbar;
