import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "context/AuthContext";
import Loader from "./Loader";
import { UNPROTECTED_ROUTES } from "constants/protectedRoutes";

interface ProtectedRouteProps {
	children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { user } = useAuth();
	const router = useRouter();
	const routerPath = router.pathname;

	useEffect(() => {
		if (!user && !UNPROTECTED_ROUTES.includes(routerPath)) {
			router.push("/login");
		}
	}, [router, routerPath, user]);

	return (
		<>
			{user || !UNPROTECTED_ROUTES.includes(routerPath) ? (
				children
			) : (
				<Loader />
			)}
		</>
	);
};

export default ProtectedRoute;
