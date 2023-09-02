import { useResource } from 'features/Resource/ResourceContext';
import { useNav } from 'features/Nav/NavigationContext';
import { useMediaQueries } from 'common/contexts/MediaQueryContext';
import SidebarPostsOverview from 'features/Sidebar/PostsOverview/SidebarPostsOverview';
import SidebarActionsOverview from 'features/Sidebar/ActionsOverview/SidebarActionsOverview';
import Sidebar from 'features/Sidebar';
import SidebarTableOfContents from 'features/Sidebar/SidebarTableOfContents';
import ResourceContent from './ResourceContent';

const Resource = () => {
    const { resourceType } = useResource();
    const { currentCategory } = useNav();
    const { isDesktopOrLaptop, isBigScreen, isTabletOrMobile } = useMediaQueries();

    const sidebarWidth = isDesktopOrLaptop && !isBigScreen ? 250 : 350;

    const renderForMobile = () => (
        <>
            <div>
                {resourceType === 'Action' && <SidebarPostsOverview />}
                {resourceType === 'Topic' && (
                    <>
                        {!currentCategory?.hidden && <SidebarActionsOverview />}
                        {!currentCategory?.hidden && <SidebarPostsOverview />}
                    </>
                )}
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
            {resourceType === 'Topic' && (
                <div
                    className="shrink-0"
                    style={{
                        width: `${sidebarWidth}px`,
                    }}
                >
                    <Sidebar>
                        <div className="pt-20 sticky top-0">
                            <SidebarTableOfContents />
                        </div>
                    </Sidebar>
                </div>
            )}

            {/* CONTENT */}
            <div className="grow">
                <ResourceContent />
            </div>

            {/* RIGHT BAR */}
            <div
                className="shrink-0"
                style={{
                    width: `${sidebarWidth}px`,
                }}
            >
                <Sidebar>
                    {resourceType === 'Action' && <SidebarPostsOverview />}
                    {resourceType === 'Topic' && (
                        <>
                            {!currentCategory?.hidden && <SidebarActionsOverview />}
                            {!currentCategory?.hidden && <SidebarPostsOverview />}
                        </>
                    )}
                </Sidebar>
            </div>
        </div>
    );

    return isTabletOrMobile ? renderForMobile() : renderForDesktop();
};

export default Resource;
