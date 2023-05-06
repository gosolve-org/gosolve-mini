import { LINKS } from 'constants/links';
import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';
import Logo from '../../common/layout/Logo';
import SearchBar from './SearchBar';
import TopicSelector from './TopicSelector';

interface BurgerMenuProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

function BurgerMenu({ isOpen = false, onOpen, onClose }: BurgerMenuProps) {
    return (
        <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <div className='!flex flex-col h-full'>
                <div className='mb-8'>
                    <Link href="/">
                        <Logo className="block h-8 w-auto" />
                    </Link>
                </div>
                <div className='flex-col flex-grow min-w-0 w-full flex-1 justify-center items-center'>
                    <SearchBar />
                    <span className="flex h-0.5 w-full my-5 bm-menu-divider"></span>
                    <TopicSelector />
                </div>
                <div className='mb-4'>
                    <div className='py-2'>
                        <Link href={LINKS.feedbackForm} target="_blank">Give feedback</Link>
                    </div>
                    <div className='py-2'>
                        <Link href="/settings">Account settings</Link>
                    </div>
                </div>
            </div>
        </Menu>
    );
}

export default BurgerMenu;
