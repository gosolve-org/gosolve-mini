import BasicHead from "components/common/layout/BasicHead";
import Layout from "components/common/layout/Layout";
import Resource from "components/common/Resource";
import { useNav } from "contexts/NavigationContext";
import { isHomePage } from "utils/topicUtils";

function Topic() {
    const { currentCategory, currentLocation } = useNav();

    const title = isHomePage(currentCategory, currentLocation)
        ? 'goSolve | Welcome'
        : `goSolve | ${currentCategory?.category ?? ''} in ${currentLocation?.location ?? ''}`;

    return (
        <Layout>
            <BasicHead title={title} />
            <div className="flex min-h-full flex-col justify-center items-center py-6 xl:py-12 xl:px-6">
                <div className="w-full max-w-screen-2xl">
                    <Resource />
                </div>
            </div>
        </Layout>
    );
}

export default Topic;
