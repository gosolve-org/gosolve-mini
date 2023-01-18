import { useRouter } from "next/router";
import React, { ReactNode } from "react";

import Navbar from "./Navbar";
import Header from "./Header";
import ActionHeader from "./ActionHeader";
import PostHeader from "./PostHeader";

interface LayoutProps {
	children: ReactNode;
}

function Layout({ children }: LayoutProps) {
	const router = useRouter();

	const categoryQuery = router?.query?.category
		? router?.query?.category.toString()
		: "";
	const locationQuery = router?.query?.location
		? router?.query?.location.toString()
		: "";
	const actionId = router?.query?.action
		? router?.query?.action.toString()
		: "";
	const postId = router?.query?.post ? router?.query?.post.toString() : "";

	const renderHeader = () => {
		if (categoryQuery && locationQuery) {
			if (postId) return <PostHeader />;
			else if (actionId) return <ActionHeader />;

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
