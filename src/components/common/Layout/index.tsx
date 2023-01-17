import { useRouter } from "next/router";
import React, { ReactNode } from "react";

import Navbar from "./Navbar";
import Header from "./Header";

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

	return (
		<div>
			<Navbar />
			{categoryId && locationId ? <Header /> : null}
			<main>{children}</main>
		</div>
	);
}

export default Layout;
