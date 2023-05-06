import Action from "components/pages/Action";
import { useNav } from "contexts/NavigationContext";
import { ResourceContextProvider } from "contexts/ResourceContext";
import { ResourceType } from "models/ResourceType";
import { Tab } from "models/Tab";
import { useEffect } from "react";

function TopicActionPage() {
    const { handleCurrentTabChange } = useNav();

    useEffect(() => {
        handleCurrentTabChange(Tab.Action);
    }, [ handleCurrentTabChange ]);

    return (
        <ResourceContextProvider resourceType={ResourceType.Action}>
            <Action />
        </ResourceContextProvider>
    );
}

export default TopicActionPage;
