import ActionsOverview from "features/Resource/Action/ActionsOverview";
import { useNav } from "features/Nav/NavigationContext";
import { ResourceContextProvider } from "features/Resource/ResourceContext";
import { ResourceType } from "features/Resource/types/ResourceType";
import { Tab } from "features/Resource/types/Tab";
import { useEffect } from "react";
import BasicHead from "common/components/layout/BasicHead";
import Layout from "common/components/layout/Layout";

function TopicActionsOverviewPage() {
    const { handleCurrentTabChange } = useNav();

    useEffect(() => {
        handleCurrentTabChange('Actions');
    }, [ handleCurrentTabChange ]);

    return (
        <>
            <BasicHead title="goSolve | Actions" />
            <ResourceContextProvider resourceType={'Action'}>
                <Layout>
                    <ActionsOverview />
                </Layout>
            </ResourceContextProvider>
        </>
    );
}

export default TopicActionsOverviewPage;
