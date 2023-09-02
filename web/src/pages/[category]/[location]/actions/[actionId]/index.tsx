import { useNav } from 'features/Nav/NavigationContext';
import { ResourceContextProvider } from 'features/Resource/ResourceContext';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { db } from 'utils/firebase';
import BasicHead from 'common/components/layout/BasicHead';
import Layout from 'common/components/layout/Layout';
import Action from 'features/Resource/Action/Action';

const TopicActionPage = () => {
    const router = useRouter();
    const { handleCurrentTabChange } = useNav();

    const actionId = router?.query?.actionId?.toString();

    const [actionSnapshot] = useDocumentOnce(doc(db, 'actions', actionId ?? ''));

    useEffect(() => {
        handleCurrentTabChange('Action');
    }, [handleCurrentTabChange]);

    return (
        <>
            <BasicHead title={`goSolve | ${actionSnapshot?.data()?.title ?? ''}`} />
            <ResourceContextProvider resourceType="Action">
                <Layout>
                    <Action />
                </Layout>
            </ResourceContextProvider>
        </>
    );
};

export default TopicActionPage;
