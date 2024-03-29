import { useRouter } from "next/router";
import React, { ReactNode } from "react";

import Navbar from "../../nav/navbar/Navbar";
import TopicHeader from "../../headers/TopicHeader";
import ActionHeader from "../../headers/ActionHeader";
import PostHeader from "../../headers/PostHeader";
import BasicToast from "./BasicToast";

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    const router = useRouter();

    const categoryQuery = router?.query?.category?.toString() ?? '';
    const locationQuery = router?.query?.location?.toString() ?? '';
    const actionId = router?.query?.actionId?.toString() ?? '';
    const postId = router?.query?.postId?.toString() ?? '';

    const renderHeader = () => {
        if (categoryQuery && locationQuery) {
            if (postId) return <PostHeader />;
            else if (actionId) return <ActionHeader />;

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
}

export default Layout;
