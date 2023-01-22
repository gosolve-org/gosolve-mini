import ActionsOverview from "components/pages/category/location/ActionsOverview";
import { Tab } from "models/Tab";
import { DataContext } from "pages/_app";
import { useContext, useEffect } from "react";

function TopicActionsOverviewPage() {
	const { handleCurrentTabChange } = useContext(DataContext);

	useEffect(() => {
		handleCurrentTabChange(Tab.Actions);
	}, [ handleCurrentTabChange ]);

	return <ActionsOverview />;
}

export default TopicActionsOverviewPage;
