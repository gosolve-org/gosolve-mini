import { useMediaQueries } from "contexts/MediaQueryContext";
import { useNav } from "contexts/NavigationContext";
import { useResource } from "contexts/ResourceContext";
import { ResourceType } from "models/ResourceType";
import Link from "next/link";
import { toUrlPart } from "utils/textUtils";

const cardTitleStyle = {
    minHeight: '2.5rem'
};

function SideBarPostCard({ id, title, authorUsername, resourceType }: { id: string, title: string, authorUsername: string, resourceType: ResourceType })
{
    const { actionId } = useResource();
    const { currentCategory, currentLocation } = useNav();
    const { isTabletOrMobile } = useMediaQueries();

    let url;
    switch (resourceType)
    {
        case ResourceType.Topic:
            url = `/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/community/${id}`;
            break;
        case ResourceType.Action:
            url = `/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/actions/${actionId}/community/${id}`;
            break;
        default:
            break;
    }

    return (
        <Link
            key={id}
            href={url}
        >
            <li className={`rounded-lg bg-white px-4 py-5 shadow-md hover:bg-gray-50 list-none width-card-lg xl:w-auto ${!isTabletOrMobile && 'mb-4'}`}>
                <div className="text-sm font-medium text-black line-clamp-2" style={cardTitleStyle}>
                    {title}
                </div>

                <div className="mt-4 truncate text-sm font-light text-gray-400">
                    {authorUsername}
                </div>
            </li>
        </Link>
    );
}

export default SideBarPostCard;
