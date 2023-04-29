import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { Layout, Pagination, Loader } from "components/common/layout/Layout";
import BasicHead from "components/common/layout/BasicHead";
import { search } from "./api/search";
import { toast } from "react-toastify";
import BasicToast from "components/common/layout/BasicToast";
import { ChatBubbleLeftEllipsisIcon, InformationCircleIcon, RocketLaunchIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import calendar from "dayjs/plugin/calendar";
dayjs.extend(localizedFormat);
dayjs.extend(calendar);

const PAGE_SIZE = 10;

function Search() {
    const router = useRouter();

    const searchQuery = router?.query?.q ? router?.query?.q.toString() : "";
    const pageQuery = router.query?.page
        ? parseInt(router.query?.page.toString()) || 1
        : 1;

    const readableSearch = searchQuery.split("+").join(" ");

    const [totalMatches, setTotalMatches] = useState(0);
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (!searchQuery) return;

        setResults(null);

        search(searchQuery, (pageQuery - 1) * PAGE_SIZE, PAGE_SIZE)
            .then(result => {
                setTotalMatches(result.estimatedTotalHits);
                setResults(result.hits);
            })
            .catch(err => {
                console.error(err);
                toast.error('Something went wrong');
            });
    }, [ searchQuery, pageQuery ]);

    return (
        <Layout>
            <BasicHead title="goSolve | Search" />
            <div className="flex min-h-full flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="min-w-[75%]">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-xl font-semibold leading-6 text-black">
                            {`Search for "${readableSearch}"`}
                        </h2>
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
        </Layout>
    );
}

export default Search;
