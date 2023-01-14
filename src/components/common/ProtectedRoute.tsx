import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "context/AuthContext";

interface ProtectedRouteProps {
	children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { user } = useAuth();
	const router = useRouter();
	const routerPath = router.pathname;

	useEffect(() => {
		if (!user && routerPath !== "/login") {
			router.push("/login");
		}
	}, [router, routerPath, user]);

	return (
		<>{user || routerPath == "/login" ? children : <div>Loading...</div>}</>
	);
};

export default ProtectedRoute;
