import BasicHead from "components/common/layout/BasicHead";
import ActionsOverview from "components/pages/ActionsOverview";
import { useNav } from "contexts/NavigationContext";
import { ResourceContextProvider } from "contexts/ResourceContext";
import { ResourceType } from "models/ResourceType";
import { Tab } from "models/Tab";
import { useEffect } from "react";

function TopicActionsOverviewPage() {
    const { handleCurrentTabChange } = useNav();

    useEffect(() => {
        handleCurrentTabChange(Tab.Actions);
    }, [ handleCurrentTabChange ]);

    return (
        <ResourceContextProvider resourceType={ResourceType.Action}>
            <BasicHead title="goSolve | Actions" />
            <ActionsOverview />
        </ResourceContextProvider>
    );
}

export default TopicActionsOverviewPage;
