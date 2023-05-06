import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "contexts/AuthContext";
import Loader from "../common/layout/Loader";
import { PROTECTED_ROUTES } from "constants/protectedRoutes";
import Route from "./Route";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const routerPath = router.pathname;

    useEffect(() => {
        if (!isAuthenticated() && PROTECTED_ROUTES.includes(routerPath)) {
            router.push("/login");
        }
    }, [router, routerPath, isAuthenticated]);

    return (
        <>
            {isAuthenticated() || !PROTECTED_ROUTES.includes(routerPath) ? (
                <Route>
                    {children}
                </Route>
            ) : (
                <Loader />
            )}
        </>
    );
}

export default ProtectedRoute;
