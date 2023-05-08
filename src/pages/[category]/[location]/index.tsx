import Topic from "components/pages/Topic";
import { useNav } from "contexts/NavigationContext";
import { ResourceContextProvider } from "contexts/ResourceContext";
import { ResourceType } from "models/ResourceType";
import { Tab } from "models/Tab";
import { useEffect } from "react";
import { getPlaiceholder } from "plaiceholder";
import { ServerPropsContextProvider } from "contexts/ServerPropsContext";
import { GetStaticPaths } from "next";

export async function getStaticProps() {
    const { base64 } = await getPlaiceholder(
      "https://images.unsplash.com/photo-1621961458348-f013d219b50c?auto=format&fit=crop&w=2850&q=80"
    );
  
    return {
        props: {
            bannerBlurBase64: base64,
        },
    };
};

export const getStaticPaths: GetStaticPaths<{ category: string, location: string }> = async () => {

    return {
        paths: [],
        fallback: 'blocking',
    }
}

function TopicPage({ bannerBlurBase64 }: { bannerBlurBase64: string }) {
    const { handleCurrentTabChange } = useNav();

    useEffect(() => {
        handleCurrentTabChange(Tab.Topic);
    }, [ handleCurrentTabChange ]);

    return (
        <ServerPropsContextProvider bannerBlurBase64={bannerBlurBase64}>
            <ResourceContextProvider resourceType={ResourceType.Topic}>
                <Topic />
            </ResourceContextProvider>
        </ServerPropsContextProvider>
    );
}

export default TopicPage;
