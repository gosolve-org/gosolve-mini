import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { ResourceType } from "models/ResourceType";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "utils/firebase";
import { toUrlPart } from "utils/textUtils";
import { useNav } from "contexts/NavigationContext";

function PostHeader() {
    const router = useRouter();
    const { currentCategory, currentLocation } = useNav();

    const actionId = router?.query?.actionId?.toString();
    const resourceType = !actionId ? ResourceType.Topic : ResourceType.Action;

    const [actionDoc] = useDocumentOnce(resourceType === ResourceType.Action ?  doc(db, "actions", actionId) : null);
    const actionTitle = actionDoc?.data()?.title;


    return (
        <div className="flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-4xl">
                <div className="mt-6 w-full flex justify-start items-center text-gray-500 text-sm">
                    <Link href={resourceType === ResourceType.Topic
                        ? `/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}`
                        : `/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/actions/${actionId}`
                    }>
                        <ArrowLeftIcon
                            className="h-4 w-4 inline-block items-center mr-1"
                            aria-hidden="true"
                        />
                        {resourceType === ResourceType.Topic
                            ? `Back to ${currentCategory?.category} in ${currentLocation?.location}`
                            : (actionTitle ? `Back to ${actionTitle}` : 'Back')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PostHeader;
