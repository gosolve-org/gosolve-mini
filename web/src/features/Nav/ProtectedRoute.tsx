import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "features/Auth/AuthContext";
import { PROTECTED_ROUTES } from "features/Nav/protectedRoutes";
import Route from "./Route";
import Loader from "common/components/layout/Loader";

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
