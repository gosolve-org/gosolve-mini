import Topic from "components/pages/category/location/Topic";
import { DataContext } from "context/DataContext";
import { Tab } from "models/Tab";
import { useContext, useEffect } from "react";

function TopicPage() {
	const { handleCurrentTabChange } = useContext(DataContext);

	useEffect(() => {
		handleCurrentTabChange(Tab.Topic);
	}, [ handleCurrentTabChange ]);

	return (
		<Topic />
	);
}

export default TopicPage;
