import SideBar from "components/sideBar/SideBar";
import SideBarPostsOverview from "components/sideBar/posts/SideBarPostsOverview";
import ResourceContent from "./ResourceContent";
import SideBarActionsOverview from "components/sideBar/actions/SideBarActionsOverview";
import SideBarTableOfContents from "components/sideBar/SideBarTableOfContents";
import { useResource } from "contexts/ResourceContext";
import { ResourceType } from "models/ResourceType";
import { useNav } from "contexts/NavigationContext";
import { useMediaQueries } from "contexts/MediaQueryContext";

function Resource()
{
    const { resourceType } = useResource();
    const { currentCategory } = useNav();
    const { isDesktopOrLaptop, isBigScreen, isTabletOrMobile } = useMediaQueries();

    const sideBarWidth = isDesktopOrLaptop && !isBigScreen ? 250 : 350;

    const renderForMobile = () => (
        <>
            <div>
                {resourceType === ResourceType.Action &&
                    <>
                        <SideBarPostsOverview />
                    </>
                }
                {resourceType === ResourceType.Topic &&
                    <>
                        {!currentCategory?.hidden && <SideBarActionsOverview />}
                        <SideBarPostsOverview />
                    </>
                }
            </div>

            {/* CONTENT */}
            <div className="grow">
                <ResourceContent />
            </div>
        </>
    );

    const renderForDesktop = () => (
        <div className="flex">
            {/* LEFT BAR */}
            <div
                className="shrink-0"
                style={{
                    width: `${sideBarWidth}px`,
                }}
            >
                <SideBar>
                    <div className="pt-20 sticky top-0">
                        <SideBarTableOfContents />
                    </div>
                </SideBar>
            </div>

            {/* CONTENT */}
            <div className="grow">
                <ResourceContent />
            </div>

            {/* RIGHT BAR */}
            <div
                className="shrink-0"
                style={{
                    width: `${sideBarWidth}px`,
                }}
            >
                <SideBar>
                    {resourceType === ResourceType.Action &&
                        <>
                            <SideBarPostsOverview />
                        </>
                    }
                    {resourceType === ResourceType.Topic &&
                        <>
                            {!currentCategory?.hidden && <SideBarActionsOverview />}
                            <SideBarPostsOverview />
                        </>
                    }
                </SideBar>
            </div>
        </div>
    );

    return (
        <>
            {isTabletOrMobile ? renderForMobile() : renderForDesktop()}
        </>
    );
}

export default Resource;
