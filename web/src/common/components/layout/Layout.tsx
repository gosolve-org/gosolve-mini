import { useRouter } from 'next/router';
import { type ReactNode } from 'react';
import Navbar from 'features/Nav/Navbar';
import PostHeader from 'features/Post/PostHeader';
import ActionHeader from 'features/Resource/Action/ActionHeader';
import TopicHeader from 'features/Resource/Topic/TopicHeader';
import BasicToast from './BasicToast';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();

    const categoryQuery = router?.query?.category?.toString() ?? '';
    const locationQuery = router?.query?.location?.toString() ?? '';
    const actionId = router?.query?.actionId?.toString() ?? '';
    const postId = router?.query?.postId?.toString() ?? '';

    const renderHeader = () => {
        if (categoryQuery.length > 0 && locationQuery.length > 0) {
            if (postId !== '') return <PostHeader />;
            if (actionId !== '') return <ActionHeader />;

            return <TopicHeader />;
        }
        return null;
    };

    return (
        <div>
            <Navbar />
            {renderHeader()}
            <main>{children}</main>
            <BasicToast />
        </div>
    );
};

export default Layout;
