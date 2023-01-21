import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCollection, useCollectionOnce } from "react-firebase-hooks/firestore";
import { collection, query, DocumentData } from "firebase/firestore";

import { db } from "utils/firebase";
import { Layout, Pagination } from "components/common";
import { DEFAULT_PAGE_SIZE } from "constants/defaultSearches";
import { ResourceType } from "models/ResourceType";

function Search() {
	const router = useRouter();

	const searchQuery = router?.query?.q ? router?.query?.q.toString() : "";

	const readableSearch = searchQuery.split("+").join(" ");

	const [totalMatches, setTotalMatches] = useState(0);

	const [topicsCollection, topicsLoading] = useCollectionOnce(query(collection(db, "topics")));
	const [actionsCollection, actionsLoading] = useCollectionOnce(query(collection(db, "actions")));
	const [postsCollection, postsLoading] = useCollectionOnce(query(collection(db, "posts")));
	const [categoriesCollection, categoriesLoading] = useCollectionOnce(collection(db, "categories"));
	const [locationsCollection, locationsLoading] = useCollectionOnce(collection(db, "locations"));

	// Firebase has no good way of matching substrings
	// https://stackoverflow.com/questions/46568142/google-firestore-query-on-substring-of-a-property-value-text-search
	// Possible solutions would quickly become unscalable on Firebase but tags could solve this/help categorize items better
	// Other possible solutions are using an external service like Algolia and Elastic Search
	const renderResults = useMemo(() => {
		const matchResults = (
			collection: { docs: DocumentData[] } | undefined
		) => {
			const searchTerms = searchQuery.split("+");

			return collection?.docs
				? collection?.docs.reduce((result, item) => {
						const itemData = item.data();
						if (
							itemData?.content &&
							searchTerms.every((word) =>
								itemData.content.includes(word)
							)
						) {
							result.push(item);
						}

						if (
							itemData?.title &&
							searchTerms.every((word) =>
								itemData.title.includes(word)
							)
						) {
							result.push(item);
						}
						return result;
				  }, [])
				: [];
		};

		const getTopicData = (item: DocumentData) => {
			const topic = topicsCollection?.docs.find(
				(topic) => topic.id === item.data().topicId
			);
			return topic?.data();
		};

		const getCategoryQuery = (item: DocumentData) => {
			const topicData = getTopicData(item);

			return categoriesCollection?.docs
				.find((category) => category.id === topicData?.categoryId)
				?.data()
				.category.split(" ")
				.join("-");
		};

		const getLocationQuery = (item: DocumentData) => {
			const topicData = getTopicData(item);

			return locationsCollection?.docs
				.find((location) => location.id === topicData?.locationId)
				?.data()
				.location.split(" ")
				.join("-");
		};

		const filteredTopics = matchResults(topicsCollection);
		const filteredActions = matchResults(actionsCollection);
		const filteredPosts = matchResults(postsCollection);

		setTotalMatches(
			filteredTopics.length +
				filteredActions.length +
				filteredPosts.length
		);

		return (
			<>
				{filteredTopics.map((item: DocumentData) => {
					if (item) {
						const itemData = item.data();
						const categoryQuery = getCategoryQuery(item);
						const locationQuery = getLocationQuery(item);

						return (
							<Link
								href={`/${categoryQuery}/${locationQuery}`}
								className="bg-white hover:bg-gray-50 px-4 py-5 sm:px-6 rounded-lg shadow mb"
								key={item.id}
							>
								{itemData?.title ? (
									<h4 className="text-2xl mb-4">
										{itemData.title}
									</h4>
								) : null}

								<p className="text-sm text-gray-500 mb-1">
									Topic
								</p>
							</Link>
						);
					}
				})}
				{filteredActions.map((item: DocumentData) => {
					if (item) {
						const itemData = item.data();
						const categoryQuery = getCategoryQuery(item);
						const locationQuery = getLocationQuery(item);

						return (
							<Link
								href={`/${categoryQuery}/${locationQuery}/actions/${item.id}`}
								className="bg-white hover:bg-gray-50 px-4 py-5 sm:px-6 rounded-lg shadow mb"
								key={item.id}
							>
								{itemData?.title ? (
									<h4 className="text-2xl mb-4">
										{itemData.title}
									</h4>
								) : null}

								<p className="text-sm text-gray-500 mb-1">
									{`Action${
										itemData?.authorUsername
											? ` - ${itemData.authorUsername}`
											: ""
									}`}
								</p>
							</Link>
						);
					}
				})}
				{filteredPosts.map((item: DocumentData) => {
					if (item) {
						const itemData = item.data();
						const categoryQuery = getCategoryQuery(item);
						const locationQuery = getLocationQuery(item);
						const actionId = itemData.actionId;
						const topicId = itemData.topicId;
						const resourceType = !!actionId
							? ResourceType.Action
							: (!!topicId
								? ResourceType.Topic
								: null);
						if (resourceType === null) {
							console.error(`Post with id ${item.id} is not linked to either an action or topic.`);
							return null;
						}

						return (
							<Link
								href={resourceType === ResourceType.Topic
									? `/${categoryQuery}/${locationQuery}/community/${item.id}`
									: `/${categoryQuery}/${locationQuery}/actions/${actionId}/community/${item.id}`
								}
								className="bg-white hover:bg-gray-50 px-4 py-5 sm:px-6 rounded-lg shadow mb"
								key={item.id}
							>
								{itemData?.title ? (
									<h4 className="text-2xl mb-4">
										{itemData.title}
									</h4>
								) : null}

								<p className="text-sm text-gray-500 mb-1">
									{`Post${
										itemData?.authorUsername
											? ` - ${itemData.authorUsername}`
											: ""
									}`}
								</p>
							</Link>
						);
					}
				})}
			</>
		);
	}, [
		topicsCollection,
		actionsCollection,
		postsCollection,
		searchQuery,
		categoriesCollection,
		locationsCollection,
	]);

	return (
		<Layout>
			<div className="flex min-h-full flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="min-w-[75%]">
					<div className="flex items-center">
						<h2 className="text-2xl font-xl font-semibold leading-6 text-black">
							{`Search for "${readableSearch}"`}
						</h2>
					</div>

					<dl className="mt-6 flex flex-col w-full gap-5">
						{!topicsLoading &&
						!actionsLoading &&
						!postsLoading &&
						!categoriesLoading &&
						!locationsLoading
							? renderResults
							: null}
					</dl>

					<Pagination
						totalCount={totalMatches}
						pageSize={DEFAULT_PAGE_SIZE}
					/>
				</div>
			</div>
		</Layout>
	);
}

export default Search;
