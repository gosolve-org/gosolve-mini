import Action from "components/pages/category/location/Action";
import { Tab } from "models/Tab";
import { DataContext } from "pages/_app";
import { useContext, useEffect } from "react";

function TopicActionPage() {
	const { handleCurrentTabChange } = useContext(DataContext);

	useEffect(() => {
		handleCurrentTabChange(Tab.Action);
	}, []);

	return <Action />;
}

export default TopicActionPage;
