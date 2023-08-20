import BasicHead from "components/common/layout/BasicHead";
import CommunityOverview from "components/pages/CommunityOverview";
import { useNav } from "contexts/NavigationContext";
import { ResourceContextProvider } from "contexts/ResourceContext";
import { ResourceType } from "models/ResourceType";
import { Tab } from "models/Tab";
import { useEffect } from "react";

function ActionCommunityPage() {
    const { handleCurrentTabChange } = useNav();

    useEffect(() => {
        handleCurrentTabChange(Tab.Community);
    }, [ handleCurrentTabChange ]);

    return (
        <ResourceContextProvider resourceType={ResourceType.Action}>
            <BasicHead title="goSolve | Community" />
            <CommunityOverview resourceType={ResourceType.Action} />
        </ResourceContextProvider>
    );
}

export default ActionCommunityPage;
