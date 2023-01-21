import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { ResourceType } from "models/ResourceType";
import { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "utils/firebase";

function PostHeader() {
	const router = useRouter();

	const categoryQuery = router?.query?.category?.toString() ?? '...';
	const locationQuery = router?.query?.location?.toString() ?? '...';
	const actionId = router?.query?.actionId?.toString() ?? '';
	const resourceType = !actionId ? ResourceType.Topic : ResourceType.Action;

	const [actionDoc] = resourceType === ResourceType.Action ? useDocument(doc(db, "actions", actionId), {
		snapshotListenOptions: { includeMetadataChanges: true },
	}) : [null];
	const actionTitle = actionDoc?.data()?.title;

	const readableCategory = categoryQuery.split("-").join(" ");
	const readableLocation = locationQuery.split("-").join(" ");

	return (
		<div className="flex flex-col justify-center items-center px-4">
			<div className="w-full max-w-4xl">
				<div className="mt-6 w-full flex justify-start items-center text-gray-500 text-sm">
					<Link href={resourceType === ResourceType.Topic
						? `/${categoryQuery}/${locationQuery}`
						: `/${categoryQuery}/${locationQuery}/actions/${actionId}`
					}>
						<ArrowLeftIcon
							className="h-4 w-4 inline-block items-center mr-1"
							aria-hidden="true"
						/>
						{resourceType === ResourceType.Topic
							? `Back to ${readableCategory} in ${readableLocation}`
							: (actionTitle ? `Back to ${actionTitle}` : 'Back')}
					</Link>
				</div>
			</div>
		</div>
	);
}

export default PostHeader;
