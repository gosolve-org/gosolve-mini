import Action from "components/pages/category/location/Action";
import { DataContext } from "context/DataContext";
import { Tab } from "models/Tab";
import { useContext, useEffect } from "react";

function TopicActionPage() {
	const { handleCurrentTabChange } = useContext(DataContext);

	useEffect(() => {
		handleCurrentTabChange(Tab.Action);
	}, [ handleCurrentTabChange ]);

	return <Action />;
}

export default TopicActionPage;
