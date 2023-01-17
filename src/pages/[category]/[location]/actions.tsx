import { useRouter } from "next/router";
import MultipleActions from "components/pages/category/location/MultipleActions";
import SingleAction from "components/pages/category/location/SingleAction";
import ActionCommunity from "components/pages/category/location/ActionCommunity";

function Actions() {
	const router = useRouter();
	const actionId = router?.query?.action
		? router?.query?.action.toString()
		: "";

	const tabId = router?.query?.tab ? router?.query?.tab.toString() : "";

	const renderPage = () => {
		if (actionId) {
			if (tabId === "community") return <ActionCommunity />;
			return <SingleAction />;
		}

		return <MultipleActions />;
	};

	return <>{renderPage()}</>;
}

export default Actions;
4;
