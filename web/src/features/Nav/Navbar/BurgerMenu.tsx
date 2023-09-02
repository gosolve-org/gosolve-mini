import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';
import { useAuth } from 'features/Auth/AuthContext';
import { HomeIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import Logo from 'common/components/layout/Logo';
import LINKS from 'common/constants/links';
import ProfileIconSvg from 'common/components/svgs/ProfileIconSvg';

interface BurgerMenuProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const BurgerMenu = ({ isOpen = false, onOpen, onClose }: BurgerMenuProps) => {
    const { isAuthenticated, user } = useAuth();

    return (
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <div className="!flex flex-col h-full">
                <div className="mb-8">
                    <Link href="/">
                        <Logo className="block h-8 w-auto" />
                    </Link>
                </div>
                <div>
                    <div className="py-3">
                        <Link href="/" className="flex">
                            <HomeIcon className="h-7 w-7" />
                            <span className="ml-2">Home</span>
                        </Link>
                    </div>

                    <div className="h-0.5 my-1 rounded-full bg-gray-200" />

                    <div className="py-3">
                        <Link href={LINKS.feedbackForm} target="_blank" className="flex">
                            <MegaphoneIcon className="h-7 w-7" />
                            <span className="ml-2">Give feedback</span>
                        </Link>
                    </div>

                    {isAuthenticated() && (
                        <div className="py-3">
                            <Link href="/settings" className="flex">
                                {user?.photoURL ? (
                                    <img
                                        referrerPolicy="no-referrer"
                                        className="h-7 w-7 rounded-full"
                                        src={user?.photoURL}
                                        alt="User Avatar"
                                    />
                                ) : (
                                    <div className="flex justify-center">
                                        <span className="inline-block h-7 w-7 overflow-hidden rounded-full bg-gray-100">
                                            <ProfileIconSvg
                                                className="h-full w-full text-gray-300"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            />
                                        </span>
                                    </div>
                                )}
                                <span className="ml-2">Account settings</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Menu>
    );
};

export default BurgerMenu;
