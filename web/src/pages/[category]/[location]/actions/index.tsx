import ActionsOverview from 'features/Resource/Action/ActionsOverview';
import { useNav } from 'features/Nav/NavigationContext';
import { ResourceContextProvider } from 'features/Resource/ResourceContext';
import { useEffect } from 'react';
import BasicHead from 'common/components/layout/BasicHead';
import Layout from 'common/components/layout/Layout';

const TopicActionsOverviewPage = () => {
    const { handleCurrentTabChange } = useNav();

    useEffect(() => {
        handleCurrentTabChange('Actions');
    }, [handleCurrentTabChange]);

    return (
        <>
            <BasicHead title="goSolve | Actions" />
            <ResourceContextProvider resourceType="Action">
                <Layout>
                    <ActionsOverview />
                </Layout>
            </ResourceContextProvider>
        </>
    );
};

export default TopicActionsOverviewPage;
