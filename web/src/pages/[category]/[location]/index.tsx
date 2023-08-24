import Topic from "features/Resource/Topic/Topic";
import { useNav } from "features/Nav/NavigationContext";
import { ResourceContextProvider } from "features/Resource/ResourceContext";
import { ResourceType } from "features/Resource/types/ResourceType";
import { Tab } from "features/Resource/types/Tab";
import { useEffect } from "react";
import { isHomePage } from "utils/topicUtils";
import BasicHead from "common/components/layout/BasicHead";
import Layout from "common/components/layout/Layout";

function TopicPage() {
    const { handleCurrentTabChange, currentCategory, currentLocation } = useNav();

    useEffect(() => {
        handleCurrentTabChange('Topic');
    }, [ handleCurrentTabChange ]);

    const title = isHomePage(currentCategory, currentLocation)
        ? 'goSolve | Welcome'
        : `goSolve | ${currentCategory?.category ?? ''} in ${currentLocation?.location ?? ''}`;

    return (
        <>
            <BasicHead title={title} />
            <ResourceContextProvider resourceType={'Topic'}>
                <Layout>
                    <Topic />
                </Layout>
            </ResourceContextProvider>
        </>
    );
}

export default TopicPage;
