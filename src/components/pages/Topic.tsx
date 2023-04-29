import BasicHead from "components/common/layout/BasicHead";
import Layout from "components/common/layout/Layout";
import Resource from "components/common/Resource";
import { useNav } from "contexts/NavigationContext";

function Topic() {
    const { currentCategory, currentLocation } = useNav();

    const renderActions = () => {
        /*
        return (isMobile
            ? <>
                <MobileHorizontalScroll className="row-fullscreen left-0 mt-5" childrenClassName="mx-2">
                    {cards}
                </MobileHorizontalScroll>
            </>
            : <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {cards}
            </ul>
        );
        */
    };

    return (
        <Layout>
            <BasicHead title={`goSolve | ${currentCategory?.category ?? ''} in ${currentLocation?.location ?? ''}`} />
            <div className="flex min-h-full flex-col justify-center items-center py-6 sm:py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-screen-2xl">
                    <Resource />
                </div>
            </div>
        </Layout>
    );
}

export default Topic;
