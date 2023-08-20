import { useMediaQueries } from "contexts/MediaQueryContext";
import { useNav } from "contexts/NavigationContext";
import Link from "next/link";
import { toUrlPart } from "utils/textUtils";

const cardTitleStyle = {
    minHeight: '2.5rem'
};

function SideBarActionCard({ id, title, authorUsername }: { id: string, title: string, authorUsername: string })
{
    const { currentCategory, currentLocation } = useNav();
    const { isTabletOrMobile } = useMediaQueries();

    return (
        <Link
            key={id}
            href={`/${toUrlPart(currentCategory?.category)}/${toUrlPart(currentLocation?.location)}/actions/${id}`}
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

export default SideBarActionCard;
