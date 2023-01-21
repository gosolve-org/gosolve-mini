import CommunityOverview from "components/pages/category/location/CommunityOverview";
import { ResourceType } from "models/ResourceType";
import { Tab } from "models/Tab";
import { DataContext } from "pages/_app";
import { useContext, useEffect } from "react";

function ActionCommunityPage() {
	const { handleCurrentTabChange } = useContext(DataContext);

	useEffect(() => {
		handleCurrentTabChange(Tab.Community);
	}, []);

	return <CommunityOverview resourceType={ResourceType.Action} />;
}

export default ActionCommunityPage;
