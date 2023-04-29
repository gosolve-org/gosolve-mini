import SideBar from "components/sideBar/SideBar";
import SideBarPostsOverview from "components/sideBar/posts/SideBarPostsOverview";
import ResourceContent from "./ResourceContent";
import SideBarActionsOverview from "components/sideBar/actions/SideBarActionsOverview";
import SideBarTableOfContents from "components/sideBar/SideBarTableOfContents";

function Resource()
{
    return (
        <div className="flex">
            {/* LEFT BAR */}
            <div
                className="shrink-0"
                style={{
                    width: '350px',
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
                    width: '350px',
                }}
            >
                <SideBar>
                    <SideBarActionsOverview />
                    <SideBarPostsOverview />
                </SideBar>
            </div>
        </div>
    );
}

export default Resource;
