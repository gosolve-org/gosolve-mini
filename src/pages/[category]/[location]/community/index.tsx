import BasicHead from "components/common/Layout/BasicHead";
import CommunityOverview from "components/pages/category/location/CommunityOverview";
import { DataContext } from "context/DataContext";
import { ResourceType } from "models/ResourceType";
import { Tab } from "models/Tab";
import { useContext, useEffect } from "react";

function TopicCommunityPage() {
    const { handleCurrentTabChange } = useContext(DataContext);

    useEffect(() => {
        handleCurrentTabChange(Tab.Community);
    }, [ handleCurrentTabChange ]);

    return (<>
        <BasicHead title="goSolve | Community" />
        <CommunityOverview resourceType={ResourceType.Topic} />
    </>);
}

export default TopicCommunityPage;
