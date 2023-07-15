import { LINKS } from 'constants/links';
import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';
import Logo from '../../common/layout/Logo';
import SearchBar from './SearchBar';
import { useAuth } from 'contexts/AuthContext';
import { HomeIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

interface BurgerMenuProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

function BurgerMenu({ isOpen = false, onOpen, onClose }: BurgerMenuProps) {
    const { isAuthenticated, user } = useAuth();

    return (
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <div className='!flex flex-col h-full'>
                <div className='mb-8'>
                    <Link href="/">
                        <Logo className="block h-8 w-auto" />
                    </Link>
                </div>
                <div>
                    <div className='py-3'>
                        <Link href="/" className='flex'>
                            <HomeIcon className="h-7 w-7"></HomeIcon>
                            <span className='ml-2'>Home</span>
                        </Link>
                    </div>

                    <div className='h-0.5 my-1 rounded-full bg-gray-200'/>

                    <div className='py-3'>
                        <Link href={LINKS.feedbackForm} target="_blank" className='flex'>
                            <MegaphoneIcon className="h-7 w-7"></MegaphoneIcon>
                            <span className='ml-2'>Give feedback</span>
                        </Link>
                    </div>

                    {isAuthenticated() &&
                        <div className='py-3'>
                            <Link href="/settings" className='flex'>
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
                                <span className='ml-2'>Account settings</span>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </Menu>
    );
}

export default BurgerMenu;
