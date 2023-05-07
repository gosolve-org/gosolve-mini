import Topic from "components/pages/Topic";
import { useNav } from "contexts/NavigationContext";
import { ResourceContextProvider } from "contexts/ResourceContext";
import { ResourceType } from "models/ResourceType";
import { Tab } from "models/Tab";
import { useEffect } from "react";

function TopicPage() {
    const { handleCurrentTabChange } = useNav();

    useEffect(() => {
        handleCurrentTabChange(Tab.Topic);
    }, [ handleCurrentTabChange ]);

    return (
        <ResourceContextProvider resourceType={ResourceType.Topic}>
            <Topic />
        </ResourceContextProvider>
    );
}

export default TopicPage;
