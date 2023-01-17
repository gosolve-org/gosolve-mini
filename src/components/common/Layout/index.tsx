import { useRouter } from "next/router";
import React, { ReactNode } from "react";

import Navbar from "./Navbar";
import Header from "./Header";
import ActionHeader from "./ActionHeader";

interface LayoutProps {
	children: ReactNode;
}

function Layout({ children }: LayoutProps) {
	const router = useRouter();

	const categoryId = router?.query?.category
		? router?.query?.category.toString()
		: "";
	const locationId = router?.query?.location
		? router?.query?.location.toString()
		: "";
	const actionId = router?.query?.action
		? router?.query?.action.toString()
		: "";

	const renderHeader = () => {
		if (categoryId && locationId) {
			if (actionId) return <ActionHeader />;

			return <Header />;
		}
		return null;
	};

	return (
		<div>
			<Navbar />
			{renderHeader()}
			<main>{children}</main>
		</div>
	);
}

export default Layout;
