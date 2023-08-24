import * as Sentry from '@sentry/react'
import { useState, useEffect } from "react";
import Link from "next/link";
import { search } from "../../pages/api/search";
import { toast } from "react-toastify";
import { ChatBubbleLeftEllipsisIcon, InformationCircleIcon, RocketLaunchIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import calendar from "dayjs/plugin/calendar";
import Pagination from "common/components/Pagination";
import { useNav } from "features/Nav/NavigationContext";
import { useDataCache } from 'common/contexts/DataCacheContext';
import { Category } from 'common/models/Category';
import { Location } from 'common/models/Location';
import Loader from 'common/components/layout/Loader';
import BasicToast from 'common/components/layout/BasicToast';

dayjs.extend(localizedFormat);
dayjs.extend(calendar);

const PAGE_SIZE = 10;

function SearchResults() {
    const { searchParams, router } = useNav();
    const { categories, locations } = useDataCache();
    const [categoryFilter, setCategoryFilter] = useState<Category>(null);
    const [locationFilter, setLocationFilter] = useState<Location>(null);

    useEffect(() => {
        if (!router) return;

        if (router.query.qCategoryId) {
            const category = categories.find(c => c.id === router.query.qCategoryId);
            category && setCategoryFilter(category);
        }

        if (router.query.qLocationId) {
            const location = locations.find(l => l.id === router.query.qLocationId);
            location && setLocationFilter(location);
        }
    }, [router, categories, locations]);

    const [totalMatches, setTotalMatches] = useState(0);
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (!searchParams) return;

        setResults(null);

        search({
            query: searchParams.q,
            categoryIdFilter: searchParams.qCategoryId,
            locationIdFilter: searchParams.qLocationId,
        }, {
            limit: PAGE_SIZE,
            offset: (searchParams.page - 1) * PAGE_SIZE,
        })
            .then(result => {
                setTotalMatches(result.estimatedTotalHits);
                setResults(result.hits);
            })
            .catch(err => {
                Sentry.captureException(err);
                console.error(err);
                toast.error('Something went wrong');
            });
    }, [ searchParams, setTotalMatches, setResults ]);

    return (
        <>
            <div className="flex min-h-full flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="min-w-[75%]">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-xl font-semibold leading-6 text-black">
                            Search for &quot;
                            <span className='text-gray-500 font-normal'>{searchParams.q}</span>
                            &quot;
                        </h2>
                    </div>
                    <div className="flex items-center">
                        {(!!categoryFilter || !!locationFilter) &&
                            <h3>
                                {!!categoryFilter &&
                                    <>
                                        <span> in</span>
                                        <span className='text-gray-500 font-normal'> {categoryFilter.category}</span>
                                    </>
                                }
                                {!!locationFilter &&
                                    <>
                                        <span> {categoryFilter ? 'x' : 'in'}</span>
                                        <span className='text-gray-500 font-normal'> {locationFilter.location}</span>
                                    </>
                                }
                            </h3>
                        }
                    </div>

                    <dl className="mt-6 flex flex-col w-full gap-5">
                        {results?.map(result => {
                            switch(result.type) {
                                case 'post':
                                    return (
                                        <Link
                                            href={!!result.actionId
                                                ? `/${result.category}/${result.location}/actions/${result.actionId}/community/${result.id}`
                                                : `/${result.category}/${result.location}/community/${result.id}`
                                            }
                                            className="bg-white hover:bg-gray-50 px-4 py-5 sm:px-6 rounded-lg shadow mb"
                                            key={"post-" + result.id}
                                        >
                                            <p className="text-sm text-gray-500 mb-1 flex">
                                                <ChatBubbleLeftEllipsisIcon className="fill-gos-green-light mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                Post - {result.authorUsername} {!!result.createdAt && '- ' + dayjs(result.createdAt).calendar(null, {
                                                    sameElse: 'lll',
                                                })}
                                            </p>

                                            <h4 className="text-2xl mt-4">
                                                {result.title}
                                            </h4>
                                        </Link>
                                    );
                                case 'action':
                                    return (
                                        <Link
                                            href={`/${result.category}/${result.location}/actions/${result.id}`}
                                            className="bg-white hover:bg-gray-50 px-4 py-5 sm:px-6 rounded-lg shadow mb"
                                            key={"action-" + result.id}
                                        >
                                            <p className="text-sm text-gray-500 mb-1 flex">
                                                <RocketLaunchIcon className="fill-gos-green-light mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                Action - {result.authorUsername} {!!result.createdAt && '- ' + dayjs(result.createdAt).calendar(null, {
                                                    sameElse: 'lll',
                                                })}
                                            </p>

                                            <h4 className="text-2xl mt-4">
                                                {result.title}
                                            </h4>
                                        </Link>
                                    );
                                case 'topic':
                                    return (
                                        <Link
                                            href={`/${result.category}/${result.location}`}
                                            className="bg-white hover:bg-gray-50 px-4 py-5 sm:px-6 rounded-lg shadow mb"
                                            key={"topic-" + result.id}
                                        >
                                            <p className="text-sm text-gray-500 mb-1 flex">
                                                <InformationCircleIcon className="fill-gos-green-light mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
                                                Topic
                                            </p>
                                            <h4 className="text-2xl mt-4">
                                                {result.category} in {result.location}
                                            </h4>
                                        </Link>
                                    );
                                default:
                                    console.error('Unknown result type: ', result.type);
                                    return null;
                            }
                        })}
                    </dl>
                    {
                        results !== null
                            ? <Pagination
                                totalCount={totalMatches}
                                pageSize={PAGE_SIZE}
                            /> : <Loader />
                    }
                </div>
            </div>
            <BasicToast />
        </>
    );
}

export default SearchResults;
