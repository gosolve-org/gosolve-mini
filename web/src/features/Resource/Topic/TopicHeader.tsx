import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Tab } from "features/Resource/types/Tab";
import { toUrlPart } from "utils/textUtils";
import { useMediaQueries } from "common/contexts/MediaQueryContext";
import { useNav } from "features/Nav/NavigationContext";
import Image from "next/image";
import { isHomePage } from "utils/topicUtils";
import { CATEGORY_IMAGE_DIR_URI } from "common/constants/uris";

const DEFAULT_PAGE_TITLE = 'Welcome to goSolve';
const TAB_WIDTH = 200;
const HEADER_SHADOW_OPACITY_BEFORE_IMAGE_LOAD = 0.4;
const HEADER_SHADOW_OPACITY_AFTER_IMAGE_LOAD = 1;

const tabs = [
    { name: "Topic", href: "", value: 'Topic', showOnHiddenTopics: true },
    { name: "Actions", href: "actions", value: 'Actions', showOnHiddenTopics: false },
    { name: "Community", href: "community", value: 'Community', showOnHiddenTopics: false },
];

const tabsContainerStyle = (amountOfTabs: number) => ({
    width: `${amountOfTabs * TAB_WIDTH}px`
});

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

function TopicHeader() {
    const { currentTab, currentCategory, currentLocation, handleCurrentTabChange } = useNav();
    const { isMobile } = useMediaQueries();
    const backgroundImageRef = useRef<HTMLImageElement>(null);
    const [headerShadowOpacity, setHeaderShadowOpacity] =
        useState(currentCategory?.imageTextShadowOpacity ?? HEADER_SHADOW_OPACITY_BEFORE_IMAGE_LOAD);

    const handleTabChange = (e: FormEvent<HTMLSelectElement>) =>
        handleCurrentTabChange(e.currentTarget.value as Tab);

    const defineHeaderShadowOpacity = useCallback(() => {
        const defaultOpacity = backgroundImageRef.current?.complete
            ? HEADER_SHADOW_OPACITY_AFTER_IMAGE_LOAD
            : HEADER_SHADOW_OPACITY_BEFORE_IMAGE_LOAD;
        setHeaderShadowOpacity(currentCategory?.imageTextShadowOpacity ?? defaultOpacity);
    }, [backgroundImageRef, currentCategory, setHeaderShadowOpacity]);

    useEffect(() => {
        defineHeaderShadowOpacity();
    }, [currentCategory, defineHeaderShadowOpacity]);

    let tabsToDisplay = tabs.filter(el => !currentCategory?.hidden || el.showOnHiddenTopics);
    if (tabsToDisplay.length === 1 && tabsToDisplay[0].value === 'Topic') {
        tabsToDisplay = [];
    }

    return (
        <div className="relative w-full">
            <div
                className="w-full h-40 sm:h-60 2xl:h-80 absolute left-0 select-none"
                style={{ zIndex: -1 }}
            >
                {!!currentCategory?.imageName &&
                    <Image
                        src={`${CATEGORY_IMAGE_DIR_URI}/${currentCategory?.imageName}.webp`}
                        sizes="100vw"
                        ref={backgroundImageRef}
                        onLoad={defineHeaderShadowOpacity}
                        alt={currentCategory?.category}
                        fill={true}
                        priority={true}
                        quality={100}
                        style={{
                            objectFit: 'cover',
                            objectPosition: currentCategory?.imagePosition ?? 'center',
                        }}
                    />
                }
            </div>
            <div className="flex flex-col justify-end sm:pb-4 h-40 sm:h-60 2xl:h-80 items-center">
                <div className="mt-5 sm:mx-auto sm:w-full">
                    <h1
                        className="w-full px-4 py-2 text-center text-3xl tracking-tight text-white"
                        style={{
                            textShadow:
                                `5px 0px 17px rgba(0, 0, 0, ${headerShadowOpacity}),` +
                                `-5px 0px 17px rgba(0, 0, 0, ${headerShadowOpacity}),` +
                                `0px 5px 17px rgba(0, 0, 0, ${headerShadowOpacity}),` +
                                `0px -5px 17px rgba(0, 0, 0, ${headerShadowOpacity})`,
                        }}
                    >
                        {isHomePage(currentCategory, currentLocation)
                            ? DEFAULT_PAGE_TITLE
                            : (currentCategory?.id && currentLocation?.id
                                ? `${currentCategory?.category} in ${currentLocation?.location}`
                                : ''
                            )
                        }
                    </h1>
                </div>
                <div
                    className="mt-5 w-full sm:w-auto"
                    style={!isMobile ? tabsContainerStyle(tabsToDisplay.length) : {}}
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
                            {!!currentCategory?.id && !!currentLocation?.id && tabsToDisplay.map((tab, tabIdx, tabArr) => (
                                <Link
                                    key={tab.value}
                                    href={`/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/${tab.href}`}
                                    style={tab.value === currentTab ? {
                                        backgroundColor: '#E5E5FF',
                                    } : {}}
                                    className={classNames(
                                        tab.value === currentTab
                                            ? "text-gray-700"
                                            : "text-gray-500 hover:text-gray-700",
                                        tabIdx === 0 && !isMobile ? "rounded-l-lg" : "",
                                        tabIdx === tabArr.length - 1 && !isMobile ? "rounded-r-lg" : "",
                                        "group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
                                    )}
                                    aria-current={
                                        tab.value === currentTab ? "page" : undefined
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
                                                ? "bg-indigo-500"
                                                : "bg-transparent",
                                            "absolute inset-x-0 bottom-0"
                                        )}
                                    />
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopicHeader;
