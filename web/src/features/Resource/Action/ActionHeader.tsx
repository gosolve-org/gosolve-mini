import { type FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';

import { db } from 'utils/firebase';
import { type Tab } from 'features/Resource/types/Tab';
import { toUrlPart } from 'utils/textUtils';
import { useMediaQueries } from 'common/contexts/MediaQueryContext';
import { useNav } from 'features/Nav/NavigationContext';

const TAB_WIDTH = 200;

const tabs = [
    { name: 'Action', href: '', value: 'Action' },
    { name: 'Community', href: 'community', value: 'Community' },
];

const tabsContainerStyle = (amountOfTabs: number) => ({
    width: `${amountOfTabs * TAB_WIDTH}px`,
});

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const ActionHeader = () => {
    const router = useRouter();
    const { currentTab, currentCategory, currentLocation, handleCurrentTabChange } = useNav();
    const { isMobile } = useMediaQueries();

    const actionId = router?.query?.actionId?.toString();

    if (actionId == null) return null;

    const [actionsCollection] = useDocumentOnce(doc(db, 'actions', actionId));

    const handleTabChange = (e: FormEvent<HTMLSelectElement>) =>
        handleCurrentTabChange(e.currentTarget.value as Tab);

    return (
        <div className="flex relative items-center justify-center w-full xl:px-6 bg-gos-green-100">
            <div className="relative w-full sm:max-w-screen-2xl">
                <div className="sm:pb-4 items-center">
                    <div className="mt-6 w-full flex justify-start items-center text-sm sm:pl-10 pl-4">
                        <span>
                            <Link href="/" className="text-gray-700 hover:text-black">
                                Home /
                            </Link>
                            <Link
                                href={`/${toUrlPart(
                                    currentCategory?.category,
                                )}/${currentLocation?.location}`}
                                className="text-gray-700 hover:text-black"
                            >
                                {` ${currentCategory?.category} in ${currentLocation?.location} /`}
                            </Link>
                            <span className="text-gray-400">
                                {' '}
                                {actionsCollection?.data()?.title}
                            </span>
                        </span>
                    </div>
                    <div className="mt-16 sm:w-full sm:pl-10 pl-4">
                        <div className="mb-4">
                            <span className="bg-gos-green px-3 py-2 rounded-full text-white">
                                Action
                            </span>
                        </div>
                        <h1 className="md:text-3xl tracking-tight text-black">
                            {actionsCollection?.data()?.title || '\u00A0'}
                        </h1>
                    </div>
                    <div
                        className="mt-5 w-full sm:w-auto sm:pl-10"
                        style={
                            !isMobile
                                ? tabsContainerStyle(
                                      !currentCategory?.hidden && !currentLocation?.hidden
                                          ? tabs.length
                                          : 0,
                                  )
                                : {}
                        }
                    >
                        <div className="hidden">
                            <label htmlFor="tabs" className="sr-only">
                                Select a tab
                            </label>

                            <select
                                id="tabs"
                                name="tabs"
                                onChange={handleTabChange}
                                value={currentTab ?? 'Topic'}
                                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {tabs.map((tab) => (
                                    <option key={tab.value}>{tab.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="block">
                            <nav
                                className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
                                aria-label="Tabs"
                            >
                                {!!currentCategory?.id &&
                                    !!currentLocation?.id &&
                                    tabs.map((tab, tabIdx, tabArr) => (
                                        <Link
                                            key={tab.value}
                                            href={`/${toUrlPart(
                                                currentCategory?.category,
                                            )}/${toUrlPart(
                                                currentLocation?.location,
                                            )}/actions/${actionId}/${tab.href}`}
                                            style={
                                                tab.value === currentTab
                                                    ? {
                                                          backgroundColor: '#E5E5FF',
                                                      }
                                                    : {}
                                            }
                                            className={classNames(
                                                tab.value === currentTab
                                                    ? 'text-gray-700'
                                                    : 'text-gray-500 hover:text-gray-700',
                                                tabIdx === 0 && !isMobile ? 'rounded-l-lg' : '',
                                                tabIdx === tabArr.length - 1 && !isMobile
                                                    ? 'rounded-r-lg'
                                                    : '',
                                                'group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10',
                                            )}
                                            aria-current={
                                                tab.value === currentTab ? 'page' : undefined
                                            }
                                        >
                                            <span>{tab.name}</span>
                                            <span
                                                aria-hidden="true"
                                                style={{
                                                    height: '3px',
                                                }}
                                                className={classNames(
                                                    tab.value === currentTab
                                                        ? 'bg-indigo-500'
                                                        : 'bg-transparent',
                                                    'absolute inset-x-0 bottom-0',
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
};

export default ActionHeader;
