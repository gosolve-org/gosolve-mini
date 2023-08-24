import CommunityOverview from "features/Resource/CommunityOverview";
import { useNav } from "features/Nav/NavigationContext";
import { ResourceContextProvider } from "features/Resource/ResourceContext";
import { ResourceType } from "features/Resource/types/ResourceType";
import { Tab } from "features/Resource/types/Tab";
import { useEffect } from "react";
import BasicHead from "common/components/layout/BasicHead";
import Layout from "common/components/layout/Layout";

function ActionCommunityOverviewPage() {
    const { handleCurrentTabChange } = useNav();

    useEffect(() => {
        handleCurrentTabChange('Community');
    }, [ handleCurrentTabChange ]);

    return (
        <>
            <BasicHead title="goSolve | Community" />
            <ResourceContextProvider resourceType={'Action'}>
                <Layout>
                    <CommunityOverview resourceType={'Action'} />
                </Layout>
            </ResourceContextProvider>
        </>
    );
}

export default ActionCommunityOverviewPage;
